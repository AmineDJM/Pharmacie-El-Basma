import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/constants';

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #0e8a6b 0%, #0a6f57 60%, #084c3d 100%)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              background: 'rgba(255,255,255,0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ position: 'relative', width: 46, height: 54, display: 'flex' }}>
              <div style={{ position: 'absolute', left: 3, top: 0, width: 40, height: 44, background: 'white', borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%' }} />
              <div style={{ position: 'absolute', left: 21, top: 12, width: 4, height: 36, background: '#0a6f57', borderRadius: 2 }} />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 22, letterSpacing: 6, opacity: 0.85 }}>PARAPHARMACIE</span>
            <span style={{ fontSize: 40, fontWeight: 800 }}>El Basma</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, maxWidth: 900 }}>
            Votre santé et votre beauté, entre de bonnes mains
          </div>
          <div style={{ fontSize: 30, opacity: 0.9 }}>
            Dermocosmétique · Compléments · Soins bébé · Conseils
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28 }}>
          <div style={{ background: 'rgba(255,255,255,0.16)', padding: '10px 22px', borderRadius: 999 }}>
            Boufarik · Wilaya de Blida · Algérie
          </div>
          <div style={{ opacity: 0.85 }}>parapharmacie-elbasma.dz</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
