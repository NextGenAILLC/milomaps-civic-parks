import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Accessibility, Building2, Footprints, Landmark, MapPin, Shield, Sun, Trees, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ParkMap } from "@/components/park-map";
import { LaunchNameCard, useOnParksName } from "@/components/launch-name";
import {
  CHALLENGES,
  CONCEPT_LEDGER,
  PACKAGES,
  SPONSOR_CATEGORY_LABELS,
  SPONSORS,
  TAGS,
  haversineM,
  siteById,
  type Proposal,
  type Sponsor,
  type SiteId,
} from "@/lib/data";
import type { PublicSponsor } from "@/lib/civic.server";
import { NEIGHBOR_POST, PRODUCT, PUBLIC_SPLIT } from "@/lib/product";
import { allProposals, useMilo } from "@/lib/store";
import { toast } from "@/lib/toast";
import { cn, formatUsd, formatWhen } from "@/lib/utils";

function votesFor(p: Proposal, extra: number) {
  return p.voteSeed + extra;
}
function fundedFor(p: Proposal, activeSponsorDollars: number, siteCost: number) {
  const share = siteCost > 0 ? activeSponsorDollars * (p.cost / siteCost) : 0;
  return Math.min(p.cost, p.sponsorSeed + share);
}
function statusLabel(funded: number, cost: number) {
  const pct = funded / cost;
  if (pct >= 1) return "Funded";
  if (pct >= 0.6) return "Ready to build";
  return "On ballot";
}

function isTrueSponsor(sponsor: Pick<Sponsor, "status" | "paid">) {
  return sponsor.status === "active" && sponsor.paid;
}

function activeSponsorTotal(sponsors: Pick<Sponsor, "status" | "paid" | "pledged">[]) {
  return sponsors.filter(isTrueSponsor).reduce((sum, sponsor) => sum + sponsor.pledged, 0);
}

function fallbackSponsors(siteId: SiteId): PublicSponsor[] {
  const now = new Date().toISOString();
  return SPONSORS.filter((s) => s.siteId === siteId).map((s) => ({ ...s, updatedAt: now }));
}

function usePublicSponsors(siteId: SiteId) {
  const [sponsors, setSponsors] = useState<PublicSponsor[]>(() => fallbackSponsors(siteId));

  useEffect(() => {
    let live = true;
    setSponsors(fallbackSponsors(siteId));
    void import("@/lib/civic.server")
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

function copyNeighborPost() {
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

function MoneyPathCard({ activeCustodianCount }: { activeCustodianCount: number }) {
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

function NeighborPostCard() {
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

function SponsorCard({ sponsor }: { sponsor: PublicSponsor }) {
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

export function ParkView() {
  const setTab = useMilo((s) => s.setTab);
  const siteId = useMilo((s) => s.siteId);
  const tokens = useMilo((s) => s.tokens);
  const visits = useMilo((s) => s.visits);
  const loops = useMilo((s) => s.loops);
  const streak = useMilo((s) => s.streak);
  const walkMinutes = useMilo((s) => s.walkMinutes);
  const nightMode = useMilo((s) => s.nightMode);
  const toggleNight = useMilo((s) => s.toggleNight);
  const challenges = useMilo((s) => s.challenges);
  const site = siteById(siteId);
  const done = CHALLENGES.filter((c) => challenges[c.id]).length;
  const onName = useOnParksName();

  return (
    <div className="flex flex-col gap-6">
      {onName ? null : <LaunchNameCard />}
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">{site.name}</h1>
        <p className="max-w-xl text-muted">{site.blurb}</p>
        <p className="text-sm text-subtle">
          {site.address} · {site.hours}
        </p>
      </header>
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Neighbor board + open ballot</CardTitle>
          <CardDescription>
            Friends of Kaukauna Dog Park style: regulars name issues, vote in public, and keep the
            park free.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted">
          <p>
            This is not a city app and does not imply city approval. The park is community-used and
            effectively ungoverned day to day; Civic Parks captures neighbor signal for lighting,
            ground, access, seating, and winter routes.
          </p>
          <p>Neighbors still pay $0 to check in, earn {PRODUCT.token}, or vote.</p>
        </CardContent>
      </Card>
      <ParkMap siteId={siteId} />
      <div className="flex gap-2">
        <Button variant="secondary" className="flex-1" onClick={toggleNight}>
          <Sun className="size-4" />
          {nightMode ? "Day map" : "Night preview"}
        </Button>
        <Button className="flex-1" onClick={() => setTab("checkin")}>
          Check in
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: PRODUCT.token, value: tokens },
          { label: "Visits", value: visits },
          { label: "Loops", value: loops },
          { label: "Streak", value: streak },
        ].map((s) => (
          <Card key={s.label} className="rounded-lg">
            <CardContent className="p-3">
              <p className="text-xs text-muted">{s.label}</p>
              <p className="font-display text-xl tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>What is broken</CardTitle>
          <CardDescription>
            {walkMinutes} walk minutes on this device. {done}/{CHALLENGES.length} challenges closed.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {site.issues.map((issue) => (
            <div key={issue.id} className="border-t border-border pt-4 first:border-0 first:pt-0">
              <p className="text-sm font-medium">{issue.title}</p>
              <p className="mt-1 text-sm text-muted">{issue.detail}</p>
            </div>
          ))}
          <Button variant="secondary" onClick={() => setTab("vote")}>
            Open the ballot
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Challenges</CardTitle>
          <CardDescription>Earn extra {PRODUCT.token} for real use, not likes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {CHALLENGES.map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-xs text-muted">{c.detail}</p>
              </div>
              <Badge variant={challenges[c.id] ? "default" : "outline"}>
                {challenges[c.id] ? "Done" : `+${c.reward}`}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <ul className="grid gap-2 text-sm text-muted sm:grid-cols-2">
        {site.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Trees className="mt-0.5 size-4 shrink-0 text-primary" />
            {f}
          </li>
        ))}
      </ul>
      <p className="text-xs text-subtle">
        {PRODUCT.canonical} · neighbor board · not a city app · no city approval required for the
        ballot · neighbors $0.{" "}
        <Link to="/about" className="underline">
          About
        </Link>
        {" · "}
        <Link to="/transparency" className="underline">
          Transparency
        </Link>
        {" · "}
        <Link to="/privacy" className="underline">
          Privacy
        </Link>
        {" · "}
        <Link to="/terms" className="underline">
          Terms
        </Link>
        {" · "}
        <a href={PRODUCT.parentUrl} className="underline">
          milomaps.com
        </a>
      </p>
    </div>
  );
}

export function VoteView() {
  const siteId = useMilo((s) => s.siteId);
  const votes = useMilo((s) => s.votes);
  const tokens = useMilo((s) => s.tokens);
  const vote = useMilo((s) => s.vote);
  const addProposal = useMilo((s) => s.addProposal);
  const addComment = useMilo((s) => s.addComment);
  const comments = useMilo((s) => s.comments);
  const custom = useMilo((s) => s.customProposals);
  const sponsors = usePublicSponsors(siteId);
  const [tag, setTag] = useState<(typeof TAGS)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [draft, setDraft] = useState({ title: "", summary: "", cost: "8000", tag: "Access" });

  const list = useMemo(() => {
    const all = allProposals({ customProposals: custom }).filter((p) => p.siteId === siteId);
    const filtered = tag === "All" ? all : all.filter((p) => p.tag === tag);
    return [...filtered].sort((a, b) => votesFor(b, votes[b.id] ?? 0) - votesFor(a, votes[a.id] ?? 0));
  }, [custom, siteId, tag, votes]);
  const siteCost = list.reduce((s, p) => s + p.cost, 0) || 1;
  const activeSponsorDollars = activeSponsorTotal(sponsors);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-medium tracking-tight">Ballot</h1>
        <p className="text-muted">
          Spend {PRODUCT.token} earned on site. Highest-voted work tells true sponsors what the
          neighbor board wants next at {siteById(siteId).name}.
        </p>
        <p className="text-sm tabular-nums text-subtle">
          Balance {tokens} · true sponsor dollars recorded {formatUsd(activeSponsorDollars)}
        </p>
      </header>
      <div className="flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTag(t)}
            className={
              tag === t
                ? "rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-fg"
                : "rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted"
            }
          >
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        {list.map((p) => {
          const v = votesFor(p, votes[p.id] ?? 0);
          const funded = fundedFor(p, activeSponsorDollars, siteCost);
          const open = openId === p.id;
          const thread = comments.filter((c) => c.proposalId === p.id);
          return (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <Badge>{p.tag}</Badge>
                  <span className="text-xs tabular-nums text-subtle">
                    {statusLabel(funded, p.cost)} · {formatUsd(p.cost)}
                  </span>
                </div>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.summary}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted">{p.why}</p>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-subtle">
                    <span>
                      Votes {v.toLocaleString()} / {p.voteGoal}
                    </span>
                    <span>True sponsor funded {Math.round((funded / p.cost) * 100)}%</span>
                  </div>
                  <Progress value={(v / p.voteGoal) * 100} />
                </div>
                <div className="flex gap-2">
                  {[1, 5, 10].map((n) => (
                    <Button
                      key={n}
                      size="sm"
                      variant={n === 1 ? "default" : "secondary"}
                      disabled={tokens < n}
                      onClick={() => toast(vote(p.id, n).message)}
                    >
                      {n}
                    </Button>
                  ))}
                  <Button size="sm" variant="ghost" onClick={() => setOpenId(open ? null : p.id)}>
                    {open ? "Hide" : "Discuss"}
                  </Button>
                </div>
                {open ? (
                  <div className="flex flex-col gap-2 border-t border-border pt-3">
                    {thread.length === 0 ? (
                      <p className="text-xs text-subtle">No notes yet on this item.</p>
                    ) : (
                      thread.map((c) => (
                        <p key={c.id} className="text-sm">
                          <span className="font-medium">{c.author}</span>
                          <span className="text-subtle"> · {formatWhen(c.at)}</span>
                          <span className="mt-0.5 block text-muted">{c.text}</span>
                        </p>
                      ))
                    )}
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Add a note for the board"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        addComment(p.id, note);
                        setNote("");
                        toast("Note posted.");
                      }}
                    >
                      Post note
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>File a concept</CardTitle>
          <CardDescription>Lands on this site ballot and the {PRODUCT.brand} ledger.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Title"
            className="h-11 rounded-md border border-border bg-bg px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <textarea
            value={draft.summary}
            onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
            placeholder="What should get built, and why"
            rows={3}
            className="resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <div className="flex gap-2">
            <input
              value={draft.cost}
              onChange={(e) => setDraft({ ...draft, cost: e.target.value })}
              inputMode="numeric"
              className="h-11 w-28 rounded-md border border-border bg-bg px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <select
              value={draft.tag}
              onChange={(e) => setDraft({ ...draft, tag: e.target.value })}
              className="h-11 flex-1 rounded-md border border-border bg-bg px-3 text-sm"
            >
              {TAGS.filter((t) => t !== "All").map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <Button
            onClick={() => {
              if (!draft.title.trim() || !draft.summary.trim()) {
                toast("Title and summary are required.");
                return;
              }
              addProposal({
                siteId,
                title: draft.title.trim(),
                summary: draft.summary.trim(),
                why: draft.summary.trim(),
                cost: Math.max(500, Number(draft.cost) || 8000),
                voteGoal: 120,
                tag: draft.tag,
              });
              setDraft({ title: "", summary: "", cost: "8000", tag: "Access" });
              toast("Concept filed on the ballot and ledger.");
            }}
          >
            File to ballot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function CheckinView() {
  const siteId = useMilo((s) => s.siteId);
  const visit = useMilo((s) => s.visit);
  const reportAccess = useMilo((s) => s.reportAccess);
  const startWalk = useMilo((s) => s.startWalk);
  const tickWalk = useMilo((s) => s.tickWalk);
  const finishWalk = useMilo((s) => s.finishWalk);
  const cancelWalk = useMilo((s) => s.cancelWalk);
  const walkActive = useMilo((s) => s.walkActive);
  const walkProgress = useMilo((s) => s.walkProgress);
  const [note, setNote] = useState("");
  const [geo, setGeo] = useState<"idle" | "looking" | "on" | "off" | "denied">("idle");
  const site = siteById(siteId);

  useEffect(() => {
    if (!walkActive) return;
    let last = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      tickWalk(dt / 12);
      if (useMilo.getState().walkProgress >= 1) {
        finishWalk();
        toast("Loop complete. +12 PawSteps.");
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [walkActive, tickWalk, finishWalk]);

  function locate() {
    if (!navigator.geolocation) {
      setGeo("denied");
      toast("Location is not available on this device. You can still check in.");
      return;
    }
    setGeo("looking");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const m = haversineM(pos.coords.latitude, pos.coords.longitude, site.lat, site.lng);
        if (m <= site.radiusM) {
          setGeo("on");
          toast(visit(true).message);
        } else {
          setGeo("off");
          toast(`About ${Math.round(m)} m from ${site.name}. Check in still works.`);
        }
      },
      () => {
        setGeo("denied");
        toast("Location blocked. Check in without the on-site bonus.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-medium tracking-tight">Check in</h1>
        <p className="text-muted">Show up at {site.name}, walk the loop, or file a barrier.</p>
      </header>
      <ParkMap siteId={siteId} />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-4" />
            Park visit
          </CardTitle>
          <CardDescription>
            Eight {PRODUCT.token}, plus four if the phone is on site. One credit every four hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => toast(visit(geo === "on").message)}>
            Check in here
          </Button>
          <Button variant="secondary" className="w-full" onClick={locate} disabled={geo === "looking"}>
            {geo === "looking" ? "Reading location…" : "Confirm I am on site"}
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Footprints className="size-4" />
            Loop walk
          </CardTitle>
          <CardDescription>Twelve {PRODUCT.token} and 18 health minutes when the loop closes.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {walkActive ? (
            <>
              <Progress value={walkProgress * 100} />
              <p className="text-xs tabular-nums text-subtle">{Math.round(walkProgress * 100)}% around</p>
              <Button variant="secondary" onClick={cancelWalk}>
                Stop walk
              </Button>
            </>
          ) : (
            <Button onClick={startWalk} className="w-full">
              Start loop
            </Button>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="size-4" />
            Access report
          </CardTitle>
          <CardDescription>Lighting, ruts, gates, seating. First report is 15 {PRODUCT.token}.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Uneven ground at the east gate after rain"
          />
          <Button
            className="w-full"
            onClick={() => {
              const r = reportAccess(note);
              toast(r.message);
              if (r.ok) setNote("");
            }}
          >
            File report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

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
          Grey cards are prospects. Color cards are true sponsors only after an admin marks them
          paid and active. Neighbors do not pay to vote or check in.
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
            recorded by admin.
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

export function LedgerView() {
  const events = useMilo((s) => s.events);
  const custom = useMilo((s) => s.customProposals);
  const handle = useMilo((s) => s.handle);
  const exportBundle = useMilo((s) => s.exportBundle);
  const resetDemo = useMilo((s) => s.resetDemo);
  const setHandle = useMilo((s) => s.setHandle);
  const [name, setName] = useState(handle);

  function download() {
    const blob = new Blob([exportBundle()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "milomaps-civic-v1.json";
    a.click();
    URL.revokeObjectURL(url);
    toast("Ledger exported.");
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-medium tracking-tight">Concept ledger</h1>
        <p className="text-muted">
          Timestamped under {PRODUCT.brand}. Export uses {PRODUCT.schema} for merge into Amber Trails.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-4" />
            Attribution
          </CardTitle>
          <CardDescription>
            Owner: {PRODUCT.brand}. Home: {PRODUCT.canonical}. Parent: {PRODUCT.parentUrl}. Payments:{" "}
            {PRODUCT.payments}.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <label className="text-sm text-muted" htmlFor="handle">
            Display name on notes
          </label>
          <div className="flex gap-2">
            <input
              id="handle"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 flex-1 rounded-md border border-border bg-bg px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Button
              variant="secondary"
              onClick={() => {
                setHandle(name);
                toast("Name saved on this device.");
              }}
            >
              Save
            </Button>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={download}>
              Export merge JSON
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                resetDemo();
                toast("Demo data reset.");
              }}
            >
              Reset demo
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3">
        {custom.map((c) => (
          <Card key={c.id} className="rounded-lg">
            <CardContent className="flex flex-col gap-2 p-4">
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-muted">{c.summary}</p>
              <p className="text-xs text-subtle">
                {PRODUCT.brand} · {siteById(c.siteId).name}
              </p>
            </CardContent>
          </Card>
        ))}
        {CONCEPT_LEDGER.map((c) => (
          <Card key={c.id} className="rounded-lg">
            <CardContent className="flex flex-col gap-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="muted">{c.status}</Badge>
                <time className="font-mono text-xs text-subtle" dateTime={c.filed}>
                  {formatWhen(c.filed)}
                </time>
              </div>
              <p className="font-medium">{c.title}</p>
              <p className="text-sm text-muted">{c.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {events.length > 0 ? (
        <section className="flex flex-col gap-2">
          <h2 className="font-display text-lg">Activity on this device</h2>
          <ul className="flex flex-col gap-2">
            {events.map((e) => (
              <li key={e.id} className="flex items-baseline justify-between gap-3 border-b border-border py-2 text-sm">
                <span>{e.label}</span>
                <span className="tabular-nums text-subtle">
                  {e.tokens > 0 ? `+${e.tokens}` : e.tokens < 0 ? e.tokens : "—"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <p className="flex items-center gap-2 text-xs text-subtle">
        <Landmark className="size-3.5" />
        Schema {PRODUCT.schema}. Merge target {PRODUCT.parentUrl}.
      </p>
    </div>
  );
}
