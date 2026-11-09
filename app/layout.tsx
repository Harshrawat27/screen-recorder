import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { site } from '@/lib/site';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
// Self-hosted (SIL Open Font License) so builds work offline.
// Newsreader for headings, Instrument Sans for body text and buttons.
const newsreader = localFont({
  src: './fonts/Newsreader-Variable.woff2',
  variable: '--font-newsreader',
  weight: '200 800',
  display: 'swap',
});
const instrumentSans = localFont({
  src: './fonts/InstrumentSans-Variable.woff2',
  variable: '--font-instrument-sans',
  weight: '400 700',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Record your screen, share the link instantly`,
    template: `%s | ${site.name}`,
  },
  description:
    'Record your screen, voice and camera in one click from Chrome. The link is copied the moment you stop. Videos live in your own Cloudflare, and you pay once.',
  applicationName: site.name,
  keywords: ['screen recorder', 'Loom alternative', 'Chrome screen recorder', 'record screen and camera', 'video messages', 'Cloudflare'],
  openGraph: {
    title: `${site.name}: Record in one click. Share the moment you stop.`,
    description: 'Screen, voice and camera from Chrome. The link is ready the moment you stop. Videos live in your own Cloudflare. Pay once.',
    url: site.url,
    siteName: site.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name}: Record in one click. Share the moment you stop.`,
    description: 'Screen, voice and camera from Chrome. The link is ready the moment you stop. Videos live in your own Cloudflare. Pay once.',
    creator: '@Harshrwt27',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#080808' },
  ],
};

// Runs before paint so the saved or system theme never flashes the wrong colors.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme='light'}})()`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en' className={`${newsreader.variable} ${instrumentSans.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className='min-h-screen bg-canvas text-text'>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
