import { AccountMenu } from '@/components/account-menu';
import { MobileNav, SidebarNav } from '@/components/dashboard-nav';
import { DashboardSearch } from '@/components/dashboard-search';
import { Avatar } from '@/components/dashboard-ui';
import { Logo } from '@/components/header';
import { ThemeToggle } from '@/components/theme-toggle';
import { UpdateBox } from '@/components/update-box';
import { getAccess } from '@/lib/billing';
import { getWorkspace } from '@/lib/db';
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
  const [access, workspace] = await Promise.all([
    getAccess(user),
    getWorkspace(user.id),
  ]);
  const update = availableUpdate(workspace, access);

  return (
    <div className='lg:flex'>
      <aside className='hidden border-r border-line bg-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col'>
        <div className='px-5 pb-6 pt-5'>
          <Logo />
        </div>
        <div className='min-h-0 flex-1 overflow-y-auto px-3'>
          <SidebarNav />
        </div>
        {update && <UpdateBox {...update} />}
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
            <ThemeToggle />
            <AccountMenu
              compact
              name={user.name}
              email={user.email}
              avatar={<Avatar name={user.name} image={user.image} size='sm' />}
            />
          </div>
        </div>
        <MobileNav />
      </header>

      <div className='min-w-0 flex-1'>
        {/* Top bar on large screens: search in the middle */}
        <div className='sticky top-0 z-100 hidden h-16 items-center justify-center border-b border-line bg-canvas/85 px-8 backdrop-blur lg:flex'>
          <DashboardSearch />
        </div>
        {children}
      </div>
    </div>
  );
}
