import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";
import { PRODUCT } from "@/lib/product";
import {
  BOARD_HIERARCHY,
  BOARD_QUORUM_NOTE,
  DECISION_STEPS,
  NEIGHBOR_BOARD,
} from "@/lib/neighbor-board";

export const Route = createFileRoute("/friends")({ component: Friends });

function Friends() {
  return (
    <LegalLayout title="Friends of Kaukauna Dog Park">
      <p>
        Neighbors helping neighbors keep Kaukauna Dog Park useful, safe, and funded the right way.
        This is a neighbor board — not a city app. Check-ins and votes stay free. Banks and credit
        unions stay grey prospects until they opt in as a transparent custodian for a specific park
        project.
      </p>
      <p>
        <Link className="text-fg underline font-medium" to="/">
          Open the live Civic Parks board
        </Link>{" "}
        on{" "}
        <a className="text-fg underline" href={PRODUCT.canonical}>
          milomaps.org
        </a>
        . Paste this page into Facebook for other park regulars.
      </p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Board hierarchy (draft — approve or edit)</h2>
      <ol className="list-decimal space-y-2 pl-5">
        {BOARD_HIERARCHY.map((row) => (
          <li key={row.seat}>
            <strong>{row.seat}</strong> — {row.does}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm opacity-80">{BOARD_QUORUM_NOTE}</p>

      <h2 className="mt-8 mb-2 text-xl font-semibold">Seated neighbors (draft)</h2>
      <ul className="space-y-2">
        {NEIGHBOR_BOARD.map((seat) => (
          <li key={seat.id}>
            <strong>{seat.role}</strong> · {seat.name} — {seat.focus}
          </li>
        ))}
      </ul>

      <h2 className="mt-8 mb-2 text-xl font-semibold">How a decision moves</h2>
      <ol className="list-decimal space-y-2 pl-5">
        {DECISION_STEPS.map((step) => (
          <li key={step.title}>
            <strong>{step.title}.</strong> {step.detail}
          </li>
        ))}
      </ol>

      <p className="mt-8">
        At the park today? Share this link, then jump to the{" "}
        <Link className="text-fg underline font-medium" to="/">
          live board
        </Link>
        .
      </p>
    </LegalLayout>
  );
}
