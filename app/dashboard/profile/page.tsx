import type { Metadata } from "next";
import Link from "next/link";
import { AvatarEditor } from "@/components/avatar-editor";
import { PageHeader } from "@/components/dashboard-ui";
import { buttonClass } from "@/components/ui";
import { avatarEnabled, getAvatar } from "@/lib/avatar";
import { pages } from "@/lib/dashboard-pages";
import { getWorkspace } from "@/lib/db";
import { requireSession } from "@/lib/session";

export const metadata: Metadata = { title: pages.profile.title, robots: { index: false } };

function Message({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <section className="mt-10 max-w-2xl rounded-panel border border-line bg-surface p-6 sm:p-8">
      <h2 className="text-xl">{title}</h2>
      <p className="mt-2 text-muted">{body}</p>
      {action}
    </section>
  );
}

export default async function ProfilePage() {
  const { user } = await requireSession();
  const workspace = await getWorkspace(user.id);
  const header = <PageHeader title={pages.profile.title} description={pages.profile.description} />;

  if (!workspace) {
    return (
      <main className="px-5 py-8 sm:px-10 sm:py-10">
        {header}
        <Message
          title="Connect Cloudflare first"
          body="Your photo is kept in your own Cloudflare, next to your videos, so you can add one once it's connected."
          action={
            <Link href="/dashboard" className={buttonClass("primary", "md", "mt-6")}>
              Go to your library
            </Link>
          }
        />
      </main>
    );
  }
  if (!avatarEnabled(workspace)) {
    return (
      <main className="px-5 py-8 sm:px-10 sm:py-10">
        {header}
        <Message
          title="Update to add a photo"
          body="Profile photos come with the latest version of your video backend. Press Update in the sidebar; it takes about 30 seconds and keeps everything as it is."
        />
      </main>
    );
  }

  const avatar = await getAvatar(workspace, user.id);
  return (
    <main className="px-5 py-8 sm:px-10 sm:py-10">
      {header}
      <AvatarEditor name={user.name} email={user.email} userId={user.id} googleImage={user.image ?? null} initial={avatar} />
    </main>
  );
}
