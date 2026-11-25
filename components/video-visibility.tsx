"use client";

import { useEffect, useState } from "react";
import { buttonClass } from "@/components/ui";
import { type TeamPerson, type Visibility, VisibilityDialog } from "@/components/visibility-dialog";

type State = {
  title: string;
  recordedBy: string | null;
  visibility: Visibility;
  sharedWith: string[];
  team: { ownerId: string; people: TeamPerson[] };
};

/** "Who can see this" under a team video, for the admin and whoever recorded it. */
export function VideoVisibility({ space, id }: { space: string; id: string }) {
  const [state, setState] = useState<State | null>(null);
  const [open, setOpen] = useState(false);
  const url = `/api/v/${space}/${id}/visibility`;

  useEffect(() => {
    let live = true;
    fetch(url, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ({ enabled: boolean } & State) | null) => live && data?.enabled && setState(data))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, [url]);

  if (!state) return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass("secondary", "sm")}>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden className="size-4">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Who can see this · {state.visibility === "chosen" ? "Chosen people" : "Team"}
      </button>
      {open && (
        <VisibilityDialog
          title={state.title}
          recordedBy={state.recordedBy}
          team={state.team}
          initial={{ visibility: state.visibility, sharedWith: state.sharedWith }}
          saveUrl={url}
          open={open}
          onClose={() => setOpen(false)}
          onSaved={(visibility, sharedWith) => setState({ ...state, visibility, sharedWith })}
        />
      )}
    </>
  );
}
