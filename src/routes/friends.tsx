import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LegalLayout } from "@/components/legal-layout";
import { copyNeighborPost } from "@/components/views-shared";
import {
  BOARD_HIERARCHY,
  BOARD_QUORUM_NOTE,
  DECISION_STEPS,
  NEIGHBOR_BOARD,
} from "@/lib/neighbor-board";
import { NEIGHBOR_POST, PRODUCT } from "@/lib/product";

const FRIENDS_TITLE = "Friends of Kaukauna Dog Park";
const FRIENDS_DESCRIPTION =
  "Neighbor-run Civic Parks board for Kaukauna Dog Park — check in, earn PawSteps, vote on lighting and access. Not a city app. Free for neighbors. Share milomaps.org/friends.";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: `${FRIENDS_TITLE} · ${PRODUCT.brand}` },
      { name: "description", content: FRIENDS_DESCRIPTION },
      { property: "og:title", content: FRIENDS_TITLE },
      { property: "og:description", content: FRIENDS_DESCRIPTION },
      { property: "og:url", content: `${PRODUCT.canonical}/friends` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: FRIENDS_TITLE },
      { name: "twitter:description", content: FRIENDS_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${PRODUCT.canonical}/friends` }],
  }),
  component: Friends,
});

function Friends() {
  return (
    <LegalLayout title={FRIENDS_TITLE}>
      <p>
        Neighbors helping neighbors keep Kaukauna Dog Park useful, safe, and funded the right way.
        This is a neighbor board — not a city app. Check-ins and votes stay free. Banks and credit
        unions stay grey prospects until they opt in as a transparent custodian for a specific park
        project.
      </p>
      <p>
        <Link className="font-medium text-fg underline" to="/">
          Open the live Civic Parks board
        </Link>{" "}
        on{" "}
        <a className="text-fg underline" href={PRODUCT.canonical}>
          milomaps.org
        </a>
        . Paste the post below into Facebook for other park regulars.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">Paste to Facebook</h2>
      <pre className="whitespace-pre-wrap rounded-md border border-border bg-bg p-3 text-sm text-muted">
        {NEIGHBOR_POST}
      </pre>
      <Button className="mt-3 h-11 w-full" onClick={copyNeighborPost}>
        Copy Facebook-ready post
      </Button>
      <p className="mt-2 text-xs text-subtle">
        Prefer this share page in the link preview? Use{" "}
        <span className="font-medium text-fg">{PRODUCT.canonical}/friends</span>.
      </p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">Board hierarchy (draft — approve or edit)</h2>
      <ol className="list-decimal space-y-2 pl-5">
        {BOARD_HIERARCHY.map((row) => (
          <li key={row.seat}>
            <strong>{row.seat}</strong> — {row.does}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm opacity-80">{BOARD_QUORUM_NOTE}</p>

      <h2 className="mb-2 mt-8 text-xl font-semibold">Seated neighbors (draft)</h2>
      <ul className="space-y-2">
        {NEIGHBOR_BOARD.map((seat) => (
          <li key={seat.id}>
            <strong>{seat.role}</strong> · {seat.name} — {seat.focus}
          </li>
        ))}
      </ul>

      <h2 className="mb-2 mt-8 text-xl font-semibold">How a decision moves</h2>
      <ol className="list-decimal space-y-2 pl-5">
        {DECISION_STEPS.map((step) => (
          <li key={step.title}>
            <strong>{step.title}.</strong> {step.detail}
          </li>
        ))}
      </ol>

      <p className="mt-8">
        At the park today? Share this link, then jump to the{" "}
        <Link className="font-medium text-fg underline" to="/">
          live board
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
