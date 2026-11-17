import type { Metadata, Viewport } from 'next';
import { ThemeProvider, THEME_BOOT_SCRIPT } from '@/components/ThemeProvider';
import './globals.css';
import { DirectHeader, DirectFooter } from '@/components/direct/DirectChrome';
import { ToastContainer } from '@/components/Toast';

const DESCRIPTION =
  'Free fake follower and fake profile checker for Instagram, TikTok, YouTube, X, dating apps, marketplaces and freelancers. No sign-up, nothing locked.';
const DEFAULT_TITLE = 'isshereal.com · Free fake follower checker';

export const metadata: Metadata = {
  metadataBase: new URL('https://isshereal.com'),
  title: {
    default: DEFAULT_TITLE,
    template: '%s · isshereal.com',
  },
  description: DESCRIPTION,
  applicationName: 'isshereal.com',
  openGraph: {
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    url: 'https://isshereal.com',
    siteName: 'isshereal.com',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'isshereal.com fake follower check: 33% real, 67% fake.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DESCRIPTION,
    images: ['/api/og'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to main content</a>
        <svg className="sr-only" aria-hidden="true" focusable="false">
          <defs>
            {/* Silver grain for enlargements: breaks up flat cells like real emulsion */}
            <filter id="silver-grain" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5063" result="noise" />
              <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.8 1.3" result="mask" />
              <feComposite in="SourceGraphic" in2="mask" operator="in" />
            </filter>
            {/* Grease pencil: wax drags and breaks at the edges */}
            <filter id="grease-wax" x="-5%" y="-10%" width="110%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="1" seed="12" result="t" />
              <feDisplacementMap in="SourceGraphic" in2="t" scale="1.6" result="d" />
              <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="1" seed="3" result="s" />
              <feColorMatrix in="s" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2 1.75" result="holes" />
              <feComposite in="d" in2="holes" operator="in" />
            </filter>
          </defs>
        </svg>
        <ThemeProvider>
          <DirectHeader />
          <main id="main" tabIndex={-1}>{children}</main>
          <DirectFooter />
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
