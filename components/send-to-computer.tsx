'use client';

import { useState } from 'react';

// Phones only. Showthrough records in Chrome on a computer, and about half our visitors
// arrive on a phone (links from X and other apps). Instead of losing them, let them send the
// page to themselves: the phone's share sheet (email, WhatsApp, notes…), or copy the link.
export function SendToComputer({
  url = 'https://www.showthrough.com/',
  note = 'Records on a computer.',
  send: sendLabel = 'Send it to yours',
  copiedLabel = 'Link copied',
  shareText = 'Screen recorder to try on my computer',
}: { url?: string; note?: string; send?: string; copiedLabel?: string; shareText?: string } = {}) {
  const [copied, setCopied] = useState(false);

  async function send() {
    const data = { title: 'Showthrough', text: shareText, url };
    try {
      if (navigator.share) {
        await navigator.share(data);
        return;
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return; // closed the share sheet
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Nothing else we can do; the address is on screen anyway.
    }
  }

  return (
    <button
      type='button'
      onClick={send}
      className='sky-glass mb-4 inline-flex max-w-full items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] sm:hidden'
    >
      <span className='text-muted'>{note}</span>
      <span className='font-semibold underline underline-offset-2'>{copied ? copiedLabel : sendLabel}</span>
    </button>
  );
}
