import Image from 'next/image';
import { SayNoHeadline } from '@/components/say-no';
import { SiteNav } from '@/components/site-nav';
import { buttonClass } from '@/components/ui';
import './sky-hero.css';

export function SkyHero({ price }: { price: number }) {
  return (
    <section className='sky relative isolate overflow-hidden'>
      <SiteNav />

      <div className='relative mx-auto flex max-w-5xl flex-col items-center px-5 pt-20 text-center sm:px-8 sm:pt-28'>
        <p className='sky-glass inline-flex items-center gap-2 whitespace-nowrap rounded-full py-1.5 pl-3.5 pr-4 text-[13px] font-medium sm:text-sm'>
          <span className='live-dot' aria-hidden />
          Early pricing: the first 100 get lifetime updates
        </p>

        <SayNoHeadline />

        <p className='mt-7 max-w-[52ch] text-lg leading-relaxed text-muted'>
          Record your screen, camera and voice in one click from Chrome. Every
          video lives in your own Cloudflare, not on our servers. Connecting it
          is one click too; we handle the rest.
        </p>

        <div className='mt-9 flex flex-wrap justify-center gap-3'>
          <a
            href='/buy'
            className={buttonClass('primary', 'lg', 'rounded-full px-7')}
          >
            Buy for ${price}
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

      <div className='sky-mock relative mt-16 px-4 sm:mt-20 sm:px-8'>
        {/* The real dashboard (public/dashboard-image.png, 1920×992). */}
        <div className='mx-auto max-w-6xl overflow-hidden rounded-t-[20px] border border-b-0 border-line bg-canvas shadow-pop sm:rounded-t-[24px]'>
          <Image
            src='/dashboard-image.png'
            alt='The Showthrough library: your recordings, folders and search, stored in your own Cloudflare'
            width={1920}
            height={992}
            priority
            sizes='(min-width: 1200px) 1152px, 100vw'
            className='block h-auto w-full'
          />
        </div>
      </div>
    </section>
  );
}
