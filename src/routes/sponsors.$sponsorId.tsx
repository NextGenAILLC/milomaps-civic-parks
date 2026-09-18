import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ExternalLink, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  SPONSOR_CATEGORY_LABELS,
  SPONSORS,
  siteById,
  type Sponsor,
} from "@/lib/data";
import type { PublicSponsor } from "@/lib/civic";
import { PRODUCT } from "@/lib/product";
import { cn, formatUsd } from "@/lib/utils";

export const Route = createFileRoute("/sponsors/$sponsorId")({ component: SponsorShowcase });

function isTrueSponsor(sponsor: Pick<Sponsor, "status" | "paid">) {
  return sponsor.status === "active" && sponsor.paid;
}

function fallbackSponsor(id: string): PublicSponsor | null {
  const found = SPONSORS.find((s) => s.id === id);
  return found ? { ...found, updatedAt: new Date().toISOString() } : null;
}

function SponsorShowcase() {
  const { sponsorId } = Route.useParams();
  const [sponsors, setSponsors] = useState<PublicSponsor[]>(() => {
    const sponsor = fallbackSponsor(sponsorId);
    return sponsor ? [sponsor] : [];
  });

  useEffect(() => {
    let live = true;
    void import("@/lib/civic")
      .then(({ getPublicSponsors }) => getPublicSponsors({ data: {} }))
      .then((rows) => {
        if (live) setSponsors(rows);
      })
      .catch((err) => {
        console.warn("[civic] sponsor showcase fallback", err);
      });
    return () => {
      live = false;
    };
  }, []);

  const sponsor = useMemo(
    () => sponsors.find((row) => row.id === sponsorId) ?? fallbackSponsor(sponsorId),
    [sponsorId, sponsors],
  );

  if (!sponsor) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg bg-bg px-4 py-8 text-fg">
        <p className="text-xs text-subtle">{PRODUCT.brand} · sponsor board</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">Sponsor not found</h1>
        <p className="mt-4 text-sm text-muted">This sponsor is not in the Civic Parks seed list.</p>
        <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg">
          Back to Civic Parks
        </Link>
      </main>
    );
  }

  const trueSponsor = isTrueSponsor(sponsor);
  const site = siteById(sponsor.siteId);

  return (
    <main className="mx-auto min-h-dvh max-w-lg bg-bg px-4 py-8 text-fg">
      <p className="text-xs text-subtle">{PRODUCT.brand} · true sponsor showcase</p>
      <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">{sponsor.name}</h1>
      <Card className={cn("mt-6", trueSponsor ? "border-primary" : "bg-surface-2/60 shadow-none opacity-80")}>
        <CardHeader>
          <div className="flex flex-wrap gap-2">
            <Badge variant={trueSponsor ? "default" : "muted"}>
              {trueSponsor ? "True sponsor" : "Prospect only"}
            </Badge>
            <Badge variant="outline">{SPONSOR_CATEGORY_LABELS[sponsor.category]}</Badge>
            {sponsor.isCustodian && trueSponsor ? <Badge variant="outline">Custodian sponsor</Badge> : null}
          </div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="size-5 text-primary" />
            {sponsor.showcaseTitle || sponsor.name}
          </CardTitle>
          <CardDescription>{site.name}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 text-sm text-muted">
          {trueSponsor ? (
            <>
              <p>{sponsor.showcaseBody}</p>
              <div className="rounded-md border border-border bg-bg p-3">
                <p className="text-xs uppercase tracking-wide text-subtle">Recorded support</p>
                <p className="font-display text-2xl text-fg tabular-nums">{formatUsd(sponsor.pledged)}</p>
              </div>
              {sponsor.isCustodian ? (
                <p className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
                  This sponsor is marked as a custody/escrow path for park project funds.
                </p>
              ) : (
                <p>
                  This sponsor is active, but not marked as the custody/escrow path. Project funds
                  still require a bank, credit union, or designated shelter partner custodian.
                </p>
              )}
            </>
          ) : (
            <>
              <p>
                This is a grey prospect listing, not a paid placement and not a public sponsorship
                claim.
              </p>
              <p>{sponsor.note}</p>
            </>
          )}
          {sponsor.website ? (
            <a
              href={sponsor.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-medium text-fg underline"
            >
              Visit sponsor site
              <ExternalLink className="size-4" />
            </a>
          ) : null}
        </CardContent>
      </Card>
      <div className="mt-6 flex flex-wrap gap-3 text-sm">
        <Link to="/" className="underline">
          Back to ballot
        </Link>
        <Link to="/transparency" className="underline">
          Money transparency
        </Link>
      </div>
    </main>
  );
}
