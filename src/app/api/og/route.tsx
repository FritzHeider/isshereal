import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handle = searchParams.get('handle') || 'unknown';
  const score = parseInt(searchParams.get('score') || '50');
  const verdict = score >= 75 ? 'Likely Authentic' : score >= 50 ? 'Mixed Signals' : 'High Risk';
  const scoreColor = score >= 75 ? '#059669' : score >= 50 ? '#d97706' : '#e11d48';

  return new ImageResponse(
    (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: '#0f172a', color: 'white', fontFamily: 'sans-serif', padding: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' }}>✓</div>
          <span style={{ fontSize: '32px', fontWeight: '800' }}>isshereal.com</span>
        </div>
        <div style={{ fontSize: '28px', color: '#94a3b8', marginBottom: '24px' }}>Authenticity Audit Report</div>
        <div style={{ fontSize: '48px', fontWeight: '900', marginBottom: '16px' }}>@{handle}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
          <span style={{ fontSize: '96px', fontWeight: '900', color: scoreColor }}>{score}</span>
          <span style={{ fontSize: '36px', color: '#64748b' }}>/100</span>
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: scoreColor, padding: '8px 24px', borderRadius: '999px', border: `2px solid ${scoreColor}` }}>{verdict}</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
