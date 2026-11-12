import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PACKAGES, siteById } from "@/lib/data";
import { allProposals, useMilo } from "@/lib/store";
import { toast } from "@/lib/toast";
import { formatUsd } from "@/lib/utils";
import { MoneyPathCard, NeighborPostCard, SplitCard, SponsorCard, activeSponsorTotal, isTrueSponsor, usePublicSponsors } from "./views-shared";

export function FundView() {
  const siteId = useMilo((s) => s.siteId);
  const extraPledge = useMilo((s) => s.extraPledge[siteId]);
  const pledge = useMilo((s) => s.pledge);
  const custom = useMilo((s) => s.customProposals);
  const siteProps = allProposals({ customProposals: custom }).filter((p) => p.siteId === siteId);
  const totalNeed = siteProps.reduce((s, p) => s + p.cost, 0);
  const localSponsors = usePublicSponsors(siteId);
  const raised = activeSponsorTotal(localSponsors);
  const activeCustodianCount = localSponsors.filter((s) => isTrueSponsor(s) && s.isCustodian).length;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-medium tracking-tight">Sponsors</h1>
        <p className="text-muted">
          Grey cards are prospects. Color cards are true sponsors only after a real sponsorship is opted in and
          recorded as paid. Neighbors do not pay to vote or check in.
        </p>
      </header>
      <MoneyPathCard activeCustodianCount={activeCustodianCount} />
      <SplitCard />
      <Card>
        <CardContent className="p-5">
          <p className="text-xs text-muted">True sponsor dollars recorded for {siteById(siteId).name}</p>
          <p className="font-display text-3xl tabular-nums">{formatUsd(raised)}</p>
          <p className="mt-1 text-sm text-subtle">
            of {formatUsd(totalNeed)} listed work · package intent on this device {formatUsd(extraPledge)}
          </p>
          <Progress className="mt-4" value={totalNeed ? (raised / totalNeed) * 100 : 0} />
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="font-display text-xl font-medium tracking-tight">Fox Valley sponsor board</h2>
          <p className="mt-1 text-sm text-muted">
            Prospects can be named, but they stay muted until a real sponsorship is opted in and
            recorded after verified opt-in.
          </p>
        </div>
        {localSponsors.map((s) => (
          <SponsorCard key={s.id} sponsor={s} />
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-4" />
            Record package intent
          </CardTitle>
          <CardDescription>
            Not a purchase. Stripe is off. Intent does not count as funded work.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {PACKAGES.map((pkg) => (
            <Button
              key={pkg.id}
              variant="secondary"
              className="h-auto min-h-11 w-full justify-between py-3"
              onClick={() => {
                pledge(pkg.amount);
                toast(`Intent recorded: ${formatUsd(pkg.amount)} — ${pkg.note}. No card charged.`);
              }}
            >
              <span>
                {pkg.label}
                <span className="mt-0.5 block text-xs font-normal text-muted">{pkg.note}</span>
              </span>
              <span className="tabular-nums">{formatUsd(pkg.amount)}</span>
            </Button>
          ))}
        </CardContent>
      </Card>
      <NeighborPostCard />
    </div>
  );
}
