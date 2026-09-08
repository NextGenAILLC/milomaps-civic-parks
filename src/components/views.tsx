import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Accessibility, Footprints, Landmark, MapPin, Shield, Sun, Trees, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ParkMap } from "@/components/park-map";
import {
  CHALLENGES,
  CONCEPT_LEDGER,
  PACKAGES,
  SPONSORS,
  TAGS,
  haversineM,
  siteById,
  type Proposal,
} from "@/lib/data";
import { GIFT_POST, PRODUCT, PUBLIC_SPLIT } from "@/lib/product";
import { allProposals, useMilo } from "@/lib/store";
import { toast } from "@/lib/toast";
import { formatUsd, formatWhen } from "@/lib/utils";

function votesFor(p: Proposal, extra: number) {
  return p.voteSeed + extra;
}
function fundedFor(p: Proposal, extraPledge: number, siteCost: number) {
  const share = siteCost > 0 ? extraPledge * (p.cost / siteCost) : 0;
  return Math.min(p.cost, p.sponsorSeed + share);
}
function statusLabel(funded: number, cost: number) {
  const pct = funded / cost;
  if (pct >= 1) return "Funded";
  if (pct >= 0.6) return "Ready to build";
  return "On ballot";
}

function copyGift() {
  void navigator.clipboard.writeText(GIFT_POST).then(
    () => toast("Gift post copied. Paste it into the group as-is."),
    () => toast("Copy failed. The text is on the Fund tab."),
  );
}

function SplitCard() {
  const rows = [
    { pct: PUBLIC_SPLIT.park, label: PUBLIC_SPLIT.parkLabel },
    { pct: PUBLIC_SPLIT.operate, label: PUBLIC_SPLIT.operateLabel },
    { pct: PUBLIC_SPLIT.steward, label: PUBLIC_SPLIT.stewardLabel },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Where a sponsor dollar goes</CardTitle>
        <CardDescription>Neighbors pay nothing. This is the whole split — not a footnote.</CardDescription>
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

function GiftCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift this to Kaukauna</CardTitle>
        <CardDescription>
          Share {PRODUCT.canonical} — a Milo Maps address, not a throwaway link.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <pre className="whitespace-pre-wrap rounded-md border border-border bg-bg p-3 text-sm text-muted">
          {GIFT_POST}
        </pre>
        <Button className="w-full" onClick={copyGift}>
          Copy gift post
        </Button>
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

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="font-display text-3xl font-medium tracking-tight text-fg sm:text-4xl">{site.name}</h1>
        <p className="max-w-xl text-muted">{site.blurb}</p>
        <p className="text-sm text-subtle">
          {site.address} · {site.hours}
        </p>
      </header>
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
        {PRODUCT.canonical} · not a city app · neighbors $0 · Stripe off · split 80 / 15 / 5.{" "}
        <Link to="/about" className="underline">
          About
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
  const extraPledge = useMilo((s) => s.extraPledge[siteId]);
  const vote = useMilo((s) => s.vote);
  const addProposal = useMilo((s) => s.addProposal);
  const addComment = useMilo((s) => s.addComment);
  const comments = useMilo((s) => s.comments);
  const custom = useMilo((s) => s.customProposals);
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

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-medium tracking-tight">Ballot</h1>
        <p className="text-muted">
          Spend {PRODUCT.token} earned on site. Highest-voted work is what sponsors fund next at{" "}
          {siteById(siteId).name}.
        </p>
        <p className="text-sm tabular-nums text-subtle">Balance {tokens}</p>
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
          const funded = fundedFor(p, extraPledge, siteCost);
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
                    <span>Funded {Math.round((funded / p.cost) * 100)}%</span>
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
  const seed = SPONSORS.filter((s) => s.siteId === siteId).reduce((s, x) => s + x.pledged, 0);
  const raised = seed + extraPledge;
  const localSponsors = SPONSORS.filter((s) => s.siteId === siteId);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-medium tracking-tight">Sponsors</h1>
        <p className="text-muted">
          The park stays free. Money follows the ballot. Stripe is not connected. Nobody’s card is charged.
        </p>
      </header>
      <Card className="border-primary">
        <CardHeader>
          <CardTitle>Money, plainly</CardTitle>
          <CardDescription>So nobody in Kaukauna has to guess.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted">
          <p>
            <span className="font-medium text-fg">Today:</span> this is a public ballot. Packages
            record intent on this device. Sample pledges are labeled as samples. No Stripe. No
            checkout. No fine print.
          </p>
          <p>
            <span className="font-medium text-fg">When Stripe is live:</span> only local businesses
            pay. The same 80 / 15 / 5 split hits every real dollar, on this page.
          </p>
        </CardContent>
      </Card>
      <SplitCard />
      <GiftCard />
      <Card>
        <CardContent className="p-5">
          <p className="text-xs text-muted">Intent toward {siteById(siteId).name} (not charged)</p>
          <p className="font-display text-3xl tabular-nums">{formatUsd(raised)}</p>
          <p className="mt-1 text-sm text-subtle">of {formatUsd(totalNeed)} listed work</p>
          <Progress className="mt-4" value={totalNeed ? (raised / totalNeed) * 100 : 0} />
        </CardContent>
      </Card>
      <div className="flex flex-col gap-3">
        {localSponsors.map((s) => (
          <Card key={s.id} className="rounded-lg">
            <CardContent className="flex items-start justify-between gap-3 p-4">
              <div>
                <p className="font-medium">{s.name}</p>
                <p className="text-sm text-muted">{s.note}</p>
                <p className="mt-1 text-xs text-subtle">{s.kind}</p>
              </div>
              <p className="tabular-nums text-sm">{formatUsd(s.pledged)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-4" />
            Record a package intent
          </CardTitle>
          <CardDescription>Not a purchase. Stripe is off. This stays on this phone.</CardDescription>
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
