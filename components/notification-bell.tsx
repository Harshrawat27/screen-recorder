'use client';

import { Popover } from '@base-ui/react/popover';
import Link from 'next/link';
import { useState, useSyncExternalStore } from 'react';
import { Avatar } from '@/components/dashboard-ui';
import { openUpgrade } from '@/components/upgrade';

// The bell in the dashboard's top bar: new comments and reactions on your videos. They're kept
// in your own Cloudflare. The list loads when the dashboard opens; after that a live connection
// to your own Worker (a Durable Object in your Cloudflare) pushes new ones the moment they
// happen. If that connection drops, it reconnects and reloads the list, so nothing is missed;
// coming back to the tab reloads it too. Opening the bell marks everything read.

type Item = {
  id: string;
  kind: 'comment' | 'reaction' | 'watched' | 'first_view';
  videoTitle: string | null;
  actor: { name: string; image: string | null };
  body: string | null;
  emoji: string | null;
  atSec: number | null;
  createdAt: number;
  read: boolean;
  href: string;
};

type Data = { enabled: boolean; reason?: string; unread: number; items: Item[]; space?: string; live?: string };

const MIN_GAP_MS = 20_000;
const KEEPALIVE_MS = 50_000;
const MAX_ITEMS = 50;

// The tabs in the bell. Views covers both "Rahul watched" and "got its first view".
const TABS = [
  { key: 'all', label: 'All', kinds: null },
  { key: 'comments', label: 'Comments', kinds: ['comment'] },
  { key: 'reactions', label: 'Reactions', kinds: ['reaction'] },
  { key: 'views', label: 'Views', kinds: ['watched', 'first_view'] },
] as const;
type Tab = (typeof TABS)[number]['key'];

const EMPTY: Record<Tab, string> = {
  all: '',
  comments: 'No comments yet.',
  reactions: 'No reactions yet.',
  views: 'No views yet. You’ll see when a teammate watches, and when a new video gets its first view.',
};

const hrefFor = (space: string, n: { videoId: string; commentId: string | null }) =>
  `/v/${space}/${n.videoId}${n.commentId ? `?c=${n.commentId}` : ''}`;

function ago(ms: number) {
  const s = Math.max(1, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

const clock = (sec: number) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

const BellIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox='0 0 24 24' fill='none' aria-hidden className={className}>
    <path
      d='M6 9.5a6 6 0 0 1 12 0c0 4.2 1.4 5.9 2.2 6.6.3.3.1.9-.4.9H4.2c-.5 0-.7-.6-.4-.9C4.6 15.4 6 13.7 6 9.5z'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinejoin='round'
    />
    <path d='M10 20.2a2.2 2.2 0 0 0 4 0' stroke='currentColor' strokeWidth='1.7' strokeLinecap='round' />
  </svg>
);

const EyeIcon = ({ className = '' }: { className?: string }) => (
  <svg viewBox='0 0 24 24' fill='none' aria-hidden className={className}>
    <path d='M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z' stroke='currentColor' strokeWidth='1.8' strokeLinejoin='round' />
    <circle cx='12' cy='12' r='3' stroke='currentColor' strokeWidth='1.8' />
  </svg>
);

function emptyText(data: Data | null) {
  if (!data) return 'Loading…';
  if (data.enabled) return 'Nothing yet. When someone watches, comments on or reacts to your videos, you’ll see it here.';
  if (data.reason === 'update') return 'Update your video backend (in the sidebar) to turn on notifications.';
  if (data.reason === 'admin_update') return 'Notifications turn on once your admin updates the video backend.';
  if (data.reason === 'unreachable') return 'Couldn’t reach your Cloudflare just now. Try again in a moment.';
  return 'Connect Cloudflare to get notifications about your videos.';
}

// One list and one live connection for the whole page, shared by every bell on it (the dashboard
// has one in the phone header and one in the desktop bar). It starts with the first bell on the
// page and stops when the last one goes.
const store = (() => {
  let data: Data | null = null;
  let lastLoad = 0;
  let openBells = 0;
  let users = 0;
  let stop: (() => void) | null = null;
  const listeners = new Set<() => void>();

  const set = (next: Data | null) => {
    data = next;
    listeners.forEach((listener) => listener());
  };

  async function load(force = false): Promise<Data | null> {
    if (!force && Date.now() - lastLoad < MIN_GAP_MS) return null;
    lastLoad = Date.now();
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      if (!res.ok) return null;
      const next = (await res.json()) as Data;
      set(next);
      return next;
    } catch {
      // Keep what's shown; the next visit to the tab tries again.
      return null;
    }
  }

  const markRead = () => void fetch('/api/notifications', { method: 'POST' }).catch(() => {});

  /** A notification pushed by the Worker: add it to the top, and count it unless a bell is open. */
  function receive(item: Omit<Item, 'href'> & { videoId: string; commentId: string | null }) {
    if (!data || data.items.some((i) => i.id === item.id)) return;
    const seen = openBells > 0;
    const shown = { ...item, read: seen, href: hrefFor(data.space ?? '', item) };
    set({ ...data, unread: seen ? data.unread : data.unread + 1, items: [shown, ...data.items].slice(0, MAX_ITEMS) });
    if (seen) markRead();
  }

  // The list when the page opens, then the live connection. Coming back to the tab reloads the
  // list, and reconnects if the connection had dropped.
  function start() {
    let alive = true;
    let socket: WebSocket | null = null;
    let attempts = 0;
    let retryTimer = 0;

    /** Opens the live connection with a fresh ticket (each list load carries one). */
    const connect = (url?: string) => {
      if (!url || !alive || socket) return;
      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch {
        return;
      }
      socket = ws;
      let ping = 0;
      ws.onopen = () => {
        attempts = 0;
        // Keeps the connection from being closed as idle; answered without waking anything up.
        ping = window.setInterval(() => ws.readyState === WebSocket.OPEN && ws.send('ping'), KEEPALIVE_MS);
      };
      ws.onmessage = (event) => {
        if (event.data === 'pong') return;
        try {
          const message = JSON.parse(String(event.data));
          if (message?.type === 'notification' && message.item) receive(message.item);
        } catch {
          // not for us
        }
      };
      ws.onclose = () => {
        window.clearInterval(ping);
        if (socket === ws) socket = null;
        if (!alive || attempts >= 8) return; // after 8 tries, wait until you come back to the tab
        // Reconnect after a growing pause (2s, 4s, 8s … up to a minute). Reloading the list first
        // catches anything that arrived while disconnected, and brings a new ticket.
        const wait = Math.min(60_000, 2000 * 2 ** attempts++);
        retryTimer = window.setTimeout(() => {
          if (document.visibilityState === 'visible') void reload();
        }, wait);
      };
    };

    const reload = async () => {
      const next = await load(true);
      connect(next?.live);
    };

    const first = window.setTimeout(() => void reload(), 0);
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      if (socket) {
        void load();
        return;
      }
      attempts = 0;
      void reload();
    };
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);
    return () => {
      alive = false;
      window.clearTimeout(first);
      window.clearTimeout(retryTimer);
      socket?.close();
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }

  return {
    get: () => data,
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (users++ === 0) stop = start();
      return () => {
        listeners.delete(listener);
        if (--users === 0) {
          stop?.();
          stop = null;
        }
      };
    },
    /** A bell opened: everything is seen. */
    opened() {
      openBells++;
      void load();
      if (data?.unread) {
        set({ ...data, unread: 0 });
        markRead();
      }
    },
    /** A bell closed: the "new" dots go. */
    closed() {
      openBells = Math.max(0, openBells - 1);
      if (data) set({ ...data, items: data.items.map((i) => ({ ...i, read: true })) });
    },
  };
})();

export function NotificationBell() {
  const data = useSyncExternalStore(store.subscribe, store.get, () => null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('all');

  const onOpenChange = (next: boolean) => {
    if (next === open) return;
    // Free plan: the bell is there, and pressing it offers the upgrade.
    if (next && data?.reason === 'plan') return openUpgrade('notifications');
    setOpen(next);
    if (next) store.opened();
    else store.closed();
  };

  const unread = data?.unread ?? 0;
  const all = data?.items ?? [];
  const kinds = TABS.find((t) => t.key === tab)?.kinds;
  const items = kinds ? all.filter((i) => (kinds as readonly string[]).includes(i.kind)) : all;
  const unseen = (key: Tab) => {
    const k = TABS.find((t) => t.key === key)?.kinds;
    return all.some((i) => !i.read && (!k || (k as readonly string[]).includes(i.kind)));
  };

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger
        aria-label={unread ? `Notifications, ${unread} new` : 'Notifications'}
        className='relative grid size-10 cursor-pointer place-items-center rounded-full text-text outline-none transition-colors hover:bg-sunken focus-visible:ring-2 focus-visible:ring-text data-[popup-open]:bg-sunken'
      >
        <BellIcon className='size-5' />
        {unread > 0 && (
          <span className='absolute right-1 top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#f35733] px-1 text-[11px] font-bold leading-none text-white ring-2 ring-canvas'>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Popover.Trigger>
      <Popover.Portal>
        {/* The bell sits in a bar that stays at the top while the page scrolls, so the panel is placed
            relative to the window ("fixed"): it doesn't have to be moved on every scroll, which made it shake. */}
        <Popover.Positioner side='bottom' align='end' sideOffset={8} positionMethod='fixed' className='z-[200]'>
          <Popover.Popup className='w-[min(380px,calc(100vw-24px))] origin-[var(--transform-origin)] overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)] outline-none transition duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0'>
            <div className='border-b border-line px-4 pt-3'>
              <Popover.Title className='text-[15px] font-semibold'>Notifications</Popover.Title>
              <div role='tablist' aria-label='Show' className='-mb-px mt-2 grid grid-cols-4'>
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    type='button'
                    role='tab'
                    aria-selected={tab === t.key}
                    onClick={() => setTab(t.key)}
                    className={`relative flex cursor-pointer items-center justify-center gap-1.5 border-b-2 px-1 pb-2.5 pt-1.5 text-[13px] font-semibold transition-colors ${
                      tab === t.key ? 'border-text text-text' : 'border-transparent text-muted hover:text-text'
                    }`}
                  >
                    {t.label}
                    {tab !== t.key && unseen(t.key) && t.key !== 'all' && <span aria-label='new' className='size-1.5 rounded-full bg-[#f35733]' />}
                  </button>
                ))}
              </div>
            </div>
            {items.length === 0 ? (
              <p className='px-5 py-10 text-center text-sm leading-relaxed text-muted'>
                {all.length === 0 || tab === 'all' ? emptyText(data) : EMPTY[tab]}
              </p>
            ) : (
              <ul className='max-h-[min(460px,70dvh)] overflow-y-auto overscroll-contain py-1.5'>
                {items.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className='flex gap-3 px-4 py-3 transition-colors hover:bg-sunken'
                    >
                      {n.kind === 'first_view' ? (
                        <span aria-hidden className='grid size-8 shrink-0 place-items-center rounded-full bg-sunken text-text'>
                          <EyeIcon className='size-4' />
                        </span>
                      ) : (
                        <Avatar name={n.actor.name} image={n.actor.image} size='sm' />
                      )}
                      <div className='min-w-0 flex-1 text-sm leading-snug'>
                        {n.kind === 'first_view' ? (
                          <p>
                            <span className='font-semibold'>{n.videoTitle || 'Your video'}</span> got its first view
                          </p>
                        ) : (
                          <p>
                            <span className='font-semibold'>{n.actor.name}</span>{' '}
                            {n.kind === 'comment' ? 'commented on' : n.kind === 'watched' ? 'watched' : <>reacted {n.emoji} to</>}{' '}
                            <span className='font-semibold'>{n.videoTitle || 'your video'}</span>
                          </p>
                        )}
                        {n.kind === 'comment' && n.body && (
                          <p className='mt-1 line-clamp-2 text-muted'>“{n.body}”</p>
                        )}
                        <p className='mt-1 text-xs text-faint'>
                          {ago(n.createdAt)}
                          {n.atSec !== null && <> · at {clock(n.atSec)}</>}
                        </p>
                      </div>
                      {!n.read && <span aria-label='New' className='mt-1.5 size-2 shrink-0 rounded-full bg-[#f35733]' />}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
