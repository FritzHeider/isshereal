import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon: a contact-sheet frame with three developed cells and one ghost, under the safelight. */
export default function AppleIcon() {
  const cell = (filled: boolean) => ({
    width: 34,
    height: 34,
    background: filled ? '#f2af48' : 'transparent',
    border: filled ? 'none' : '3px dashed #6cc7d7',
  });
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#170c0a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 18, right: 18, width: 22, height: 22, borderRadius: 11, background: '#de3d34' }} />
        <div style={{ width: 112, height: 112, border: '6px solid #f2d8ca', display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: 10, padding: 8 }}>
          <div style={cell(true)} />
          <div style={cell(false)} />
          <div style={cell(true)} />
          <div style={cell(true)} />
        </div>
      </div>
    ),
    size,
  );
}
