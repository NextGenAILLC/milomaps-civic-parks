import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Eye, LockKeyhole, Save, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAdminDashboard,
  saveSponsor,
  type AdminDashboard,
  type PublicSponsor,
  type SponsorUpdateInput,
} from "@/lib/civic";
import {
  SPONSOR_CATEGORY_LABELS,
  siteById,
  type SiteId,
  type SponsorCategory,
  type SponsorStatus,
} from "@/lib/data";
import { PRODUCT } from "@/lib/product";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/admin")({ component: AdminRoute });

type SponsorDraft = Omit<SponsorUpdateInput, "password">;

const inputClass =
  "h-11 rounded-md border border-border bg-bg px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";
const areaClass =
  "min-h-24 resize-y rounded-md border border-border bg-bg px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function isTrueSponsor(sponsor: Pick<PublicSponsor, "status" | "paid">) {
  return sponsor.status === "active" && sponsor.paid;
}

function draftFromSponsor(sponsor: PublicSponsor): SponsorDraft {
  return {
    id: sponsor.id,
    name: sponsor.name,
    category: sponsor.category,
    status: sponsor.status,
    pledged: sponsor.pledged,
    paid: sponsor.paid,
    isCustodian: sponsor.isCustodian,
    note: sponsor.note,
    website: sponsor.website,
    showcaseTitle: sponsor.showcaseTitle ?? "",
    showcaseBody: sponsor.showcaseBody ?? "",
  };
}

function AdminRoute() {
  const [passwordInput, setPasswordInput] = useState("");
  const [password, setPassword] = useState("");
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [drafts, setDrafts] = useState<Record<string, SponsorDraft>>({});
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dashboard) return;
    setDrafts(Object.fromEntries(dashboard.sponsors.map((sponsor) => [sponsor.id, draftFromSponsor(sponsor)])));
  }, [dashboard]);

  const counts = useMemo(() => {
    const checkins = dashboard?.activity.filter((row) => row.kind === "checkin").length ?? 0;
    const votes = dashboard?.activity.filter((row) => row.kind === "vote").length ?? 0;
    const trueSponsors = dashboard?.sponsors.filter(isTrueSponsor).length ?? 0;
    return { checkins, votes, trueSponsors };
  }, [dashboard]);

  async function load(nextPassword: string) {
    setError(null);
    setLoading(true);
    try {
      const next = await getAdminDashboard({ data: { password: nextPassword } });
      setPassword(nextPassword);
      setDashboard(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Admin request failed.");
    } finally {
      setLoading(false);
    }
  }

  async function persistSponsor(id: string, patch: Partial<SponsorDraft> = {}) {
    const draft = drafts[id];
    if (!draft || !password) return;
    const nextDraft = { ...draft, ...patch };
    setSavingId(id);
    setError(null);
    try {
      const next = await saveSponsor({ data: { ...nextDraft, password } });
      setDashboard(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sponsor save failed.");
    } finally {
      setSavingId(null);
    }
  }

  function updateDraft(id: string, patch: Partial<SponsorDraft>) {
    setDrafts((current) => ({ ...current, [id]: { ...current[id], ...patch } }));
  }

  if (!dashboard) {
    return (
      <main className="mx-auto min-h-dvh max-w-lg bg-bg px-4 py-8 text-fg">
        <p className="text-xs text-subtle">{PRODUCT.brand} · operator admin</p>
        <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">Admin</h1>
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LockKeyhole className="size-5 text-primary" />
              Password required
            </CardTitle>
            <CardDescription>
              Uses server-side ADMIN_PASSWORD. No public operator phone, email, or name is exposed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void load(passwordInput);
              }}
            >
              <input
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                className={inputClass}
                placeholder="ADMIN_PASSWORD"
                aria-label="Admin password"
              />
              <Button disabled={loading || !passwordInput.trim()}>{loading ? "Checking..." : "Enter admin"}</Button>
              {error ? <p className="text-sm text-muted">{error}</p> : null}
            </form>
          </CardContent>
        </Card>
        <Link to="/" className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg">
          Back to Civic Parks
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-4xl bg-bg px-4 py-8 text-fg">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-subtle">{PRODUCT.brand} · operator admin</p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight">Admin</h1>
          <p className="mt-1 text-sm text-muted">
            Monitor synced activity, vote tallies, and sponsor status without publishing operator PII.
          </p>
        </div>
        <Button variant="secondary" onClick={() => void load(password)} disabled={loading}>
          Refresh
        </Button>
      </div>

      {error ? <p className="mt-4 rounded-md border border-border bg-surface p-3 text-sm text-muted">{error}</p> : null}

      <section className="mt-6 grid gap-3 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted">Participants</p>
            <p className="font-display text-2xl tabular-nums">{dashboard.participants.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted">Check-ins</p>
            <p className="font-display text-2xl tabular-nums">{counts.checkins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted">Synced votes</p>
            <p className="font-display text-2xl tabular-nums">{counts.votes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted">True sponsors</p>
            <p className="font-display text-2xl tabular-nums">{counts.trueSponsors}</p>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-2xl font-medium tracking-tight">Sponsors</h2>
        <p className="mt-1 text-sm text-muted">
          Active public color requires both paid and active. Custodian marks the transparent
          bank/CU/shelter money path.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {dashboard.sponsors.map((sponsor) => {
            const draft = drafts[sponsor.id] ?? draftFromSponsor(sponsor);
            const trueSponsor = draft.status === "active" && draft.paid;
            return (
              <Card key={sponsor.id} className={trueSponsor ? "border-primary" : "bg-surface-2/60 shadow-none"}>
                <CardHeader>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={trueSponsor ? "default" : "muted"}>
                      {trueSponsor ? "True sponsor" : "Prospect"}
                    </Badge>
                    <Badge variant="outline">{siteById(sponsor.siteId).name}</Badge>
                  </div>
                  <CardTitle>{sponsor.name}</CardTitle>
                  <CardDescription>Updated {formatWhen(sponsor.updatedAt)}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <input
                    value={draft.name}
                    onChange={(event) => updateDraft(sponsor.id, { name: event.target.value })}
                    className={inputClass}
                    aria-label={`${sponsor.name} name`}
                  />
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      value={draft.category}
                      onChange={(event) =>
                        updateDraft(sponsor.id, { category: event.target.value as SponsorCategory })
                      }
                      className={inputClass}
                      aria-label={`${sponsor.name} category`}
                    >
                      {Object.entries(SPONSOR_CATEGORY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={0}
                      value={draft.pledged}
                      onChange={(event) => updateDraft(sponsor.id, { pledged: Number(event.target.value) || 0 })}
                      className={inputClass}
                      aria-label={`${sponsor.name} recorded support`}
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    <label className="flex items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.paid}
                        onChange={(event) => updateDraft(sponsor.id, { paid: event.target.checked })}
                      />
                      Paid
                    </label>
                    <select
                      value={draft.status}
                      onChange={(event) =>
                        updateDraft(sponsor.id, { status: event.target.value as SponsorStatus })
                      }
                      className={inputClass}
                      aria-label={`${sponsor.name} status`}
                    >
                      <option value="prospect">Prospect</option>
                      <option value="active">Active</option>
                    </select>
                    <label className="flex items-center gap-2 rounded-md border border-border bg-bg px-3 py-2 text-sm">
                      <input
                        type="checkbox"
                        checked={draft.isCustodian}
                        onChange={(event) => updateDraft(sponsor.id, { isCustodian: event.target.checked })}
                      />
                      Custodian
                    </label>
                  </div>
                  <input
                    value={draft.website ?? ""}
                    onChange={(event) => updateDraft(sponsor.id, { website: event.target.value })}
                    className={inputClass}
                    placeholder="https://..."
                    aria-label={`${sponsor.name} website`}
                  />
                  <textarea
                    value={draft.note}
                    onChange={(event) => updateDraft(sponsor.id, { note: event.target.value })}
                    className={areaClass}
                    aria-label={`${sponsor.name} note`}
                  />
                  <input
                    value={draft.showcaseTitle}
                    onChange={(event) => updateDraft(sponsor.id, { showcaseTitle: event.target.value })}
                    className={inputClass}
                    placeholder="Showcase headline"
                    aria-label={`${sponsor.name} showcase title`}
                  />
                  <textarea
                    value={draft.showcaseBody}
                    onChange={(event) => updateDraft(sponsor.id, { showcaseBody: event.target.value })}
                    className={areaClass}
                    aria-label={`${sponsor.name} showcase body`}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => void persistSponsor(sponsor.id)} disabled={savingId === sponsor.id}>
                      <Save className="size-4" />
                      {savingId === sponsor.id ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => void persistSponsor(sponsor.id, { status: "active", paid: true })}
                      disabled={savingId === sponsor.id}
                    >
                      <ShieldCheck className="size-4" />
                      Mark true sponsor
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => void persistSponsor(sponsor.id, { status: "prospect", paid: false })}
                      disabled={savingId === sponsor.id}
                    >
                      Back to prospect
                    </Button>
                    {isTrueSponsor(sponsor) ? (
                      <Link
                        to="/sponsors/$sponsorId"
                        params={{ sponsorId: sponsor.id }}
                        className="inline-flex h-11 items-center gap-2 rounded-md border border-border bg-surface px-4 text-sm font-medium text-fg"
                      >
                        <Eye className="size-4" />
                        View showcase
                      </Link>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Vote tallies</CardTitle>
            <CardDescription>Seed votes plus synced public votes from the app.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {dashboard.voteTallies.map((row) => (
                <li key={row.proposalId} className="border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{row.proposalTitle}</p>
                      <p className="text-xs text-subtle">{siteById(row.siteId as SiteId).name}</p>
                    </div>
                    <p className="tabular-nums">{row.totalVotes.toLocaleString()}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    Seed {row.seedVotes.toLocaleString()} · synced {row.communityVotes.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Participants</CardTitle>
            <CardDescription>Display handles from synced browser activity.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {dashboard.participants.length === 0 ? (
                <li className="text-sm text-muted">No synced participants yet.</li>
              ) : (
                dashboard.participants.map((row) => (
                  <li key={row.participantHandle} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-medium">{row.participantHandle}</p>
                      <p className="text-sm tabular-nums">{row.events} events</p>
                    </div>
                    <p className="text-xs text-muted">
                      {row.checkins} check-ins · {row.votes} votes · last {formatWhen(row.lastSeenAt)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Check-ins, voters, reports, comments, concepts, and package intent.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {dashboard.activity.length === 0 ? (
                <li className="text-sm text-muted">No synced activity yet.</li>
              ) : (
                dashboard.activity.map((row) => (
                  <li key={row.id} className="border-b border-border pb-3 last:border-0 last:pb-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline">{row.kind.replace("_", " ")}</Badge>
                      <span className="text-sm font-medium">
                        {row.participantHandle ?? "Neighbor"} · {siteById(row.siteId as SiteId).name}
                      </span>
                      {row.amount ? <span className="text-xs text-subtle">amount {row.amount}</span> : null}
                    </div>
                    {row.proposalTitle ? <p className="mt-1 text-sm text-muted">{row.proposalTitle}</p> : null}
                    {row.note ? <p className="mt-1 text-sm text-muted">{row.note}</p> : null}
                    <p className="mt-1 text-xs text-subtle">{formatWhen(row.createdAt)}</p>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link to="/" className="underline">
          Public app
        </Link>
        <Link to="/transparency" className="underline">
          Transparency
        </Link>
      </div>
    </main>
  );
}
