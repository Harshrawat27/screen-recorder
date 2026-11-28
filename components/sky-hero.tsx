import { HeroVideo, WatchDemoButton } from '@/components/hero-video';
import { SayNoHeadline } from '@/components/say-no';
import { SendToComputer } from '@/components/send-to-computer';
import { SiteNav } from '@/components/site-nav';
import { buttonClass } from '@/components/ui';
import { type Locale, fill, localePath } from '@/lib/i18n';
import { homeCopy } from '@/lib/i18n/home';
import { MAC_PRICE } from '@/lib/pricing';
import './sky-hero.css';

export function SkyHero({ price, locale = 'en' }: { price: number; locale?: Locale }) {
  const t = homeCopy(locale).hero;
  const pageUrl = `https://www.showthrough.com${locale === 'en' ? '/' : localePath(locale, '/')}`;
  return (
    <>
    <SiteNav locale={locale} />
    <section className='sky relative isolate overflow-hidden'>

      <div className='relative mx-auto flex max-w-5xl flex-col items-center px-5 pt-8 text-center sm:px-8 sm:pt-28'>
        {/* Phones only: about half of visitors arrive on a phone, where Showthrough can't record. */}
        <SendToComputer url={pageUrl} note={t.phoneNote} send={t.phoneSend} copiedLabel={t.phoneCopied} shareText={t.phoneShareText} />
        <p
          className={
            locale === 'en'
              ? 'sky-glass inline-flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-3.5 pr-4 text-[13px] font-medium sm:text-sm'
              : 'sky-glass inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-0.5 rounded-full py-1.5 pl-3.5 pr-4 text-[13px] font-medium sm:flex-nowrap sm:whitespace-nowrap sm:text-sm'
          }
        >
          <span className='live-dot' aria-hidden />
          <span className='font-semibold'>{t.pillLabel}</span>
          <span className='font-semibold'>{fill(t.pillPrice, { price })}</span>
          <span>
            <span className='hidden sm:inline'>{t.pillUpdates}</span>
            <span className='text-muted'>{fill(t.pillAfterMac, { mac: MAC_PRICE })}</span>
          </span>
        </p>

        <SayNoHeadline items={t.items} h1={t.h1} line1={t.line1} sayNo={t.sayNo} long={locale !== 'en'} />

        <p className='mt-7 max-w-[52ch] text-lg leading-relaxed text-muted'>{t.sub}</p>

        <div className='mt-9 flex flex-wrap justify-center gap-3'>
          {/* /start signs in with Google if needed, then goes to the dashboard to connect Cloudflare. */}
          <a href='/start' className={buttonClass('primary', 'lg', 'rounded-full px-7')}>
            {t.startFree}
          </a>
          <WatchDemoButton className={buttonClass('secondary', 'lg', 'rounded-full px-7')}>
            {t.seeHow}
          </WatchDemoButton>
        </div>
        <p className='mt-5 text-sm font-medium text-text'>{t.freeLine}</p>
        <p className='mt-1.5 text-sm text-muted'>
          {t.paidLead}{' '}
          <a href='/buy' className='underline underline-offset-2 hover:text-text'>
            {fill(t.paidLink, { price })}
          </a>
          {t.noSub}
          <a
            href='https://appsumo.com/pl/hielhvnokZ/'
            target='_blank'
            rel='noopener noreferrer'
            className='font-semibold text-text underline underline-offset-2 hover:text-muted'
          >
            {t.appsumo}
          </a>
        </p>
        {/* The most asked question on this page (most-opened FAQ). */}
        <p className='mt-1.5 text-sm text-muted'>
          {t.cfLine}
          <a href='#faq' className='underline underline-offset-2 hover:text-text'>
            {t.cfFaq}
          </a>
        </p>
      </div>

      <div className='relative mt-16 px-4 sm:mt-20 sm:px-8'>
        <HeroVideo />
      </div>
    </section>
    </>
  );
}
