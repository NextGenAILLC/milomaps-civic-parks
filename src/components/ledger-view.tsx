import { useState } from "react";
import { Landmark, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CONCEPT_LEDGER, siteById } from "@/lib/data";
import { PRODUCT } from "@/lib/product";
import { useMilo } from "@/lib/store";
import { toast } from "@/lib/toast";
import { formatWhen } from "@/lib/utils";

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
