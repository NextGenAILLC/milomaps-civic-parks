import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  SPONSOR_CATEGORY_LABELS,
  SPONSORS,
  type Proposal,
  type Sponsor,
  type SiteId,
} from "@/lib/data";
import type { PublicSponsor } from "@/lib/civic";
import { NEIGHBOR_POST, PUBLIC_SPLIT } from "@/lib/product";
import { toast } from "@/lib/toast";
import { cn, formatUsd } from "@/lib/utils";

export function votesFor(p: Proposal, extra: number) {
  return p.voteSeed + extra;
}
export function fundedFor(p: Proposal, activeSponsorDollars: number, siteCost: number) {
  const share = siteCost > 0 ? activeSponsorDollars * (p.cost / siteCost) : 0;
  return Math.min(p.cost, p.sponsorSeed + share);
}
export function statusLabel(funded: number, cost: number) {
  const pct = funded / cost;
  if (pct >= 1) return "Funded";
  if (pct >= 0.6) return "Ready to build";
  return "On ballot";
}

export function isTrueSponsor(sponsor: Pick<Sponsor, "status" | "paid">) {
  return sponsor.status === "active" && sponsor.paid;
}

export function activeSponsorTotal(sponsors: Pick<Sponsor, "status" | "paid" | "pledged">[]) {
  return sponsors.filter(isTrueSponsor).reduce((sum, sponsor) => sum + sponsor.pledged, 0);
}

export function fallbackSponsors(siteId: SiteId): PublicSponsor[] {
  const now = new Date().toISOString();
  return SPONSORS.filter((s) => s.siteId === siteId).map((s) => ({ ...s, updatedAt: now }));
}

export function usePublicSponsors(siteId: SiteId) {
  const [sponsors, setSponsors] = useState<PublicSponsor[]>(() => fallbackSponsors(siteId));

  useEffect(() => {
    let live = true;
    setSponsors(fallbackSponsors(siteId));
    void import("@/lib/civic")
      .then(({ getPublicSponsors }) => getPublicSponsors({ data: { siteId } }))
      .then((rows) => {
        if (live) setSponsors(rows);
      })
      .catch((err) => {
        console.warn("[civic] sponsor list fallback", err);
      });
    return () => {
      live = false;
    };
  }, [siteId]);

  return sponsors;
}

export function copyNeighborPost() {
  void navigator.clipboard.writeText(NEIGHBOR_POST).then(
    () => toast("Neighbor post copied."),
    () => toast("Copy failed. The text is on the Sponsors tab."),
  );
}

export function SplitCard() {
  const rows = [
    { pct: PUBLIC_SPLIT.park, label: PUBLIC_SPLIT.parkLabel },
    { pct: PUBLIC_SPLIT.operate, label: PUBLIC_SPLIT.operateLabel },
    { pct: PUBLIC_SPLIT.steward, label: PUBLIC_SPLIT.stewardLabel },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Where a sponsor dollar goes</CardTitle>
        <CardDescription>Neighbors pay nothing to check in or vote. This is the whole model.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm">{r.label}</span>
              <span className="font-display text-2xl tabular-nums">{r.pct}%</span>
            </div>
            <Progress value={r.pct} />
          </div>
        ))}
        <p className="text-sm text-muted">{PUBLIC_SPLIT.rule}</p>
      </CardContent>
    </Card>
  );
}

export function MoneyPathCard({ activeCustodianCount }: { activeCustodianCount: number }) {
  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle>Money path, plainly</CardTitle>
        <CardDescription>No private individual holds park or shelter improvement funds.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm text-muted">
        <p>
          <span className="font-medium text-fg">Today:</span> Civic Parks is a neighbor board and
          open ballot. Stripe is not connected, there is no checkout, and package taps are intent
          only.
        </p>
        <p>
          <span className="font-medium text-fg">Before money moves:</span> a bank, credit union, or
          designated shelter partner must opt in as a true sponsor. That sponsor acts as the
          transparent custodian/escrow path for the specific park project.
        </p>
        <p>
          <span className="font-medium text-fg">Active custodians:</span>{" "}
          {activeCustodianCount === 0
            ? "none yet; the page shows the model without pretending live payment wires exist."
            : activeCustodianCount.toLocaleString()}
        </p>
        <Link to="/transparency" className="font-medium text-fg underline">
          Read the transparency page
        </Link>
      </CardContent>
    </Card>
  );
}

export function NeighborPostCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share the neighbor board</CardTitle>
        <CardDescription>
          Copy explains this is not a city app, not a fundraiser, and not a personal handoff.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <pre className="whitespace-pre-wrap rounded-md border border-border bg-bg p-3 text-sm text-muted">
          {NEIGHBOR_POST}
        </pre>
        <Button className="w-full" onClick={copyNeighborPost}>
          Copy neighbor-board post
        </Button>
      </CardContent>
    </Card>
  );
}

export function SponsorCard({ sponsor }: { sponsor: PublicSponsor }) {
  const trueSponsor = isTrueSponsor(sponsor);
  return (
    <Card
      className={cn(
        "rounded-lg",
        trueSponsor ? "border-primary bg-surface" : "border-border bg-surface-2/60 shadow-none opacity-80",
      )}
    >
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={trueSponsor ? "default" : "muted"}>
                {trueSponsor ? "True sponsor" : "Prospect"}
              </Badge>
              <Badge variant="outline">{SPONSOR_CATEGORY_LABELS[sponsor.category]}</Badge>
              {sponsor.isCustodian && trueSponsor ? <Badge variant="outline">Custodian</Badge> : null}
            </div>
            <p className="mt-2 flex items-center gap-2 font-medium">
              <Building2 className="size-4 text-primary" />
              {sponsor.name}
            </p>
            <p className="text-sm text-muted">{sponsor.note}</p>
          </div>
          <p className="shrink-0 tabular-nums text-sm">
            {trueSponsor ? formatUsd(sponsor.pledged) : "not paid"}
          </p>
        </div>
        {trueSponsor ? (
          <Link
            to="/sponsors/$sponsorId"
            params={{ sponsorId: sponsor.id }}
            className="text-sm font-medium text-fg underline"
          >
            Sponsor showcase
          </Link>
        ) : (
          <p className="text-xs text-subtle">Grey prospect only. This is not a paid placement.</p>
        )}
      </CardContent>
    </Card>
  );
}
