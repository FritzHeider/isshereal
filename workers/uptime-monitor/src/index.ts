interface Env {
  UPTIME_KV: KVNamespace;
  SITE_URL: string;
  ALERT_THRESHOLD_MS: string;
}

interface CheckResult {
  timestamp: number;
  homeStatus: number;
  homeTime: number;
  apiStatus: number;
  apiTime: number;
  success: boolean;
}

interface HealthStatus {
  currentStatus: 'up' | 'down';
  avgResponseTime1h: number;
  uptime24h: number;
  recentChecks: CheckResult[];
}

async function performCheck(env: Env): Promise<CheckResult> {
  const timestamp = Date.now();
  
  const homeStart = Date.now();
  let homeStatus = 500;
  try {
    const res = await fetch(env.SITE_URL, { method: 'GET', headers: { 'User-Agent': 'UptimeMonitor/1.0' } });
    homeStatus = res.status;
  } catch (e) {
    homeStatus = 0;
  }
  const homeTime = Date.now() - homeStart;

  const apiStart = Date.now();
  let apiStatus = 500;
  try {
    const res = await fetch(`${env.SITE_URL}/api/audit?handle=nike&platform=instagram`, { method: 'GET', headers: { 'User-Agent': 'UptimeMonitor/1.0' } });
    apiStatus = res.status;
  } catch (e) {
    apiStatus = 0;
  }
  const apiTime = Date.now() - apiStart;

  const success = homeStatus >= 200 && homeStatus < 400 && apiStatus >= 200 && apiStatus < 400;

  const result: CheckResult = { timestamp, homeStatus, homeTime, apiStatus, apiTime, success };
  
  await env.UPTIME_KV.put(`check:${timestamp}`, JSON.stringify(result), { expirationTtl: 86400 * 7 });
  
  const currentStatusStr = await env.UPTIME_KV.get('status:current');
  let status: HealthStatus = currentStatusStr ? JSON.parse(currentStatusStr) : {
    currentStatus: 'up',
    avgResponseTime1h: 0,
    uptime24h: 100,
    recentChecks: []
  };

  status.currentStatus = success ? 'up' : 'down';
  status.recentChecks.unshift(result);
  if (status.recentChecks.length > 288) { // 24 hours of 5-minute checks
    status.recentChecks = status.recentChecks.slice(0, 288);
  }

  const lastHourChecks = status.recentChecks.slice(0, 12);
  if (lastHourChecks.length > 0) {
    const totalTime = lastHourChecks.reduce((acc, c) => acc + c.homeTime + c.apiTime, 0);
    status.avgResponseTime1h = totalTime / (lastHourChecks.length * 2);
  }

  const last24hChecks = status.recentChecks;
  if (last24hChecks.length > 0) {
    const successfulChecks = last24hChecks.filter(c => c.success).length;
    status.uptime24h = (successfulChecks / last24hChecks.length) * 100;
  }

  await env.UPTIME_KV.put('status:current', JSON.stringify(status));
  
  return result;
}

export default {
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(performCheck(env));
  },

  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/status') {
      const statusStr = await env.UPTIME_KV.get('status:current');
      const status = statusStr ? JSON.parse(statusStr) : { error: 'No data available yet.' };
      
      if (status.recentChecks) {
        status.recentChecks = status.recentChecks.slice(0, 10);
      }
      
      return new Response(JSON.stringify(status), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    if (url.pathname === '/status/badge') {
      const statusStr = await env.UPTIME_KV.get('status:current');
      const status: HealthStatus = statusStr ? JSON.parse(statusStr) : { uptime24h: 0, currentStatus: 'down' as 'up'|'down', avgResponseTime1h: 0, recentChecks: [] };
      const color = status.uptime24h > 99 ? 'brightgreen' : status.uptime24h > 95 ? 'yellow' : 'red';
      const text = `${status.uptime24h.toFixed(2)}%`;
      
      const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="104" height="20">
  <linearGradient id="b" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <mask id="a">
    <rect width="104" height="20" rx="3" fill="#fff"/>
  </mask>
  <g mask="url(#a)">
    <path fill="#555" d="M0 0h48v20H0z"/>
    <path fill="${color === 'brightgreen' ? '#4c1' : color === 'yellow' ? '#dfb317' : '#e05d44'}" d="M48 0h56v20H48z"/>
    <path fill="url(#b)" d="M0 0h104v20H0z"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
    <text x="24" y="15" fill="#010101" fill-opacity=".3">uptime</text>
    <text x="24" y="14">uptime</text>
    <text x="75" y="15" fill="#010101" fill-opacity=".3">${text}</text>
    <text x="75" y="14">${text}</text>
  </g>
</svg>`;
      
      return new Response(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      });
    }

    return new Response('Not Found', { status: 404 });
  }
};
