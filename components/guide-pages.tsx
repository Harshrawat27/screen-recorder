import Link from "next/link";
import { Do, Lead, Note, Shot, guideLink } from "@/components/guide";
import { guidePages, guidePath } from "@/lib/guide";
import { site } from "@/lib/site";

// What each page of the setup guide says. Keep every page short: one screen, a few actions.

const SIGN_UP = "https://dash.cloudflare.com/sign-up";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export const guideContent: Record<string, React.ReactNode> = {
  "": (
    <>
      <Lead>Connect Showthrough to your own Cloudflare, then record. About two minutes, and you only do it once.</Lead>
      <Note title="You'll need">
        <p>· A Showthrough account (sign in with Google)</p>
        <p>· Google Chrome</p>
        <p>· A card for Cloudflare. You won&rsquo;t be charged for your first 10 GB each month.</p>
      </Note>
      <h2 className="mt-10 text-2xl">The steps</h2>
      <ol className="mt-4 list-decimal space-y-2 pl-6 text-[17px] marker:text-muted">
        {guidePages.slice(1, -1).map((p) => (
          <li key={p.slug}>
            <Link href={guidePath(p.slug)} className="hover:underline hover:underline-offset-2">
              {p.nav}
            </Link>
          </li>
        ))}
      </ol>
    </>
  ),

  "create-cloudflare-account": (
    <>
      <Lead>Your videos are stored in your own Cloudflare account. It&rsquo;s free to create.</Lead>
      <Do>
        <li>
          Open{" "}
          <a href={SIGN_UP} {...ext} className={guideLink}>
            Cloudflare sign-up
          </a>
          .
        </li>
        <li>Continue with Google, or use an email and password.</li>
      </Do>
      <Shot
        src="cloudflare-sign-up"
        width={1383} height={1123}
        alt="Cloudflare's sign-up page, with Continue with Google at the top"
        marks={[{ circle: [17.4, 22.1, 65.0, 7.3] }, { cursor: [59.4, 27.3] }]}
      />
      <Note title="Already have an account?">
        <p>Just log in and go to the next step.</p>
      </Note>
    </>
  ),

  "turn-on-r2": (
    <>
      <Lead>
        R2 is the part of Cloudflare that stores your videos. Most of Cloudflare works without a card, but R2 asks for one before it
        turns on.
      </Lead>
      <Note title="You add a card, but you pay $0">
        <p>Your first 10 GB every month are free. That&rsquo;s roughly 100 hours of recordings.</p>
        <p>Watching your videos is always free.</p>
        <p>You&rsquo;re only charged if you go past 10 GB: $0.015 per GB a month, so 110 GB costs about $1.50 a month.</p>
      </Note>
      <Do>
        <li>
          In the sidebar, open <b>Storage &amp; databases</b> → <b>R2 Object Storage</b>.
        </li>
        <li>
          Click <b>Add R2 subscription to my account</b>.
        </li>
      </Do>
      <Shot
        src="r2-get-started"
        width={1600} height={800}
        alt="Cloudflare's R2 page, showing the free monthly usage and the Add R2 subscription button"
        marks={[{ circle: [2.7, 52.8, 13.6, 4.2] }, { circle: [61.1, 37.1, 36.9, 5.2] }, { cursor: [75.0, 40.9] }]}
      />
      <Do start={3}>
        <li>Add a card, Apple Pay or PayPal.</li>
        <li>
          Confirm. <b>Due today: $0.</b>
        </li>
      </Do>
      <Shot
        src="r2-add-card"
        width={1600} height={982}
        alt="Cloudflare's Activate R2 page: card details on the left, $0 due today on the right"
        marks={[{ circle: [4.3, 55.5, 39.8, 15.2] }, { circle: [54.7, 77.8, 40.3, 4.7] }]}
      />
    </>
  ),

  "connect-cloudflare": (
    <>
      <Lead>Now come back to Showthrough and let it set things up for you.</Lead>
      <Do>
        <li>
          Open your{" "}
          <Link href="/dashboard" className={guideLink}>
            Showthrough library
          </Link>{" "}
          and click <b>Connect Cloudflare</b>.
        </li>
        <li>
          On Cloudflare, click <b>Authorize</b>.
        </li>
      </Do>
      <Shot
        src="connect-screen"
        width={1600} height={992}
        alt="The Showthrough library with the three setup steps and the Connect Cloudflare button"
        marks={[{ circle: [79.0, 50.5, 16.5, 6.4] }, { cursor: [90.4, 55.7] }]}
      />
      <Shot
        src="authorize"
        width={1600} height={1008}
        alt="Cloudflare asking whether Showthrough may access your account, with the Authorize button"
        marks={[{ circle: [52.7, 77.0, 41.4, 5.7] }, { cursor: [77.2, 81.3] }]}
      />
      <Note title="What does Showthrough get?">
        <p>Only what it needs to create its own storage, database and video backend. It doesn&rsquo;t touch your other projects.</p>
        <p>We use the permission once and then throw it away. We keep no access to your account.</p>
      </Note>
      <Note title="More than one Cloudflare account?">
        <p>Click Edit on the Authorize page and pick the one where you turned on R2.</p>
      </Note>
    </>
  ),

  "wait-for-setup": (
    <>
      <Lead>Showthrough is creating your storage and video backend. Keep the page open.</Lead>
      <Shot src="setting-up" width={1123} height={821} alt="Showthrough setting up your Cloudflare, with four steps ticking off" />
      <p className="mt-6 text-[17px] leading-relaxed">
        When it&rsquo;s done, you&rsquo;re back in your library with step 1 marked <b>Done</b>.
      </p>
    </>
  ),

  "add-extension": (
    <>
      <Lead>The extension does the recording.</Lead>
      <Do>
        <li>
          Open{" "}
          <a href={site.chromeStoreUrl} {...ext} className={guideLink}>
            Showthrough on the Chrome Web Store
          </a>
          .
        </li>
        <li>
          Click <b>Add to Chrome</b>.
        </li>
      </Do>
      <Shot
        src="chrome-web-store"
        width={1600} height={480}
        alt="The Showthrough extension on the Chrome Web Store, with the Add to Chrome button"
        marks={[{ circle: [79.6, 38.0, 11.8, 10.4] }, { cursor: [87.1, 46.6] }]}
      />
      <Note title="Tip">
        <p>Pin it: click the puzzle icon in Chrome&rsquo;s toolbar, then the pin next to Showthrough.</p>
      </Note>
    </>
  ),

  "connect-extension": (
    <>
      <Lead>This tells the extension where to save your videos. No keys to copy.</Lead>
      <Do>
        <li>
          In your library, click <b>Connect extension</b>.
        </li>
        <li>
          You&rsquo;ll see <b>Extension connected</b>.
        </li>
      </Do>
      <Shot
        src="cloudflare-done"
        width={1600} height={760}
        alt="The library with Cloudflare connected and the Connect extension button"
        marks={[{ circle: [74.7, 53.1, 19.8, 10.2] }, { cursor: [88.3, 60.9] }]}
      />
      <Shot src="extension-connected" width={1123} height={821} alt="Showthrough confirming the extension is connected" />
    </>
  ),

  record: (
    <>
      <Lead>You&rsquo;re all set. Let&rsquo;s record.</Lead>
      <Do>
        <li>
          Click <b>New video</b> in your library, or the Showthrough icon in Chrome&rsquo;s toolbar.
        </li>
        <li>
          Pick your camera and mic, then <b>Start recording</b>.
        </li>
        <li>Press stop when you&rsquo;re done. The link is copied for you.</li>
      </Do>
      <Shot
        src="new-video"
        width={1600} height={682}
        alt="The library with every setup step done and the New video button"
        marks={[{ circle: [87.5, 14.0, 9.4, 7.1] }, { cursor: [93.5, 19.6] }]}
      />
      <Shot
        src="toolbar-icon"
        width={1512} height={648}
        alt="The Showthrough icon in Chrome's toolbar"
        marks={[{ circle: [66.2, 14.9, 3.4, 8.5] }, { cursor: [68.8, 21.9] }]}
      />
      <Shot
        src="record-panel"
        width={1600} height={872}
        alt="The Showthrough panel with camera, microphone and the Start recording button"
        marks={[{ circle: [78.6, 29.4, 19.1, 5.8] }, { cursor: [90.0, 33.8] }]}
      />
    </>
  ),

  troubleshooting: (
    <>
      <Lead>The usual fixes. Most take a few seconds.</Lead>
      <Note title="“R2 isn’t turned on”">
        <p>
          Do{" "}
          <Link href="/guide/turn-on-r2" className={guideLink}>
            Turn on R2
          </Link>
          , then click Connect Cloudflare again.
        </p>
      </Note>
      <Note title="Connected the wrong Cloudflare account">
        <p>
          Go to Profile, press Disconnect Cloudflare, and connect again. On the Authorize page, click Edit to pick the right account.
        </p>
      </Note>
      <Note title="Connect extension can't find the extension">
        <p>Make sure it&rsquo;s added to Chrome, then reload your library and try again.</p>
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
