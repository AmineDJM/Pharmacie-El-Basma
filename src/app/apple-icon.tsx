import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #13a47f 0%, #0a6f57 100%)',
        }}
      >
        <div style={{ position: 'relative', width: 92, height: 104, display: 'flex' }}>
          {/* leaf/drop body */}
          <div
            style={{
              position: 'absolute',
              left: 6,
              top: 0,
              width: 80,
              height: 86,
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%',
            }}
          />
          {/* vertical stem */}
          <div style={{ position: 'absolute', left: 42, top: 26, width: 8, height: 64, background: '#0a6f57', borderRadius: 4 }} />
          {/* base */}
          <div style={{ position: 'absolute', left: 32, top: 92, width: 28, height: 11, background: 'rgba(255,255,255,0.95)', borderRadius: 6 }} />
        </div>
      </div>
    ),
    { ...size },
  );
}
