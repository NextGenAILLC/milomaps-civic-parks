import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProposalBallotContext } from "@/components/neighbor-sections";
import { TAGS, siteById } from "@/lib/data";
import { PRODUCT } from "@/lib/product";
import { allProposals, useMilo } from "@/lib/store";
import { toast } from "@/lib/toast";
import { formatUsd, formatWhen } from "@/lib/utils";
import { activeSponsorTotal, fundedFor, statusLabel, usePublicSponsors, votesFor } from "./views-shared";

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
                <ProposalBallotContext proposalId={p.id} />
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
