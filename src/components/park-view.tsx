import { Sun, Trees } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkMap } from "@/components/park-map";
import { DecisionStepsSection, NeighborBoardSection } from "@/components/neighbor-sections";
import { CHALLENGES, siteById } from "@/lib/data";
import { PRODUCT } from "@/lib/product";
import { useMilo } from "@/lib/store";
import { Link } from "@tanstack/react-router";

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

      <NeighborBoardSection />
      <DecisionStepsSection onOpenBallot={() => setTab("vote")} />

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
