import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/ThemeProvider';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://isshereal.com'),
  title: 'isshereal.com — Authenticity Analytics for Everyone',
  description:
    'Analyze any Instagram, TikTok, YouTube, dating, marketplace or freelance profile for fake followers, bots, catfish and scams — with a real authenticity score and AI verdict.',
  openGraph: {
    title: 'isshereal.com — Authenticity Analytics & Bot Detector',
    description:
      'Analyze any profile for fake followers, bots, catfish and scams — with real metrics and AI forensic verdict.',
    url: 'https://isshereal.com',
    siteName: 'isshereal.com',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'isshereal.com Authenticity Intelligence',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'isshereal.com — Authenticity Analytics for Everyone',
    description:
      'Analyze any profile for fake followers, bots, catfish and scams — with real metrics and AI forensic verdict.',
    images: ['/images/og-image.png'],
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Resource hints: establish early connections per modern-web-guidance */}
        <link rel="preconnect" href="https://ui-avatars.com" />
        <link rel="dns-prefetch" href="https://scontent-sjc3-1.cdninstagram.com" />
        <link rel="dns-prefetch" href="https://www.instagram.com" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white bg-[#fcfdfd] dark:bg-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
