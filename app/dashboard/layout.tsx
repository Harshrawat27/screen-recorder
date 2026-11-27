import { AccountMenu } from '@/components/account-menu';
import { AnalyticsIdentify } from '@/components/analytics';
import { MobileNav, SidebarNav } from '@/components/dashboard-nav';
import { DashboardSearch } from '@/components/dashboard-search';
import { NotificationBell } from '@/components/notification-bell';
import { Avatar } from '@/components/dashboard-ui';
import { Logo } from '@/components/header';
import { ThemeToggle } from '@/components/theme-toggle';
import { UpdateBox } from '@/components/update-box';
import { getAccess, ownAccess } from '@/lib/billing';
import { WORKER_VERSION } from '@/lib/cloudflare';
import { TeamSwitcher } from '@/components/team-ui';
import { firstName, getTeamContext, teamChoices } from '@/lib/team';
import { requireSession } from '@/lib/session';
import { availableUpdate } from '@/lib/updates';

// The dashboard frame. The sidebar is exactly the height of the window and stays put;
// only the page content on the right scrolls.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await requireSession();
  const [access, team] = await Promise.all([
    getAccess(user),
    getTeamContext(user),
  ]);
  const member = team.role === 'member';
  // Everyone has their own (free or paid) space, plus any teams they're on.
  const choices = await teamChoices(user, true);
  const switcher = <TeamSwitcher choices={choices} current={team.ownerId} />;
  // Only the admin can update the video backend (it needs their Cloudflare); members see a note.
  // Free accounts don't see it (paid features need an upgrade, not an update).
  const update = member ? null : availableUpdate(team.workspace, access.viaTeam ? await ownAccess(user) : access);
  const adminBehind =
    member && team.workspace && team.workspace.worker_version < WORKER_VERSION;

  return (
    <div className='lg:flex'>
      <AnalyticsIdentify id={user.id} />
      <aside className='hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col'>
        <div className='px-5 pb-6 pt-5'>
          <Logo />
        </div>
        {choices.length > 1 && <div className='px-3 pb-4'>{switcher}</div>}
        <div className='min-h-0 flex-1 overflow-y-auto px-3'>
          <SidebarNav member={member} />
        </div>
        {update && <UpdateBox {...update} />}
        {adminBehind && (
          <p className='mx-3 mb-3 rounded-[14px] border border-line bg-canvas p-3.5 text-[13px] leading-snug text-muted'>
            <span className='block font-semibold text-text'>
              A new version is available
            </span>
            Ask your admin ({firstName(team.owner)}) to update.
          </p>
        )}
        <div className='flex items-center gap-1 border-t border-line p-3'>
          <div className='min-w-0 flex-1'>
            <AccountMenu
              name={user.name}
              email={user.email}
              avatar={<Avatar name={user.name} image={user.image} size='sm' />}
            />
          </div>
          <ThemeToggle />
        </div>
      </aside>

      {/* Small screens: logo, account and a row of tabs on top */}
      <header className='sticky top-0 z-20 border-b border-line bg-canvas/90 px-4 pt-3 backdrop-blur lg:hidden'>
        <div className='flex items-center justify-between gap-3 pb-3'>
          <Logo />
          <div className='flex items-center gap-1'>
            <DashboardSearch compact />
            <NotificationBell />
            <ThemeToggle />
            <AccountMenu
              compact
              name={user.name}
              email={user.email}
              avatar={<Avatar name={user.name} image={user.image} size='sm' />}
            />
          </div>
        </div>
        {choices.length > 1 && <div className='pb-3'>{switcher}</div>}
        <MobileNav member={member} />
      </header>

      <div className='min-w-0 flex-1'>
        {/* Top bar on large screens: search in the middle */}
        <div className='sticky top-0 z-100 hidden h-16 items-center justify-center border-b border-line bg-canvas/85 px-8 backdrop-blur lg:flex'>
          <DashboardSearch />
          <div className='absolute right-6 top-1/2 -translate-y-1/2'>
            <NotificationBell />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
