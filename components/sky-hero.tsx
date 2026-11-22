import { HeroShowcase } from '@/components/hero-showcase';
import { SayNoHeadline } from '@/components/say-no';
import { SiteNav } from '@/components/site-nav';
import { buttonClass } from '@/components/ui';
import { EARLY_ENDS_SHORT, LAUNCH_LABEL, LAUNCH_PRICE, earlyOpen } from '@/lib/pricing';
import './sky-hero.css';

export function SkyHero({ price }: { price: number }) {
  const onSale = earlyOpen();
  return (
    <>
    <SiteNav />
    <section className='sky relative isolate overflow-hidden'>

      <div className='relative mx-auto flex max-w-5xl flex-col items-center px-5 pt-20 text-center sm:px-8 sm:pt-28'>
        <p className='sky-glass inline-flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-3.5 pr-4 text-[13px] font-medium sm:text-sm'>
          <span className='live-dot' aria-hidden />
          {onSale ? (
            <>
              <span className='font-semibold'>Black Friday sale:</span>
              <span className='text-muted line-through'>${LAUNCH_PRICE}</span>
              <span className='font-semibold'>${price}</span>
              <span>
                <span className='hidden sm:inline'>with lifetime updates, </span>until {EARLY_ENDS_SHORT}
              </span>
            </>
          ) : (
            `Back on sale at our Product Hunt launch, ${LAUNCH_LABEL}`
          )}
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

        {/* Product Hunt badge: links to our launch so visitors can upvote. Light and dark versions follow the site theme. */}
        <a
          href='https://www.producthunt.com/products/showthrough-recorder-you-own?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-showthrough-recorder-you-own'
          target='_blank'
          rel='noopener noreferrer'
          className='mt-6 inline-block transition-opacity hover:opacity-85'
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className='dark:hidden'
            alt='Showthrough - recorder you own - Loom alternative: pay once, record unlimited videos | Product Hunt'
            width={250}
            height={54}
            src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1326020&theme=light&t=1795339487415'
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className='hidden dark:block'
            alt='Showthrough - recorder you own - Loom alternative: pay once, record unlimited videos | Product Hunt'
            width={250}
            height={54}
            src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1326020&theme=dark&t=1795339487415'
          />
        </a>
      </div>

      <div className='relative mt-16 px-4 sm:mt-20 sm:px-8'>
        <HeroShowcase />
      </div>
    </section>
    </>
  );
}
