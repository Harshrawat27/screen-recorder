'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { LibrarySort } from '@/components/library-sort';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { buttonClass } from '@/components/ui';
import {
  type FolderOption,
  MoveDialog,
  NewFolderButton,
} from '@/components/folder-ui';
import { VideoThumb } from '@/components/video-thumb';
import { site } from '@/lib/site';

// The library: tabs, view toggle, folders and video cards.
// Rename and delete are real (see app/api/videos). Folders, starring and archive are
// front-end only for now; they get real storage later. Everything here is plain props so the server page stays in charge of data.

export type LibraryVideo = {
  id: string;
  title: string;
  href: string;
  thumb: string | null;
  length: string | null;
  when: string;
  ready: boolean;
  views: number;
  comments: number;
  reactions: number;
  folderId: string | null;
};

export type LibraryFolder = {
  id: string;
  name: string;
  videos: number;
  people: string[];
  href: string;
};
export type LibraryAuthor = { name: string; image?: string | null };

type Tab = 'videos' | 'starred' | 'archive';

// Rename and delete, shared with every card and row. The library updates right away and the
// server page refreshes behind it.
type VideoActions = {
  renamed: (id: string, title: string) => void;
  deleted: (id: string) => void;
  moved: (id: string, folderId: string | null) => void;
  folders: FolderOption[];
  foldersEnabled: boolean;
};
const Actions = createContext<VideoActions>({
  renamed: () => {},
  deleted: () => {},
  moved: () => {},
  folders: [],
  foldersEnabled: false,
});
type View = 'grid' | 'list';

const svg = (children: React.ReactNode, className = 'size-4') => (
  <svg
    viewBox='0 0 20 20'
    fill='none'
    aria-hidden
    className={`${className} shrink-0`}
  >
    {children}
  </svg>
);

const icons = {
  grid: svg(
    <>
      <rect
        x='3'
        y='3'
        width='6'
        height='6'
        rx='1.6'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <rect
        x='11'
        y='3'
        width='6'
        height='6'
        rx='1.6'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <rect
        x='3'
        y='11'
        width='6'
        height='6'
        rx='1.6'
        stroke='currentColor'
        strokeWidth='1.6'
      />
      <rect
        x='11'
        y='11'
        width='6'
        height='6'
        rx='1.6'
        stroke='currentColor'
        strokeWidth='1.6'
      />
    </>
  ),
  list: svg(
    <path
      d='M3.5 5h13M3.5 10h13M3.5 15h13'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
    />
  ),
  folder: svg(
    <path
      d='M2.8 6.2c0-1 .8-1.7 1.7-1.7h3.4l1.8 1.9h5.8c1 0 1.7.8 1.7 1.7v6.2c0 1-.8 1.7-1.7 1.7H4.5c-1 0-1.7-.8-1.7-1.7z'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinejoin='round'
    />,
    'size-5'
  ),
  dots: svg(
    <>
      <circle cx='5' cy='10' r='1.4' fill='currentColor' />
      <circle cx='10' cy='10' r='1.4' fill='currentColor' />
      <circle cx='15' cy='10' r='1.4' fill='currentColor' />
    </>
  ),
  star: (filled: boolean) =>
    svg(
      <path
        d='M10 2.8l2.2 4.5 4.9.7-3.6 3.5.9 4.9L10 14.1l-4.4 2.3.9-4.9L2.9 8l4.9-.7z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinejoin='round'
        fill={filled ? 'currentColor' : 'none'}
      />
    ),
  eye: svg(
    <>
      <path
        d='M1.8 10S4.8 4.5 10 4.5s8.2 5.5 8.2 5.5-3 5.5-8.2 5.5S1.8 10 1.8 10z'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinejoin='round'
      />
      <circle cx='10' cy='10' r='2.4' stroke='currentColor' strokeWidth='1.5' />
    </>,
    'size-[15px]'
  ),
  comment: svg(
    <path
      d='M3.5 5.5c0-1 .8-1.8 1.8-1.8h9.4c1 0 1.8.8 1.8 1.8v6.2c0 1-.8 1.8-1.8 1.8H8.4L5 16.3v-2.8h0c-.8 0-1.5-.8-1.5-1.8z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinejoin='round'
    />,
    'size-[15px]'
  ),
  heart: svg(
    <path
      d='M10 16.2s-6.5-3.9-6.5-8.4A3.6 3.6 0 0 1 10 5.6a3.6 3.6 0 0 1 6.5 2.2c0 4.5-6.5 8.4-6.5 8.4z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinejoin='round'
    />,
    'size-[15px]'
  ),
  play: (
    <svg viewBox='0 0 12 12' className='size-3' fill='currentColor' aria-hidden>
      <path d='M3 1.8v8.4L10 6z' />
    </svg>
  ),
};

function Initial({
  name,
  image,
  className = 'size-6 text-[11px]',
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={image}
        alt=''
        referrerPolicy='no-referrer'
        className={`${className} shrink-0 rounded-full object-cover`}
      />
    );
  }
  return (
    <span
      aria-hidden
      className={`${className} grid shrink-0 place-items-center rounded-full bg-sunken font-bold text-text`}
    >
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}

function Divider({ label, count }: { label: string; count: number }) {
  return (
    <div className='flex items-center gap-3'>
      <h2 className='text-[21px] leading-tight'>{label}</h2>
      <span className='tabular rounded-full border border-line bg-surface px-2 py-0.5 text-xs font-medium text-muted'>
        {count}
      </span>
      <span className='h-px flex-1 bg-line' />
    </div>
  );
}

function Tabs({
  tab,
  onChange,
  starred,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
  starred: number;
}) {
  const items: { id: Tab; label: string; count?: number }[] = [
    { id: 'videos', label: 'Videos' },
    { id: 'starred', label: 'Starred', count: starred },
    { id: 'archive', label: 'Archive' },
  ];
  return (
    <div
      role='tablist'
      aria-label='Library'
      className='inline-flex rounded-full border border-line bg-surface p-1'
    >
      {items.map((item) => {
        const active = tab === item.id;
        return (
          <button
            key={item.id}
            role='tab'
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors ${
              active
                ? 'btn-primary bg-text text-canvas'
                : 'text-muted hover:text-text'
            }`}
          >
            {item.label}
            {item.count ? (
              <span
                className={`tabular text-xs ${
                  active ? 'text-canvas/70' : 'text-faint'
                }`}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  const button = (id: View, label: string) => (
    <button
      aria-label={label}
      aria-pressed={view === id}
      onClick={() => onChange(id)}
      className={`grid size-8 place-items-center rounded-[8px] transition-colors ${
        view === id ? 'bg-sunken text-text' : 'text-muted hover:text-text'
      }`}
    >
      {icons[id]}
    </button>
  );
  return (
    <div className='inline-flex h-10 items-center gap-0.5 rounded-control border border-line bg-surface p-1'>
      {button('grid', 'Grid view')}
      {button('list', 'List view')}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
  className = '',
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type='button'
      aria-label={label}
      onClick={onClick}
      className={`grid size-8 place-items-center rounded-full bg-surface/90 text-text shadow-sm ring-1 ring-line backdrop-blur transition-colors hover:bg-surface ${className}`}
    >
      {children}
    </button>
  );
}

function VideoMenu({
  video,
  trigger,
}: {
  video: LibraryVideo;
  trigger: string;
}) {
  const [dialog, setDialog] = useState<'rename' | 'delete' | 'move' | null>(
    null
  );
  const { folders, foldersEnabled, moved } = useContext(Actions);
  const copy = () =>
    navigator.clipboard?.writeText(
      new URL(video.href, window.location.origin).toString()
    );
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label='More actions' className={trigger}>
          {icons.dots}
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
          <DropdownMenuItem onClick={copy}>Copy link</DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(video.href, '_blank')}>
            Open in new tab
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!foldersEnabled}
            onClick={() => setDialog('move')}
          >
            Add to folder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDialog('rename')}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant='destructive'
            onClick={() => setDialog('delete')}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <RenameDialog
        video={video}
        open={dialog === 'rename'}
        onClose={() => setDialog(null)}
      />
      <DeleteDialog
        video={video}
        open={dialog === 'delete'}
        onClose={() => setDialog(null)}
      />
      {foldersEnabled && (
        <MoveDialog
          open={dialog === 'move'}
          onClose={() => setDialog(null)}
          videoId={video.id}
          videoTitle={video.title}
          current={video.folderId}
          folders={folders}
          onMoved={(folderId) => moved(video.id, folderId)}
        />
      )}
    </>
  );
}

const TITLE_MAX = 120;

function RenameDialog({
  video,
  open,
  onClose,
}: {
  video: LibraryVideo;
  open: boolean;
  onClose: () => void;
}) {
  const { renamed } = useContext(Actions);
  const [title, setTitle] = useState(video.title);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clean = title.replace(/\s+/g, ' ').trim();

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!clean || busy) return;
    if (clean === video.title) return onClose();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/videos/${video.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ title: clean }),
      });
      if (!res.ok) throw new Error();
      renamed(video.id, clean);
      onClose();
    } catch {
      setError('Couldn’t rename the video. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) return;
        onClose();
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) {
          setTitle(video.title);
          setError(null);
        }
      }}
    >
      <DialogContent>
        <form onSubmit={save}>
          <DialogHeader>
            <DialogTitle>Rename video</DialogTitle>
            <DialogDescription>
              The new name shows in your library and on the share page.
            </DialogDescription>
          </DialogHeader>
          <input
            autoFocus
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
            aria-label='Video name'
            className='mt-5 h-11 w-full rounded-xl border border-line bg-canvas px-3.5 text-[15px] outline-none! transition-colors focus:border-text'
          />
          {error && (
            <p role='alert' className='mt-2 text-sm text-brand-ink'>
              {error}
            </p>
          )}
          <DialogFooter>
            <DialogClose className={buttonClass('ghost', 'md')}>
              Cancel
            </DialogClose>
            <button
              type='submit'
              disabled={!clean || busy}
              className={buttonClass('primary', 'md', 'disabled:opacity-50')}
            >
              {busy ? 'Saving…' : 'Save'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDialog({
  video,
  open,
  onClose,
}: {
  video: LibraryVideo;
  open: boolean;
  onClose: () => void;
}) {
  const { deleted } = useContext(Actions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/videos/${video.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      onClose();
      deleted(video.id);
    } catch {
      setError('Couldn’t delete the video. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next && !busy) onClose();
      }}
      onOpenChangeComplete={(isOpen) => {
        if (!isOpen) setError(null);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this video?</DialogTitle>
          <DialogDescription>
            &ldquo;{video.title}&rdquo; will be deleted from your Cloudflare and
            its share link will stop working. This can&rsquo;t be undone.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <p role='alert' className='mt-4 text-sm text-brand-ink'>
            {error}
          </p>
        )}
        <DialogFooter>
          <DialogClose disabled={busy} className={buttonClass('ghost', 'md')}>
            Cancel
          </DialogClose>
          <button
            type='button'
            onClick={remove}
            disabled={busy}
            className={buttonClass('primary', 'md', 'disabled:opacity-60')}
          >
            {busy ? 'Deleting…' : 'Delete video'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Stats({ video }: { video: LibraryVideo }) {
  return (
    <div className='tabular flex items-center gap-4 text-[13px] text-muted'>
      <span className='inline-flex items-center gap-1.5' title='Views'>
        {icons.eye}
        {video.views}
      </span>
      <span className='inline-flex items-center gap-1.5' title='Comments'>
        {icons.comment}
        {video.comments}
      </span>
      <span className='inline-flex items-center gap-1.5' title='Reactions'>
        {icons.heart}
        {video.reactions}
      </span>
    </div>
  );
}

function Thumb({
  video,
  className = '',
}: {
  video: LibraryVideo;
  className?: string;
}) {
  return (
    <Link
      href={video.href}
      target='_blank'
      className={`group/thumb relative block overflow-hidden rounded-[12px] bg-stage ${className}`}
    >
      {video.thumb ? (
        <VideoThumb src={video.thumb} />
      ) : (
        <span className='absolute inset-0 bg-gradient-to-br from-neutral-700 to-neutral-950' />
      )}
      <span className='absolute inset-0 bg-black/0 transition-colors group-hover/thumb:bg-black/25' />
      <span className='absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover/thumb:opacity-100 group-focus-visible/thumb:opacity-100'>
        <span className='inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black shadow-lg'>
          {icons.play}
          Watch video
        </span>
      </span>
      {video.length && (
        <span className='tabular absolute bottom-2 left-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-semibold text-white'>
          {video.length}
        </span>
      )}
    </Link>
  );
}

function VideoCard({
  video,
  author,
  starred,
  onStar,
}: {
  video: LibraryVideo;
  author: LibraryAuthor;
  starred: boolean;
  onStar: () => void;
}) {
  return (
    <article className='group rounded-[18px] border border-line bg-surface p-2.5 transition-shadow hover:shadow-pop'>
      <div className='relative'>
        <Thumb video={video} className='aspect-video' />
        <div
          className={`absolute right-2 top-2 flex gap-1.5 transition-opacity ${
            starred
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
          }`}
        >
          <VideoMenu
            video={video}
            trigger='grid size-8 place-items-center rounded-full bg-surface/90 text-text shadow-sm ring-1 ring-line backdrop-blur outline-none hover:bg-surface data-popup-open:bg-surface'
          />
          <IconButton label={starred ? 'Remove star' : 'Star'} onClick={onStar}>
            {icons.star(starred)}
          </IconButton>
        </div>
      </div>
      <div className='px-1.5 pb-1.5 pt-3'>
        <div className='flex items-center gap-2 text-[13px] text-muted'>
          <Initial name={author.name} image={author.image} />
          <span className='truncate font-medium text-text'>{author.name}</span>
          <span aria-hidden>·</span>
          <span className='shrink-0'>
            {video.ready ? video.when : 'Uploading'}
          </span>
        </div>
        <Link
          href={video.href}
          target='_blank'
          className='mt-2 block truncate text-[15px] font-semibold hover:underline hover:underline-offset-2'
        >
          {video.title}
        </Link>
        <div className='mt-3 border-t border-line pt-3'>
          <Stats video={video} />
        </div>
      </div>
    </article>
  );
}

function VideoRow({
  video,
  author,
  starred,
  onStar,
}: {
  video: LibraryVideo;
  author: LibraryAuthor;
  starred: boolean;
  onStar: () => void;
}) {
  return (
    <article className='flex items-center gap-4 px-3 py-3 transition-colors hover:bg-sunken/50'>
      <Thumb video={video} className='aspect-video w-32 shrink-0 sm:w-40' />
      <div className='min-w-0 flex-1'>
        <Link
          href={video.href}
          target='_blank'
          className='block truncate font-semibold hover:underline hover:underline-offset-2'
        >
          {video.title}
        </Link>
        <div className='mt-1 flex items-center gap-2 text-[13px] text-muted'>
          <Initial
            name={author.name}
            image={author.image}
            className='size-5 text-[10px]'
          />
          <span className='truncate'>{author.name}</span>
          <span aria-hidden>·</span>
          <span className='shrink-0'>
            {video.ready ? video.when : 'Uploading'}
          </span>
        </div>
      </div>
      <div className='hidden md:block'>
        <Stats video={video} />
      </div>
      <div className='flex shrink-0 items-center gap-1'>
        <button
          aria-label={starred ? 'Remove star' : 'Star'}
          onClick={onStar}
          className={`grid size-8 place-items-center rounded-full transition-colors hover:bg-sunken ${
            starred ? 'text-text' : 'text-faint hover:text-text'
          }`}
        >
          {icons.star(starred)}
        </button>
        <VideoMenu
          video={video}
          trigger='grid size-8 place-items-center rounded-full text-muted outline-none hover:bg-sunken hover:text-text data-popup-open:bg-sunken'
        />
      </div>
    </article>
  );
}

// A folder drawn as a folder: a tab on the top left of the card and a second sheet peeking out behind it.
function FolderCard({
  folder,
  author,
}: {
  folder: LibraryFolder;
  author: LibraryAuthor;
}) {
  const people = [author.name, ...folder.people];
  return (
    <Link href={folder.href} className='group relative block pt-4'>
      {/* The sheet behind */}
      <span
        aria-hidden
        className='absolute inset-x-0 top-1.5 h-10 rounded-t-[18px] bg-sunken'
      />
      {/* The front sheet */}
      <div className='relative z-10 flex items-center gap-4 rounded-[18px] rounded-tl-none border border-line bg-surface px-5 py-8 transition-[border-color,box-shadow] group-hover:border-line-strong group-hover:shadow-pop h-[100%]'>
        <div className='min-w-0 flex-1'>
          <p className='line-clamp-2 text-[15px] font-semibold leading-snug'>
            {folder.name}
          </p>
          <p className='mt-0.5 text-[13px] text-muted'>
            {folder.videos} video{folder.videos === 1 ? '' : 's'}
          </p>
        </div>
        <div className='flex -space-x-2'>
          {people.slice(0, 3).map((name, i) => (
            <span
              key={i}
              className={`grid size-9 place-items-center overflow-hidden rounded-full border-[3px] border-surface text-xs font-bold shadow-sm ${
                i % 2 === 0 ? 'bg-text text-canvas' : 'bg-sunken text-text'
              }`}
              style={{ zIndex: 3 - i }}
            >
              {i === 0 && author.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.image}
                  alt=''
                  referrerPolicy='no-referrer'
                  className='size-full object-cover'
                />
              ) : (
                name.trim().charAt(0).toUpperCase()
              )}
            </span>
          ))}
        </div>
      </div>
      {/* The tab: covers the front sheet's top border where they join, then draws its own edge */}
      <svg
        aria-hidden
        viewBox='0 0 140 18'
        width='140'
        height='18'
        className='absolute left-0 top-0 z-20 overflow-visible'
      >
        <path
          d='M0.5 18V12Q0.5 0.5 12 0.5H84C102 0.5 104 16.5 124 16.5H140V18Z'
          className='fill-surface'
        />
        <path
          d='M0.5 18V12Q0.5 0.5 12 0.5H84C102 0.5 104 16.5 124 16.5H140'
          fill='none'
          strokeWidth='1'
          className='stroke-line transition-colors group-hover:stroke-line-strong'
        />
      </svg>
    </Link>
  );
}

function Empty({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className='rounded-[18px] border border-dashed border-line-strong px-6 py-16 text-center'>
      <p className='font-semibold'>{title}</p>
      <p className='mx-auto mt-1 max-w-[42ch] text-sm text-muted'>{body}</p>
    </div>
  );
}

export function LibraryView({
  videos,
  folders,
  author,
  folderOptions = [],
  foldersEnabled = false,
  scope = null,
}: {
  videos: LibraryVideo[];
  /** Folder cards shown above the videos (the library's top level only). */
  folders: LibraryFolder[];
  author: LibraryAuthor;
  /** Every folder, for "Add to folder". */
  folderOptions?: FolderOption[];
  foldersEnabled?: boolean;
  /** The folder being shown, or null for the library's top level. */
  scope?: string | null;
}) {
  const [tab, setTab] = useState<Tab>('videos');
  const [view, setView] = useState<View>('grid');
  const [stars, setStars] = useState<Set<string>>(() => new Set());
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [removed, setRemoved] = useState<Set<string>>(() => new Set());
  const [movedTo, setMovedTo] = useState<Record<string, string | null>>({});
  const router = useRouter();
  const actions: VideoActions = {
    folders: folderOptions,
    foldersEnabled,
    moved: (id, folderId) => {
      setMovedTo((prev) => ({ ...prev, [id]: folderId }));
      router.refresh();
    },
    renamed: (id, title) => {
      setTitles((prev) => ({ ...prev, [id]: title }));
      router.refresh();
    },
    deleted: (id) => {
      setRemoved((prev) => new Set(prev).add(id));
      router.refresh();
    },
  };
  const all = videos
    .filter((v) => !removed.has(v.id))
    .map((v) => (v.id in movedTo ? { ...v, folderId: movedTo[v.id] } : v))
    // The library shows every video; a folder shows only its own. A video taken out of the
    // folder being shown leaves it right away.
    .filter((v) => scope === null || v.folderId === scope)
    .map((v) => (titles[v.id] ? { ...v, title: titles[v.id] } : v));

  const toggleStar = (id: string) =>
    setStars((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const shown =
    tab === 'starred'
      ? all.filter((v) => stars.has(v.id))
      : tab === 'archive'
        ? []
        : all;

  return (
    <Actions.Provider value={actions}>
      <div className='mt-8 flex flex-wrap items-center justify-between gap-3'>
        <Tabs tab={tab} onChange={setTab} starred={stars.size} />
        <div className='flex items-center gap-2'>
          <ViewToggle view={view} onChange={setView} />
          <LibrarySort />
        </div>
      </div>

      {tab === 'videos' && folders.length > 0 && (
        <section className='mt-9'>
          <Divider label='All folders' count={folders.length} />
          <div className='mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} author={author} />
            ))}
          </div>
        </section>
      )}

      <section className='mt-9'>
        <Divider
          label={
            tab === 'starred'
              ? 'Starred videos'
              : tab === 'archive'
                ? 'Archived videos'
                : scope
                  ? 'Videos in this folder'
                  : 'All videos'
          }
          count={shown.length}
        />
        <div className='mt-4'>
          {shown.length === 0 ? (
            tab === 'starred' ? (
              <Empty
                title='No starred videos yet'
                body='Star a video to keep it here for quick access.'
              />
            ) : tab === 'archive' ? (
              <Empty
                title='Nothing archived'
                body='Videos you archive leave your library but are not deleted.'
              />
            ) : scope ? (
              <Empty
                title='This folder is empty'
                body='Open the menu on any video in your library and choose Add to folder.'
              />
            ) : (
              <Empty
                title='No videos yet'
                body={
                  <>
                    Record with the{' '}
                    <a
                      href={site.chromeStoreUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='underline underline-offset-2 hover:text-text'
                    >
                      Chrome extension
                    </a>{' '}
                    and your videos show up here.
                  </>
                }
              />
            )
          ) : view === 'grid' ? (
            <div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
              {shown.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  author={author}
                  starred={stars.has(video.id)}
                  onStar={() => toggleStar(video.id)}
                />
              ))}
            </div>
          ) : (
            <div className='divide-y divide-line overflow-hidden rounded-[18px] border border-line bg-surface'>
              {shown.map((video) => (
                <VideoRow
                  key={video.id}
                  video={video}
                  author={author}
                  starred={stars.has(video.id)}
                  onStar={() => toggleStar(video.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </Actions.Provider>
  );
}

/** The two buttons beside the page title. Front-end only for now. */
export function LibraryActions({
  foldersEnabled = false,
}: {
  foldersEnabled?: boolean;
}) {
  return (
    <div className='flex items-center gap-2'>
      <NewFolderButton
        enabled={foldersEnabled}
        className='inline-flex h-10 items-center gap-2 rounded-control border border-line bg-surface px-4 text-sm font-semibold transition-colors hover:border-line-strong hover:bg-sunken'
      />
      <button
        type='button'
        className='btn-primary inline-flex h-10 items-center gap-2 rounded-control bg-text px-4 text-sm font-semibold text-canvas transition-colors hover:bg-text/85'
      >
        {svg(
          <path
            d='M10 4v12M4 10h12'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
          />
        )}
        New video
      </button>
    </div>
  );
}
