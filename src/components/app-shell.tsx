import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Footprints, Info, Landmark, MapPinned, Vote } from "lucide-react";
import { ParkView, VoteView, CheckinView, FundView, LedgerView } from "@/components/views";
import { Button } from "@/components/ui/button";
import { SITES, siteById } from "@/lib/data";
import { FAMILY, PRODUCT } from "@/lib/product";
import { useMilo, type TabId } from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS: { id: TabId; label: string; icon: typeof MapPinned }[] = [
  { id: "park", label: "Park", icon: MapPinned },
  { id: "vote", label: "Vote", icon: Vote },
  { id: "checkin", label: "Check in", icon: Footprints },
  { id: "fund", label: "Fund", icon: Landmark },
  { id: "ledger", label: "Ledger", icon: ClipboardList },
];

export function AppShell() {
  const tab = useMilo((s) => s.tab);
  const setTab = useMilo((s) => s.setTab);
  const tokens = useMilo((s) => s.tokens);
  const handle = useMilo((s) => s.handle);
  const siteId = useMilo((s) => s.siteId);
  const setSite = useMilo((s) => s.setSite);
  const onboarded = useMilo((s) => s.onboarded);
  const completeOnboard = useMilo((s) => s.completeOnboard);
  const [notice, setNotice] = useState<string | null>(null);
  const [name, setName] = useState("Neighbor");
  const [step, setStep] = useState(0);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    void useMilo.persist.rehydrate();
  }, []);

  useEffect(() => {
    const onToast = (e: Event) => setNotice((e as CustomEvent<string>).detail);
    window.addEventListener("milo-toast", onToast);
    return () => window.removeEventListener("milo-toast", onToast);
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 2800);
    return () => window.clearTimeout(t);
  }, [notice]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-bg">
      <div className="bg-primary px-4 py-1.5 text-center text-xs text-primary-fg">
        parks.milomaps.com · a {PRODUCT.brand} module · same family as {PRODUCT.parentProduct}
      </div>
      <header className="sticky top-0 z-20 border-b border-border bg-bg/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-medium tracking-tight">{PRODUCT.brand}</p>
            <p className="text-xs text-subtle">
              {PRODUCT.moduleName} · {handle}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/about"
              aria-label="About and family"
              className="flex size-11 items-center justify-center rounded-md border border-border bg-surface text-fg"
            >
              <Info className="size-4" />
            </Link>
            <div className="rounded-md border border-border bg-surface px-3 py-1.5 text-right">
              <p className="text-xs uppercase tracking-wide text-subtle">{PRODUCT.token}</p>
              <p className="font-display text-lg leading-none tabular-nums">{tokens}</p>
            </div>
          </div>
        </div>
        <nav className="mt-3 flex gap-3 overflow-x-auto text-xs" aria-label="Milo Maps family">
          {FAMILY.map((f) =>
            f.here ? (
              <span key={f.href} className="shrink-0 font-medium text-primary">
                {f.label}
              </span>
            ) : (
              <a key={f.href} href={f.href} className="shrink-0 text-muted underline-offset-2 hover:underline">
                {f.label}
              </a>
            ),
          )}
        </nav>
      </header>
      <div className="flex gap-2 overflow-x-auto border-b border-border px-4 py-2">
        {SITES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSite(s.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium",
              s.id === siteId ? "bg-primary text-primary-fg" : "border border-border text-muted",
            )}
          >
            {s.id === "kelso" ? "Kelso" : s.city}
          </button>
        ))}
      </div>

      <main className="flex-1 px-4 py-6 pb-28">
        {tab === "park" ? <ParkView /> : null}
        {tab === "vote" ? <VoteView /> : null}
        {tab === "checkin" ? <CheckinView /> : null}
        {tab === "fund" ? <FundView /> : null}
        {tab === "ledger" ? <LedgerView /> : null}
      </main>

      {notice ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-30 w-[min(92vw,28rem)] -translate-x-1/2 rounded-lg border border-border bg-primary px-4 py-3 text-sm text-primary-fg shadow-soft"
        >
          {notice}
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm"
        aria-label="Primary"
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-xs font-medium",
                  active ? "text-primary" : "text-subtle",
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                {t.label}
              </button>
            );
          })}
        </div>
      </nav>

      {!onboarded ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-fg/40 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 text-fg shadow-soft">
            {step === 0 ? (
              <>
                <p className="text-xs text-subtle">parks.milomaps.com · {PRODUCT.brand}</p>
                <p className="mt-1 font-display text-2xl font-medium tracking-tight">Vote the park you walk</p>
                <p className="mt-2 text-sm text-muted">
                  Civic Parks is a {PRODUCT.brand} module — same family as {PRODUCT.parentProduct}. PawSteps,
                  parks, and a public split. Cards are not charged on this beta.
                </p>
                <Button className="mt-5 w-full" onClick={() => setStep(1)}>
                  Continue
                </Button>
              </>
            ) : null}
            {step === 1 ? (
              <>
                <p className="font-display text-2xl font-medium tracking-tight">How it works</p>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-muted">
                  <li>Show up, walk, or file a barrier. That mints {PRODUCT.token}.</li>
                  <li>Spend them on lighting, access, seating, winter routes.</li>
                  <li>Shops can fund later. Neighbors never pay. Split is 80 / 15 / 5.</li>
                </ul>
                <Button className="mt-5 w-full" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </>
            ) : null}
            {step === 2 ? (
              <>
                <p className="font-display text-2xl font-medium tracking-tight">Before you enter</p>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-4 h-11 w-full rounded-md border border-border bg-bg px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Display name"
                  aria-label="Display name"
                />
                <label className="mt-4 flex items-start gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    className="mt-1 size-4 accent-primary"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span>
                    I am 13 or older. I agree to the{" "}
                    <Link to="/terms" className="text-fg underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-fg underline">
                      Privacy
                    </Link>
                    . Activity stays on this device. This is not a city app. No card is charged.
                  </span>
                </label>
                <Button className="mt-5 w-full" disabled={!agreed} onClick={() => completeOnboard(name)}>
                  Enter {siteById("kaukauna").city}
                </Button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
