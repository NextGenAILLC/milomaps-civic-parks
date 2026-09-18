import { useEffect, useState } from "react";
import { ExternalLink, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DOMAIN_LAUNCH, PRODUCT } from "@/lib/product";
import { toast } from "@/lib/toast";

export function useOnParksName() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    setOn(window.location.hostname.replace(/^www\./, "") === DOMAIN_LAUNCH.canonicalHost);
  }, []);
  return on;
}

function copyText(text: string, ok: string) {
  void navigator.clipboard.writeText(text).then(
    () => toast(ok),
    () => toast("Copy failed. Select the text instead."),
  );
}

function CopyRow({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-t border-border py-3 first:border-0 first:pt-0">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-subtle">{label}</p>
        <p className="mt-0.5 break-all font-mono text-sm text-fg">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
      </div>
      <Button
        size="sm"
        variant="secondary"
        className="shrink-0"
        onClick={() => copyText(value, `${label} copied.`)}
      >
        Copy
      </Button>
    </div>
  );
}

export function LaunchNameCard() {
  const onName = useOnParksName();
  const s0 = DOMAIN_LAUNCH.stepPublic;
  const s1 = DOMAIN_LAUNCH.step1;
  const s2 = DOMAIN_LAUNCH.step2;

  if (onName) {
    return (
      <Card className="border-primary text-fg">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge>Live</Badge>
            <span className="text-xs text-subtle">{PRODUCT.canonical}</span>
          </div>
          <CardTitle>The name is attached</CardTitle>
          <CardDescription>{DOMAIN_LAUNCH.statusAttached}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted">
          <p>
            Copy the gift post and share it. Neighbors land here. Stripe stays off. Split stays 80 /
            15 / 5.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary text-fg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge>Launching now</Badge>
          <span className="text-xs text-subtle">Three edits. Nothing else.</span>
        </div>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="size-4" />
          Attach parks.milomaps.com
        </CardTitle>
        <CardDescription>{DOMAIN_LAUNCH.statusUntilAttached}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div>
          <p className="text-xs uppercase tracking-wide text-subtle">Civic Parks is already here</p>
          <CopyRow label="Live now" value={PRODUCT.liveNow} />
          <CopyRow label="Public name" value={DOMAIN_LAUNCH.canonicalHost} />
        </div>

        <section className="rounded-md border border-border bg-bg p-4">
          <p className="font-display text-lg font-medium">
            {s0.n}. {s0.title}
          </p>
          <p className="mt-1 text-sm text-muted">{s0.where}</p>
          <p className="mt-2 text-sm text-muted">{s0.why}</p>
          <Button
            className="mt-3 w-full"
            onClick={() => window.open(s0.href, "_blank", "noopener,noreferrer")}
          >
            Open visitor access — set Public
            <ExternalLink className="size-4" />
          </Button>
        </section>

        <section className="rounded-md border border-border bg-bg p-4">
          <p className="font-display text-lg font-medium">
            {s1.n}. {s1.title}
          </p>
          <p className="mt-1 text-sm text-muted">{s1.where}</p>
          <div className="mt-3">
            <CopyRow label="Type" value={s1.type} />
            <CopyRow label="Name" value={s1.name} />
            <CopyRow label="Target" value={s1.target} />
            <CopyRow label="Proxy" value={s1.proxy} hint={s1.proxyHow} />
          </div>
        </section>

        <section className="rounded-md border border-border bg-bg p-4">
          <p className="font-display text-lg font-medium">
            {s2.n}. {s2.title}
          </p>
          <p className="mt-1 text-sm text-muted">{s2.where}</p>
          <div className="mt-3">
            <CopyRow label="Add domain" value={s2.domain} />
            <CopyRow label="If asked, TXT name" value={s2.txtName} hint={s2.txtHint} />
          </div>
          <Button
            className="mt-3 w-full"
            onClick={() => window.open(s2.href, "_blank", "noopener,noreferrer")}
          >
            Open Netlify domain management
            <ExternalLink className="size-4" />
          </Button>
        </section>

        <section>
          <p className="font-medium">Leave these alone</p>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
            {DOMAIN_LAUNCH.leaveAlone.map((row) => (
              <li key={row.name}>
                <span className="font-medium text-fg">{row.name}.</span> {row.reason}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <p className="font-medium">Do not</p>
          <ul className="mt-2 flex flex-col gap-2 text-sm text-muted">
            {DOMAIN_LAUNCH.doNot.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
