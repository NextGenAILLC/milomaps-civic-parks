import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DECISION_STEPS, NEIGHBOR_BOARD, PROPOSAL_META } from "@/lib/neighbor-board";

export function NeighborBoardSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Neighbor board</CardTitle>
        <CardDescription>
          Roles for Kaukauna Civic Parks regulars — not city appointments. These are the people
          sequencing choices for decision makers.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {NEIGHBOR_BOARD.map((seat) => (
          <div key={seat.id} className="border-t border-border pt-3 first:border-0 first:pt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm font-medium">{seat.role}</p>
              <p className="text-xs text-subtle">{seat.name}</p>
            </div>
            <p className="mt-1 text-sm text-muted">{seat.focus}</p>
            <p className="mt-1 text-xs text-subtle">{seat.note}</p>
          </div>
        ))}
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
          What neighbors decide vs what stays grey until a true sponsor opts in.
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
