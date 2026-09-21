import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DECISION_STEPS,
  NEIGHBOR_BOARD,
  PROPOSAL_META,
  QUORUM_NOTE,
  type BoardSeat,
  type BoardTier,
} from "@/lib/neighbor-board";

const TIER_LABEL: Record<BoardTier, string> = {
  officer: "Officers",
  "at-large": "At-large neighbors",
  "prospect-liaison": "Sponsor liaison (prospects only)",
};

const TIER_ORDER: BoardTier[] = ["officer", "at-large", "prospect-liaison"];

function seatsByTier(tier: BoardTier): BoardSeat[] {
  return NEIGHBOR_BOARD.filter((seat) => seat.tier === tier);
}

export function NeighborBoardSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighbor board</CardTitle>
        <CardDescription>
          Clear roles for Kaukauna Civic Parks regulars — not city appointments. Officers sequence;
          at-large neighbors keep trail and winter truth honest; sponsors stay grey until a true
          custodian opts in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {TIER_ORDER.map((tier) => {
          const seats = seatsByTier(tier);
          if (!seats.length) return null;
          return (
            <div key={tier} className="flex flex-col gap-3">
              <p className="text-xs font-medium uppercase tracking-wide text-subtle">
                {TIER_LABEL[tier]}
              </p>
              {seats.map((seat) => (
                <div key={seat.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{seat.role}</p>
                    <p className="text-xs text-subtle">{seat.name}</p>
                  </div>
                  <p className="mt-1 text-sm text-muted">{seat.focus}</p>
                  <p className="mt-1 text-xs text-subtle">{seat.note}</p>
                </div>
              ))}
            </div>
          );
        })}
        <p className="rounded-md border border-border bg-surface-2/60 p-3 text-xs text-subtle">
          <span className="font-medium text-fg">Quorum / vote · </span>
          {QUORUM_NOTE}
        </p>
      </CardContent>
    </Card>
  );
}

export function DecisionStepsSection({ onOpenBallot }: { onOpenBallot: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>How decisions move</CardTitle>
        <CardDescription>
          Neighbor board, not city hall. What neighbors decide vs what stays grey until a true
          sponsor opts in.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {DECISION_STEPS.map((step, i) => (
          <div key={step.title} className="flex gap-3">
            <span className="font-display text-xl tabular-nums text-primary">{i + 1}</span>
            <div>
              <p className="text-sm font-medium">{step.title}</p>
              <p className="text-sm text-muted">{step.detail}</p>
            </div>
          </div>
        ))}
        <p className="text-xs text-subtle">{QUORUM_NOTE}</p>
        <Button variant="secondary" onClick={onOpenBallot}>
          Open the ballot
        </Button>
      </CardContent>
    </Card>
  );
}

export function ProposalBallotContext({ proposalId }: { proposalId: string }) {
  const meta = PROPOSAL_META[proposalId];
  if (!meta) return null;
  return (
    <div className="rounded-md border border-border bg-surface-2/60 p-3">
      <p className="text-xs uppercase tracking-wide text-subtle">Who it serves</p>
      <p className="mt-1 text-sm text-muted">{meta.who}</p>
      <p className="mt-2 text-sm text-muted">
        <span className="font-medium text-fg">Board note: </span>
        {meta.boardNote}
      </p>
      <p className="mt-2 text-xs text-subtle">Urgency · {meta.urgency}</p>
    </div>
  );
}
