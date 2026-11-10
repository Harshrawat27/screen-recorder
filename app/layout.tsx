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
    default: `${site.name}: Chrome screen recorder you pay for once`,
    template: `%s | ${site.name}`,
  },
  description:
    'Record your screen, camera and voice from Chrome and share the link the moment you stop. No video or time limits, no monthly bill. Videos stay in your Cloudflare.',
  applicationName: site.name,
  keywords: ['screen recorder', 'Loom alternative', 'Chrome screen recorder', 'record screen and camera', 'video messages', 'Cloudflare'],
  openGraph: {
    title: `${site.name}: Screen recording you own`,
    description: 'Say no to video limits, time limits, monthly bills and pointless stand-ups. Record from Chrome, share the link the moment you stop, pay once.',
    url: site.url,
    siteName: site.name,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${site.name}: Screen recording you own`,
    description: 'Say no to video limits, time limits, monthly bills and pointless stand-ups. Record from Chrome, share the link the moment you stop, pay once.',
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
