import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon: a white check on the site's blue. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', background: '#2457d6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="110" height="110" viewBox="0 0 64 64">
          <path d="M14 33.5l11 11 25-26" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
