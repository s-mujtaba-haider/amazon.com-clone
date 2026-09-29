import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Home-screen icon for iOS: the Kyro mark on a full-bleed gradient (iOS rounds the corners itself). */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: 'linear-gradient(135deg,#7c5cff 0%,#b24dff 50%,#ff6b3d 100%)' }}>
        <svg viewBox="0 0 40 40" width="180" height="180">
          <path d="M14 11v18" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" />
          <path d="M26.5 29 18.2 20.2l6.3-6.6" fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M29 5.5c.5 2.6 1.9 4 4.5 4.5-2.6.5-4 1.9-4.5 4.5-.5-2.6-1.9-4-4.5-4.5 2.6-.5 4-1.9 4.5-4.5Z" fill="#ffd166" />
        </svg>
      </div>
    ),
    size,
  );
}
