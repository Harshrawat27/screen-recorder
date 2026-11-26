'use client';

import { useRef, useState } from 'react';
import { buttonClass } from '@/components/ui';

// The sign-up form on /service-as-a-software. "What do you want to replace" is a list: type a
// product, press Enter (or comma, or Add) and it becomes a chip; add as many as you like.

const TEAM_SIZES = ['Just me', '2–5', '6–15', '16–50', '51+'];
const input =
  'mt-2 h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[15px] text-text outline-none transition-colors placeholder:text-faint focus:border-text';
const label = 'block text-sm font-semibold';

export function InterestForm() {
  const [tools, setTools] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle');
  const [error, setError] = useState('');
  const [openedAt] = useState(() => Date.now());
  const toolInput = useRef<HTMLInputElement>(null);

  const addTool = () => {
    const name = draft.trim().replace(/,$/, '').trim().slice(0, 60);
    if (name && !tools.some((t) => t.toLowerCase() === name.toLowerCase()) && tools.length < 20) setTools([...tools, name]);
    setDraft('');
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    // Something typed but not added yet still counts.
    const all = draft.trim() && !tools.includes(draft.trim()) ? [...tools, draft.trim()] : tools;
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          email: form.get('email'),
          company: form.get('company'),
          teamSize,
          replaceTools: all,
          note: form.get('note'),
          website: form.get('website'),
          elapsed: Date.now() - openedAt,
          source: document.referrer || null,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again.');
      setStatus('done');
    } catch (err) {
      setError((err as Error).message);
      setStatus('idle');
    }
  }

  if (status === 'done') {
    return (
      <div role='status' className='rounded-[24px] border border-line bg-surface p-8 text-center sm:p-10'>
        <span className='mx-auto grid size-12 place-items-center rounded-full bg-text text-canvas'>
          <svg viewBox='0 0 24 24' fill='none' className='size-6' aria-hidden>
            <path d='M5 12.5l4.5 4.5L19 7.5' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round' />
          </svg>
        </span>
        <h2 className='mt-5 text-[30px] leading-tight'>You&rsquo;re on the list</h2>
        <p className='mx-auto mt-2 max-w-sm leading-relaxed text-muted'>
          Thanks! I read every one of these myself, and I&rsquo;ll email you as things move forward.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className='rounded-[24px] border border-line bg-surface p-6 sm:p-9'>
      <div className='grid gap-5 sm:grid-cols-2'>
        <label className={label}>
          Name
          <input name='name' required autoComplete='name' maxLength={120} className={input} />
        </label>
        <label className={label}>
          Email
          <input name='email' type='email' required autoComplete='email' maxLength={254} className={input} />
        </label>
        <label className={label}>
          Company name <span className='font-normal text-faint'>(optional)</span>
          <input name='company' autoComplete='organization' maxLength={160} className={input} />
        </label>
        <div>
          <span id='team-size' className={label}>
            Team size
          </span>
          <div role='radiogroup' aria-labelledby='team-size' className='mt-2 flex flex-wrap gap-1.5'>
            {TEAM_SIZES.map((size) => (
              <button
                key={size}
                type='button'
                role='radio'
                aria-checked={teamSize === size}
                onClick={() => setTeamSize(teamSize === size ? '' : size)}
                className={`h-11 flex-1 cursor-pointer whitespace-nowrap rounded-xl border px-3 text-sm font-medium transition-colors ${
                  teamSize === size ? 'border-text bg-text text-canvas' : 'border-line bg-canvas text-text hover:border-line-strong'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='mt-5'>
        <label htmlFor='tool' className={label}>
          What software do you want to replace?
        </label>
        <p className='mt-1 text-sm text-muted'>Type a product and press Enter. Add as many as you like.</p>
        <div
          onClick={() => toolInput.current?.focus()}
          className='mt-2 flex min-h-11 flex-wrap items-center gap-1.5 rounded-xl border border-line bg-canvas p-1.5 transition-colors focus-within:border-text'
        >
          {tools.map((tool) => (
            <span key={tool} className='flex items-center gap-1 rounded-lg bg-sunken py-1 pl-2.5 pr-1 text-sm font-medium'>
              {tool}
              <button
                type='button'
                aria-label={`Remove ${tool}`}
                onClick={() => setTools(tools.filter((t) => t !== tool))}
                className='grid size-5 cursor-pointer place-items-center rounded-md text-muted hover:bg-line hover:text-text'
              >
                <svg viewBox='0 0 16 16' className='size-3' aria-hidden>
                  <path d='M4 4l8 8M12 4l-8 8' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' />
                </svg>
              </button>
            </span>
          ))}
          <input
            ref={toolInput}
            id='tool'
            value={draft}
            maxLength={60}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addTool();
              } else if (e.key === 'Backspace' && !draft && tools.length) {
                setTools(tools.slice(0, -1));
              }
            }}
            onBlur={addTool}
            placeholder={tools.length ? 'Add another…' : 'e.g. Loom, Jira, Calendly'}
            className='h-8 min-w-[10rem] flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-faint'
          />
          {draft.trim() && (
            <button type='button' onClick={addTool} className='h-8 cursor-pointer rounded-lg bg-text px-3 text-sm font-semibold text-canvas'>
              Add
            </button>
          )}
        </div>
      </div>

      <label className={`${label} mt-5`}>
        Anything else? <span className='font-normal text-faint'>(optional)</span>
        <textarea
          name='note'
          rows={4}
          maxLength={3000}
          placeholder='What you pay for today, what annoys you about it, what you wish existed…'
          className='mt-2 w-full resize-y rounded-xl border border-line bg-canvas px-3.5 py-3 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-faint focus:border-text'
        />
      </label>

      {/* Hidden from people; bots fill it in. */}
      <input name='website' tabIndex={-1} autoComplete='off' aria-hidden className='absolute -left-[9999px] h-0 w-0 opacity-0' />

      {error && (
        <p role='alert' className='mt-5 text-sm text-danger'>
          {error}
        </p>
      )}
      <button type='submit' disabled={status === 'sending'} className={buttonClass('primary', 'lg', 'mt-7 w-full rounded-full disabled:opacity-60')}>
        {status === 'sending' ? 'Sending…' : 'Count me in'}
      </button>
      <p className='mt-3 text-center text-xs text-faint'>No payment now. I&rsquo;ll only use your email to tell you about this.</p>
    </form>
  );
}
