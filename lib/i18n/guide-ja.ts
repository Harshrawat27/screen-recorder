import type { GuideCopy } from "@/lib/i18n/guide-types";

export const guideJa: GuideCopy = {
  title: "Showthroughのセットアップ",
  description: "Showthroughをあなた自身のCloudflareに接続して、最初の動画を録画しましょう。所要時間は約2分、設定は一度だけです。",
  lead: "Showthroughをあなた自身のCloudflareに接続したら、あとは録画するだけ。所要時間は約2分、設定は一度だけです。",
  need: {
    title: "必要なもの",
    lines: ["Showthroughアカウント（Googleでログイン）", "Google Chrome", "Cloudflare用のカード。毎月最初の10GBまでは料金はかかりません。"],
  },
  stepsTitle: "手順",
  step: "ステップ{n}",
  english: "スクリーンショットはShowthroughとCloudflareの英語画面です。",
  steps: {
    "create-cloudflare-account": {
      title: "Cloudflareアカウントを作成する",
      lead: "動画はあなた自身のCloudflareアカウントに保存されます。作成は無料です。",
      actions: ["[[Cloudflareの登録ページ|https://dash.cloudflare.com/sign-up]]を開きます。", "Googleで続行するか、メールアドレスとパスワードで登録します。"],
      notes: [{ title: "すでにアカウントをお持ちの場合", lines: ["ログインして次のステップへ進んでください。"] }],
    },
    "turn-on-r2": {
      title: "R2を有効にする",
      lead: "R2は動画を保存するCloudflareの機能です。Cloudflareのほとんどの機能はカードなしで使えますが、R2は有効にする前にカード登録が必要です。",
      notesBefore: [
        {
          title: "カードは登録しますが、支払いは0ドルです",
          lines: [
            "毎月最初の10GBは無料です。録画にして約8時間分で、古い動画はいつでも削除できます。",
            "動画の視聴は常に無料です。",
            "料金がかかるのは10GBを超えた場合のみ。1GBあたり月0.015ドルなので、110GBでも月約1.50ドルです。",
          ],
        },
      ],
      actions: ["サイドバーで **Storage & databases** → **R2 Object Storage** を開きます。", "**Add R2 subscription to my account** をクリックします。"],
      actionsAfterShot: ["カード、Apple Pay、またはPayPalを追加します。", "確定します。**Due today: $0.**（本日の請求額は0ドル）"],
    },
    "connect-cloudflare": {
      title: "Cloudflareを接続する",
      lead: "Showthroughに戻って、あとは自動セットアップにお任せください。",
      actions: ["[[Showthroughのライブラリ|/dashboard]]を開き、**Connect Cloudflare** をクリックします。", "Cloudflareの画面で **Authorize** をクリックします。"],
      notes: [
        {
          title: "Showthroughに渡る権限は？",
          lines: [
            "専用のストレージ、データベース、動画バックエンドを作るのに必要な権限だけです。他のプロジェクトには触れません。",
            "権限は一度使ったら破棄します。あなたのアカウントへのアクセス権は残りません。",
          ],
        },
        { title: "Cloudflareアカウントが複数ある場合", lines: ["Authorizeページで「Edit」をクリックし、R2を有効にしたアカウントを選んでください。"] },
      ],
    },
    "wait-for-setup": {
      title: "30秒ほど待つ",
      lead: "Showthroughがストレージと動画バックエンドを作成しています。ページは開いたままにしてください。",
      after: "完了するとライブラリに戻り、ステップ1が **Done** になります。",
    },
    "add-extension": {
      title: "Chrome拡張機能を追加する",
      lead: "録画は拡張機能で行います。",
      actions: ["[[ChromeウェブストアのShowthrough|CHROME]]を開きます。", "**Add to Chrome**（Chromeに追加）をクリックします。"],
      notes: [{ title: "ヒント", lines: ["ピン留めしておくと便利です。Chromeのツールバーのパズルアイコンをクリックし、Showthroughの横のピンを押します。"] }],
    },
    "connect-extension": {
      title: "拡張機能を接続する",
      lead: "動画の保存先を拡張機能に伝えます。キーのコピーは不要です。",
      actions: ["ライブラリで **Connect extension** をクリックします。", "**Extension connected** と表示されれば完了です。"],
    },
    record: {
      title: "最初の動画を録画する",
      lead: "準備完了です。録画してみましょう。",
      actions: [
        "ライブラリの **New video**、またはChromeツールバーのShowthroughアイコンをクリックします。",
        "カメラとマイクを選び、**Start recording** を押します。",
        "終わったら停止を押します。リンクは自動でコピーされます。",
      ],
    },
    troubleshooting: {
      title: "うまくいかないとき",
      lead: "よくある解決方法です。ほとんどは数秒で終わります。",
      notes: [
        { title: "「R2 isn’t turned on」と表示される", lines: ["[[R2を有効にする|#turn-on-r2]]を行ってから、もう一度 Connect Cloudflare をクリックしてください。"] },
        {
          title: "違うCloudflareアカウントを接続してしまった",
          lines: ["Profileで「Disconnect Cloudflare」を押してから、接続し直してください。Authorizeページで「Edit」をクリックすると正しいアカウントを選べます。"],
        },
        { title: "Connect extensionで拡張機能が見つからない", lines: ["Chromeに追加されているか確認し、ライブラリを再読み込みしてからもう一度お試しください。"] },
        { title: "それでも解決しない場合", lines: ["{email} までご連絡ください。開発者本人が返信します（英語）。"] },
      ],
    },
  },
  alts: {
    "cloudflare-sign-up": "Cloudflareの登録ページ。上部に「Continue with Google」",
    "r2-get-started": "CloudflareのR2ページ。毎月の無料枠と「Add R2 subscription」ボタン",
    "r2-add-card": "「Activate R2」ページ。左にカード情報、右に本日の請求額0ドル",
    "connect-screen": "Showthroughのライブラリ。3つのセットアップ手順と「Connect Cloudflare」ボタン",
    authorize: "ShowthroughによるアカウントへのアクセスをCloudflareが確認する画面と「Authorize」ボタン",
    "setting-up": "ShowthroughがCloudflareをセットアップ中。4つの手順に順にチェックが付く",
    "chrome-web-store": "ChromeウェブストアのShowthrough拡張機能と「Add to Chrome」ボタン",
    "cloudflare-done": "Cloudflare接続済みのライブラリと「Connect extension」ボタン",
    "extension-connected": "拡張機能の接続完了を知らせるShowthroughの画面",
    "new-video": "すべての手順が完了したライブラリと「New video」ボタン",
    "toolbar-icon": "ChromeツールバーのShowthroughアイコン",
    "record-panel": "カメラ、マイク、「Start recording」ボタンがあるShowthroughのパネル",
  },
};
