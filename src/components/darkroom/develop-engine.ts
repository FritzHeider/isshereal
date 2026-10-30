/**
 * Develop engine: renders a print coming up in the developer tray.
 *
 * The portrait is divided into a grid of grain cells. Each cell is one
 * slice of the audience: genuine cells develop fully into silver density taken
 * from the portrait; ghost cells barely develop and stay pale. Cell layout
 * and timing are seeded from the handle, so a print always comes up the
 * same way, and the share of ghost cells equals the report's fake share.
 *
 * WebGL 1 fragment shader first; Canvas 2D fallback; if neither can read the
 * image (tainted cross-origin avatar), start() resolves false and the CSS
 * still stays visible.
 */

export interface DevelopOptions {
  canvas: HTMLCanvasElement;
  image: HTMLImageElement | null;
  realPct: number;
  seed: string;
  cells?: number;
}

export interface DevelopEngine {
  /** Draw a given development progress, 0 (blank paper) to 1 (fixed). */
  render(progress: number, time?: number): void;
  resize(): void;
  destroy(): void;
  readonly kind: 'webgl' | 'canvas';
}

const MAX_DPR = 2;

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Per-cell data: R = genuine (255) or ghost (0), G = start delay 0..255. */
function buildMask(cells: number, realPct: number, seed: string): Uint8Array {
  const r = rng(hashSeed(seed));
  const n = cells * cells;
  const ghostCount = Math.round((n * Math.max(0, Math.min(100, 100 - realPct))) / 100);
  const data = new Uint8Array(n * 4);
  // Ghosts arrive together: pick a few cluster centres and fill ghosts nearest to them first.
  const centres = Array.from({ length: 3 }, () => [r() * cells, r() * cells]);
  const order = Array.from({ length: n }, (_, i) => {
    const x = i % cells;
    const y = Math.floor(i / cells);
    const d = Math.min(...centres.map(([cx, cy]) => Math.hypot(x - cx, y - cy)));
    return { i, k: d + r() * cells * 0.35 };
  }).sort((a, b) => a.k - b.k);
  const ghost = new Set(order.slice(0, ghostCount).map((o) => o.i));
  for (let i = 0; i < n; i++) {
    data[i * 4] = ghost.has(i) ? 0 : 255;
    data[i * 4 + 1] = Math.floor(r() * 255);
    data[i * 4 + 2] = Math.floor(r() * 255);
    data[i * 4 + 3] = 255;
  }
  return data;
}

function sizeCanvas(canvas: HTMLCanvasElement) {
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const rect = canvas.getBoundingClientRect();
  const w = Math.max(1, Math.round(rect.width * dpr));
  const h = Math.max(1, Math.round(rect.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h };
}

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_image;
uniform sampler2D u_mask;
uniform float u_cells;
uniform float u_progress;
uniform float u_time;
uniform vec3 u_paper;
uniform vec3 u_silver;
uniform vec3 u_ghost;
uniform float u_hasImage;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float portrait(vec2 uv) {
  if (u_hasImage > 0.5) {
    vec3 c = texture2D(u_image, uv).rgb;
    float l = dot(c, vec3(0.299, 0.587, 0.114));
    // push contrast like a hard flash print
    return clamp((l - 0.5) * 1.35 + 0.5, 0.0, 1.0);
  }
  // no photo: a soft silhouette lit from the top right
  vec2 p = uv - vec2(0.5, 0.42);
  float head = smoothstep(0.24, 0.2, length(p * vec2(1.15, 0.9)));
  float body = smoothstep(0.02, -0.02, length((uv - vec2(0.5, 1.12)) * vec2(0.9, 1.6)) - 0.5);
  return 1.0 - 0.75 * max(head, body);
}

void main() {
  float fixedAmt = smoothstep(0.92, 1.0, u_progress);
  // liquid refraction while the print is wet, gone once it is fixed
  float wet = (1.0 - fixedAmt) * step(0.001, u_progress);
  vec2 uv = v_uv + wet * 0.004 * vec2(sin(v_uv.y * 18.0 + u_time * 1.4), cos(v_uv.x * 14.0 + u_time * 1.1));

  vec2 cell = floor(uv * u_cells);
  vec4 m = texture2D(u_mask, (cell + 0.5) / u_cells);
  float isReal = step(0.5, m.r);
  float delay = m.g * 0.55;
  float local = clamp((u_progress - delay) / 0.45, 0.0, 1.0);
  local = local * local * (3.0 - 2.0 * local);
  float dev = mix(local * 0.07, local, isReal);

  float density = (1.0 - portrait(uv)) * dev;
  vec3 col = mix(u_paper, u_silver, density);

  // ghosts: a faint cold veil once the rest of the print has come up
  col = mix(col, u_ghost, (1.0 - isReal) * local * 0.16);

  // cell gutters read as grain structure, strongest on developed cells
  vec2 f = fract(uv * u_cells);
  float gutter = step(0.92, max(f.x, f.y));
  col = mix(col, col * 0.93, gutter * isReal * local);

  // silver grain
  float g = hash(floor(v_uv * 900.0) + floor(u_time * 8.0) * wet);
  col += (g - 0.5) * 0.055;

  gl_FragColor = vec4(col, 1.0);
}`;

function rgb(css: string, fallback: [number, number, number]): [number, number, number] {
  // Resolve any CSS color (including oklch) to sRGB via a 1px canvas.
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 1;
    const ctx = c.getContext('2d');
    if (!ctx) return fallback;
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255];
  } catch {
    return fallback;
  }
}

function palette(el: Element) {
  const cs = getComputedStyle(el);
  return {
    paper: rgb(cs.getPropertyValue('--c-paper').trim(), [0.945, 0.902, 0.855]),
    silver: rgb('oklch(0.16 0.015 40)', [0.12, 0.08, 0.07]),
    ghost: rgb(cs.getPropertyValue('--c-cyan').trim(), [0.42, 0.78, 0.84]),
  };
}

function createWebGL(opts: DevelopOptions, cells: number, mask: Uint8Array): DevelopEngine | null {
  const gl = opts.canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: false });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader');
    return sh;
  };
  let prog: WebGLProgram;
  try {
    prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  } catch {
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = (unit: number) => {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  };

  const imgTex = tex(0);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  let hasImage = 0;
  if (opts.image) {
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, opts.image);
      hasImage = 1;
    } catch {
      // cross-origin image without CORS: fall back to the silhouette
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    }
  } else {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
  }

  tex(1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cells, cells, 0, gl.RGBA, gl.UNSIGNED_BYTE, mask);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const pal = palette(opts.canvas);
  gl.uniform1i(u('u_image'), 0);
  gl.uniform1i(u('u_mask'), 1);
  gl.uniform1f(u('u_cells'), cells);
  gl.uniform3fv(u('u_paper'), pal.paper);
  gl.uniform3fv(u('u_silver'), pal.silver);
  gl.uniform3fv(u('u_ghost'), pal.ghost);
  gl.uniform1f(u('u_hasImage'), hasImage);
  const uProgress = u('u_progress');
  const uTime = u('u_time');

  const resize = () => {
    const { w, h } = sizeCanvas(opts.canvas);
    gl.viewport(0, 0, w, h);
  };
  resize();

  return {
    kind: 'webgl',
    render(progress, time = 0) {
      gl.uniform1f(uProgress, progress);
      gl.uniform1f(uTime, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    resize,
    destroy() {
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}

function createCanvas2D(opts: DevelopOptions, cells: number, mask: Uint8Array): DevelopEngine | null {
  const ctx = opts.canvas.getContext('2d');
  if (!ctx) return null;
  // Sample portrait luminance once into a cells×cells grid.
  const lum = new Float32Array(cells * cells).fill(0.7);
  if (opts.image) {
    try {
      const off = document.createElement('canvas');
      off.width = off.height = cells;
      const octx = off.getContext('2d')!;
      octx.drawImage(opts.image, 0, 0, cells, cells);
      const d = octx.getImageData(0, 0, cells, cells).data;
      for (let i = 0; i < cells * cells; i++) {
        const l = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) / 255;
        lum[i] = Math.min(1, Math.max(0, (l - 0.5) * 1.35 + 0.5));
      }
    } catch {
      /* tainted: keep the flat tone */
    }
  }
  const pal = palette(opts.canvas);
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  let w = 0;
  let h = 0;
  const resize = () => ({ w, h } = sizeCanvas(opts.canvas));
  resize();

  return {
    kind: 'canvas',
    render(progress) {
      const cw = w / cells;
      const ch = h / cells;
      for (let i = 0; i < cells * cells; i++) {
        const real = mask[i * 4] > 127;
        const delay = (mask[i * 4 + 1] / 255) * 0.55;
        let local = Math.min(1, Math.max(0, (progress - delay) / 0.45));
        local = local * local * (3 - 2 * local);
        const dev = real ? local : local * 0.07;
        const density = (1 - lum[i]) * dev;
        let r = mix(pal.paper[0], pal.silver[0], density);
        let g = mix(pal.paper[1], pal.silver[1], density);
        let b = mix(pal.paper[2], pal.silver[2], density);
        if (!real) {
          const t = local * 0.16;
          r = mix(r, pal.ghost[0], t);
          g = mix(g, pal.ghost[1], t);
          b = mix(b, pal.ghost[2], t);
        }
        ctx.fillStyle = `rgb(${(r * 255) | 0},${(g * 255) | 0},${(b * 255) | 0})`;
        ctx.fillRect((i % cells) * cw, Math.floor(i / cells) * ch, Math.ceil(cw), Math.ceil(ch));
      }
    },
    resize,
    destroy() {},
  };
}

export function createDevelopEngine(opts: DevelopOptions): DevelopEngine | null {
  const cells = opts.cells ?? 48;
  const mask = buildMask(cells, opts.realPct, opts.seed);
  return createWebGL(opts, cells, mask) ?? createCanvas2D(opts, cells, mask);
}

/** Solve a CSS cubic-bezier(x1, y1, x2, y2) timing function for progress t. */
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const err = sx(t) - x;
      const d = dx(t);
      if (Math.abs(err) < 1e-4 || Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    return sy(Math.min(1, Math.max(0, t)));
  };
}

/** Read a duration token (e.g. "2800ms" or "1.2s") and an easing token from CSS. */
export function motionTokens(el: Element, dur: string, ease: string) {
  const cs = getComputedStyle(el);
  const raw = cs.getPropertyValue(dur).trim();
  const ms = raw.endsWith('ms') ? parseFloat(raw) : raw.endsWith('s') ? parseFloat(raw) * 1000 : parseFloat(raw) || 0;
  const m = cs.getPropertyValue(ease).match(/cubic-bezier\(([^)]+)\)/);
  const [a, b, c, d] = m ? m[1].split(',').map(Number) : [0.7, 0, 0.3, 1];
  return { ms, ease: cubicBezier(a, b, c, d) };
}
