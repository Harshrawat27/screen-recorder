import Link from "next/link";
import { Do, Lead, Note, Shot, guideLink } from "@/components/guide";
import { guidePath, teamGuidePages } from "@/lib/guide";
import { site } from "@/lib/site";

// What each page of the team guide (/guide/team) says. Same rules as the setup guide: one
// screen per page, a few short actions. Screenshots live in public/guide/team.

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;
const team = (slug: string) => guidePath(slug, "/guide/team");

export const teamGuideContent: Record<string, React.ReactNode> = {
  "": (
    <>
      <Lead>
        Invite your team to record into your Showthrough. Everyone signs in with their own Google account, and every video is
        saved in your Cloudflare. One purchase covers everyone.
      </Lead>
      <Note title="Who does what">
        <p>
          <b className="text-text">The admin</b> bought Showthrough and connected Cloudflare. They invite people and can see and
          manage every video.
        </p>
        <p>
          <b className="text-text">Teammates</b> join with an invite link and record. They don&rsquo;t buy anything or touch
          Cloudflare.
        </p>
      </Note>
      <Note title="You'll need">
        <p>
          · Showthrough set up by the admin. Not done yet? Follow the{" "}
          <Link href="/guide" className={guideLink}>
            setup guide
          </Link>{" "}
          first.
        </p>
        <p>· Google Chrome and a Google account for each teammate</p>
      </Note>
      {[
        ["For the admin", teamGuidePages.filter((p) => p.group === "For the admin")],
        ["For teammates", teamGuidePages.filter((p) => p.group === "For teammates")],
      ].map(([title, pages]) => (
        <div key={title as string}>
          <h2 className="mt-10 text-2xl">{title as string}</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-[17px] marker:text-muted">
            {(pages as typeof teamGuidePages).map((p) => (
              <li key={p.slug}>
                <Link href={team(p.slug)} className="hover:underline hover:underline-offset-2">
                  {p.nav}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </>
  ),

  "update-showthrough": (
    <>
      <Lead>Teams need the latest version of your video backend. If you set up Showthrough recently, you already have it.</Lead>
      <Do>
        <li>
          Open your{" "}
          <Link href="/dashboard" className={guideLink}>
            Showthrough library
          </Link>
          .
        </li>
        <li>
          If you see <b>New version available</b> at the bottom of the sidebar, click <b>Update to version 7</b>.
        </li>
        <li>On Cloudflare, click Authorize, like when you first connected.</li>
      </Do>
      <Shot
        src="team/update-box"
        width={600} height={620}
        alt="The sidebar box saying a new version is available, with the Update to version 7 button"
        marks={[{ circle: [9, 43.3, 67, 10.3] }, { cursor: [57.2, 49.7] }]}
      />
      <Note title="Is anything changed?">
        <p>No. It takes about 10 seconds, and your videos and links stay exactly as they are.</p>
        <p>No box in the sidebar? You&rsquo;re already up to date.</p>
      </Note>
    </>
  ),

  "invite-teammates": (
    <>
      <Lead>Each teammate gets their own invite, tied to their email.</Lead>
      <Do>
        <li>
          In the sidebar, open{" "}
          <Link href="/dashboard/team" className={guideLink}>
            Manage team
          </Link>
          .
        </li>
        <li>
          Type your teammate&rsquo;s email and click <b>Create invite</b>.
        </li>
      </Do>
      <Shot
        src="team/team-invite"
        width={1600} height={1018}
        alt="The Manage team page with an email typed in and the Create invite button"
        marks={[{ circle: [73.4, 50.3, 14.7, 7.9] }, { cursor: [84, 55.2] }]}
      />
      <Do start={3}>
        <li>
          The invite appears under <b>Waiting to join</b>. Click <b>Copy link</b> and send it to them on email, Slack or
          WhatsApp.
        </li>
      </Do>
      <Shot
        src="team/team-copy-link"
        width={1600} height={545}
        alt="Invites waiting to join, each with a Copy link button"
        marks={[{ circle: [68.4, 43.6, 10.4, 12] }, { cursor: [75.9, 51] }]}
      />
      <Note title="Good to know">
        <p>The link only works for the Google account with that email. Forwarding it to someone else won&rsquo;t let them in.</p>
        <p>No per-seat pricing: invite as many people as you need.</p>
        <p>Sent it to the wrong address? Click Cancel and create a new one.</p>
      </Note>
    </>
  ),

  "manage-your-team": (
    <>
      <Lead>
        As the admin, you see everyone on{" "}
        <Link href="/dashboard/team" className={guideLink}>
          Manage team
        </Link>
        .
      </Lead>
      <Do>
        <li>
          Click <b>videos</b> next to someone to see everything they&rsquo;ve recorded.
        </li>
        <li>
          Click <b>Remove</b> when someone leaves your team.
        </li>
      </Do>
      <Shot
        src="team/team-people"
        width={1600} height={855}
        alt="The People list on Manage team, with a videos button and Remove next to a teammate"
        marks={[{ circle: [68.4, 46, 9.5, 7.7] }, { circle: [78.8, 46, 9.3, 7.7] }, { cursor: [75.2, 50.8] }]}
      />
      <Shot src="team/member-videos" width={1600} height={868} alt="All the videos one teammate has recorded" />
      <Note title="What happens when you remove someone">
        <p>They lose access right away: no more recording into your Cloudflare, and your library disappears from their account.</p>
        <p>Everything they recorded stays in your library, and its links keep working.</p>
      </Note>
    </>
  ),

  "join-a-team": (
    <>
      <Lead>Your admin sends you an invite link. Joining takes a few seconds.</Lead>
      <Do>
        <li>Open the invite link.</li>
        <li>Sign in with Google, using the email the invite was sent to.</li>
        <li>
          Click <b>Join team</b>.
        </li>
      </Do>
      <Shot
        src="team/join-page"
        width={1600} height={960}
        alt="The team invite page with the Join team button"
        marks={[{ circle: [25.1, 81, 49.8, 9.2] }, { cursor: [61, 86.7] }]}
      />
      <p className="mt-6 text-[17px] leading-relaxed">
        If the Showthrough extension is already in your Chrome, it&rsquo;s connected to the team right away and you land in your
        library.
      </p>
      <Shot src="team/joined" width={1600} height={740} alt="You're in Maya's team: the extension is ready for this team" />
      <Note title="Already have Showthrough, or on another team?">
        <p>Keep it. You can be on several teams and keep your own library, and switch between them in the dashboard.</p>
      </Note>
    </>
  ),

  "connect-extension": (
    <>
      <Lead>The extension does the recording. It needs to know which team to save to.</Lead>
      <Do>
        <li>
          Add{" "}
          <a href={site.chromeStoreUrl} {...ext} className={guideLink}>
            Showthrough from the Chrome Web Store
          </a>
          .
        </li>
        <li>
          In your library, click <b>Connect extension</b>.
        </li>
      </Do>
      <Shot
        src="team/member-setup"
        width={1600} height={694}
        alt="The Get ready to record card with the Connect extension button"
        marks={[{ circle: [72, 39.3, 21, 12.2] }, { cursor: [87.1, 46.9] }]}
      />
      <Note title="Joined with the extension already installed?">
        <p>Then it&rsquo;s done: the extension was connected when you joined, and this card isn&rsquo;t shown.</p>
      </Note>
      <Note title="When to connect again">
        <p>Only on a new computer or Chrome profile, or after reinstalling the extension. Each team is connected once.</p>
      </Note>
    </>
  ),

  "record-for-your-team": (
    <>
      <Lead>Record exactly as you normally would. Your videos are saved for the team.</Lead>
      <Do>
        <li>Click the Showthrough icon in Chrome&rsquo;s toolbar.</li>
        <li>
          On more than one team? Pick one in <b>Save to</b>.
        </li>
        <li>
          Choose your camera and mic, then click <b>Start recording</b>.
        </li>
      </Do>
      <Shot
        src="team/save-to"
        width={1200} height={960}
        alt="The recording panel with Save to Maya's team at the top"
        marks={[{ circle: [46.2, 16, 48.3, 9.6] }, { cursor: [81, 22] }]}
      />
      <Note title="Good to know">
        <p>The extension remembers your last choice. The line under Start recording always shows where the video will go.</p>
        <p>
          Only on one team? There&rsquo;s no Save to: everything goes to that team.
        </p>
        <p>You can&rsquo;t change teams in the middle of a recording. Finish it first.</p>
      </Note>
    </>
  ),

  "who-can-see": (
    <>
      <Lead>By default, everyone on the team can find your videos in their library. You can change that for any video.</Lead>
      <Do>
        <li>
          Hover a video, click <b>⋯</b>, then <b>Who can see this</b>.
        </li>
      </Do>
      <Shot
        src="team/share-menu"
        width={1280} height={1080}
        alt="A video's menu with Who can see this"
        marks={[{ circle: [40.6, 74.1, 27.8, 6.7] }, { cursor: [60.6, 78.3] }]}
      />
      <Do start={2}>
        <li>
          Pick <b>Everyone on the team</b>, or <b>Only people I choose</b> and tick who should see it.
        </li>
        <li>
          Click <b>Save</b>.
        </li>
      </Do>
      <Shot src="team/share-dialog" width={1056} height={984} alt="Who can see this: Everyone on the team, or Only people I choose" />
      <Note title="Good to know">
        <p>
          You can also change it on the video&rsquo;s own page: click <b>Who can see this</b> under the video.
        </p>
        <p>Your admin can always see every video in their Cloudflare.</p>
        <p>This only changes who finds it in the dashboard. Anyone you send the link to can still watch it.</p>
        <p>You can change this for videos you recorded. Your admin can change it for any video.</p>
      </Note>
    </>
  ),

  "switch-teams": (
    <>
      <Lead>On more than one team, or have your own Showthrough too? Switch libraries at the top of the sidebar.</Lead>
      <Do>
        <li>Click the team name under the Showthrough logo.</li>
        <li>Pick another team. Your library, team and profile pages switch to it.</li>
      </Do>
      <Shot
        src="team/team-switcher"
        width={1520} height={840}
        alt="The team switcher open, listing Maya's team and Omar's team"
        marks={[{ circle: [1.6, 17.1, 30.4, 10] }]}
      />
      <Note title="Website vs extension">
        <p>
          The switcher picks which library you&rsquo;re looking at. Where a new recording goes is chosen in the extension, with{" "}
          <Link href={team("record-for-your-team")} className={guideLink}>
            Save to
          </Link>
          .
        </p>
        <p>New team? Switch to it and click Connect extension once, if it wasn&rsquo;t connected when you joined.</p>
      </Note>
    </>
  ),

  "leave-a-team": (
    <>
      <Lead>Stopped working with a team? You can leave it yourself.</Lead>
      <Do>
        <li>
          Switch to that team, then open{" "}
          <Link href="/dashboard/team" className={guideLink}>
            Team
          </Link>{" "}
          in the sidebar.
        </li>
        <li>
          Click <b>Leave team</b> and confirm.
        </li>
      </Do>
      <Shot
        src="team/team-leave"
        width={1600} height={747}
        alt="The Leave the team section with the red Leave team button"
        marks={[{ circle: [6.7, 78.6, 13.4, 10.5] }, { cursor: [16.3, 85.1] }]}
      />
      <Note title="What happens">
        <p>Your recordings stay in the team&rsquo;s Cloudflare. The team keeps them and their links keep working.</p>
        <p>The extension forgets that team. Your other teams and your own library aren&rsquo;t affected.</p>
      </Note>
    </>
  ),

  troubleshooting: (
    <>
      <Lead>The usual fixes. Most take a few seconds.</Lead>
      <Note title="“This invite is for … but you’re signed in as …”">
        <p>
          You&rsquo;re signed in with a different Google account. Click <b>Sign in as</b> the invited email, then join.
        </p>
      </Note>
      <Note title="“This invite doesn’t work”">
        <p>The invite was cancelled or already used. Ask your admin for a new one.</p>
      </Note>
      <Note title="The admin can’t invite anyone yet">
        <p>
          They need the latest version first. See{" "}
          <Link href={team("update-showthrough")} className={guideLink}>
            Update Showthrough
          </Link>
          .
        </p>
      </Note>
      <Note title="A recording went to the wrong team">
        <p>
          Check <b>Save to</b> in the extension before you record. Videos can&rsquo;t be moved between teams, because each team
          keeps them in its own Cloudflare.
        </p>
      </Note>
      <Note title="“You’re no longer on …”">
        <p>You were removed from that team, or left it on another computer. The extension has removed it from Save to.</p>
      </Note>
      <Note title="Still stuck?">
        <p>
          Email{" "}
          <a href={`mailto:${site.contactEmail}`} className={guideLink}>
            {site.contactEmail}
          </a>
          . I reply myself.
        </p>
      </Note>
    </>
  ),
};
