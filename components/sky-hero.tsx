import { HeroShowcase } from '@/components/hero-showcase';
import { SayNoHeadline } from '@/components/say-no';
import { SiteNav } from '@/components/site-nav';
import { buttonClass } from '@/components/ui';
import { EARLY_ENDS_LABEL, LAUNCH_LABEL, earlyOpen } from '@/lib/pricing';
import './sky-hero.css';

export function SkyHero({ price }: { price: number }) {
  const onSale = earlyOpen();
  return (
    <section className='sky relative isolate overflow-hidden'>
      <SiteNav />

      <div className='relative mx-auto flex max-w-5xl flex-col items-center px-5 pt-20 text-center sm:px-8 sm:pt-28'>
        <p className='sky-glass inline-flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-3.5 pr-4 text-[13px] font-medium sm:text-sm'>
          <span className='live-dot' aria-hidden />
          {onSale
            ? `$49 with lifetime updates, until ${EARLY_ENDS_LABEL.split(',')[0]}`
            : `Back on sale at our Product Hunt launch, ${LAUNCH_LABEL}`}
        </p>

        <SayNoHeadline />

        <p className='mt-7 max-w-[52ch] text-lg leading-relaxed text-muted'>
          Record your screen, camera and voice in one click from Chrome. Every
          video lives in your own Cloudflare, not on our servers. Connecting it
          is one click too; we handle the rest.
        </p>

        <div className='mt-9 flex flex-wrap justify-center gap-3'>
          <a
            href={onSale ? '/buy' : '/pricing'}
            className={buttonClass('primary', 'lg', 'rounded-full px-7')}
          >
            {onSale ? `Buy for $${price}` : 'See pricing'}
          </a>
          <a
            href='#how'
            className={buttonClass('secondary', 'lg', 'rounded-full px-7')}
          >
            See how it works
          </a>
        </div>
        <p className='mt-5 text-sm text-muted'>
          One payment for your whole team. No subscription
        </p>
      </div>

      <div className='relative mt-16 px-4 sm:mt-20 sm:px-8'>
        <HeroShowcase />
      </div>
    </section>
  );
}
