import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CHALLENGES, PROPOSALS, type Proposal, type SiteId } from "@/lib/data";
import { PRODUCT } from "@/lib/product";

export type TabId = "park" | "vote" | "checkin" | "fund" | "ledger";
export type EventRow = { id: string; at: string; label: string; tokens: number };
export type CommentRow = { id: string; proposalId: string; text: string; at: string; author: string };

type State = {
  tab: TabId;
  siteId: SiteId;
  handle: string;
  onboarded: boolean;
  nightMode: boolean;
  tokens: number;
  visits: number;
  walkMinutes: number;
  loops: number;
  votes: Record<string, number>;
  lastVisitAt: number | null;
  lastAccessAt: number | null;
  lastVisitDay: string | null;
  streak: number;
  reports: number;
  extraPledge: Record<SiteId, number>;
  events: EventRow[];
  customProposals: Proposal[];
  comments: CommentRow[];
  challenges: Record<string, boolean>;
  walkActive: boolean;
  walkProgress: number;
  setTab: (tab: TabId) => void;
  setSite: (id: SiteId) => void;
  setHandle: (handle: string) => void;
  completeOnboard: (handle: string) => void;
  toggleNight: () => void;
  visit: (onSite: boolean) => { ok: boolean; message: string };
  reportAccess: (note: string) => { ok: boolean; message: string };
  startWalk: () => void;
  tickWalk: (delta: number) => void;
  finishWalk: () => void;
  cancelWalk: () => void;
  vote: (id: string, amount: number) => { ok: boolean; message: string };
  pledge: (amount: number) => void;
  addProposal: (draft: Omit<Proposal, "id" | "custom" | "voteSeed" | "sponsorSeed">) => void;
  addComment: (proposalId: string, text: string) => void;
  exportBundle: () => string;
  resetDemo: () => void;
};

function nid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
function pushEvent(events: EventRow[], label: string, tokens: number): EventRow[] {
  return [{ id: nid(), at: new Date().toISOString(), label, tokens }, ...events].slice(0, 40);
}
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
const FOUR_HOURS = 4 * 60 * 60 * 1000;

function grant(s: Pick<State, "challenges" | "tokens" | "events">, id: string): Partial<State> {
  if (s.challenges[id]) return {};
  const ch = CHALLENGES.find((c) => c.id === id);
  if (!ch) return {};
  return {
    challenges: { ...s.challenges, [id]: true },
    tokens: s.tokens + ch.reward,
    events: pushEvent(s.events, `Challenge: ${ch.title}`, ch.reward),
  };
}

const emptyVotes = Object.fromEntries(PROPOSALS.map((p) => [p.id, 0])) as Record<string, number>;

const initial = {
  tab: "park" as TabId,
  siteId: "kaukauna" as SiteId,
  handle: "Neighbor",
  onboarded: false,
  nightMode: false,
  tokens: 20,
  visits: 0,
  walkMinutes: 0,
  loops: 0,
  votes: { ...emptyVotes },
  lastVisitAt: null as number | null,
  lastAccessAt: null as number | null,
  lastVisitDay: null as string | null,
  streak: 0,
  reports: 0,
  extraPledge: { kaukauna: 0, brewster: 0, kelso: 0 } as Record<SiteId, number>,
  events: [] as EventRow[],
  customProposals: [] as Proposal[],
  comments: [] as CommentRow[],
  challenges: {} as Record<string, boolean>,
  walkActive: false,
  walkProgress: 0,
};

export const useMilo = create<State>()(
  persist(
    (set, get) => ({
      ...initial,
      setTab: (tab) => set({ tab }),
      setSite: (siteId) => set({ siteId, walkActive: false, walkProgress: 0 }),
      setHandle: (handle) => set({ handle: handle.trim() || "Neighbor" }),
      completeOnboard: (handle) => set({ onboarded: true, handle: handle.trim() || "Neighbor" }),
      toggleNight: () => set((s) => ({ nightMode: !s.nightMode })),
      visit: (onSite) => {
        const now = Date.now();
        const last = get().lastVisitAt;
        if (last && now - last < FOUR_HOURS) {
          const hrs = Math.ceil((FOUR_HOURS - (now - last)) / 3600000);
          return { ok: false, message: `Visit credit resets in about ${hrs} hour${hrs === 1 ? "" : "s"}.` };
        }
        const gain = 8 + (onSite ? 4 : 0);
        const day = todayKey();
        set((s) => {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yKey = yesterday.toISOString().slice(0, 10);
          const streak =
            s.lastVisitDay === day ? s.streak : s.lastVisitDay === yKey ? s.streak + 1 : 1;
          const next = {
            tokens: s.tokens + gain,
            visits: s.visits + 1,
            lastVisitAt: now,
            lastVisitDay: day,
            streak,
            events: pushEvent(s.events, onSite ? "On-site check-in" : "Park visit check-in", gain),
          };
          return { ...next, ...grant({ ...s, ...next }, "first-visit") };
        });
        return {
          ok: true,
          message: onSite
            ? `On site. +${gain} ${PRODUCT.token} (includes location bonus).`
            : `Checked in. +${gain} ${PRODUCT.token}.`,
        };
      },
      reportAccess: (note) => {
        const now = Date.now();
        const last = get().lastAccessAt;
        if (last && now - last < FOUR_HOURS) {
          return { ok: false, message: "Access reports are limited to one every four hours." };
        }
        const gain = get().reports === 0 ? 15 : 8;
        const label = note.trim() ? `Access report: ${note.trim()}` : "Access report filed";
        set((s) => {
          const next = {
            tokens: s.tokens + gain,
            reports: s.reports + 1,
            lastAccessAt: now,
            events: pushEvent(s.events, label, gain),
          };
          return { ...next, ...grant({ ...s, ...next }, "advocate") };
        });
        return { ok: true, message: `Report filed. +${gain} ${PRODUCT.token}.` };
      },
      startWalk: () => set({ walkActive: true, walkProgress: 0 }),
      tickWalk: (delta) => {
        const s = get();
        if (!s.walkActive) return;
        set({ walkProgress: Math.min(1, s.walkProgress + delta) });
      },
      finishWalk: () => {
        const s = get();
        if (!s.walkActive || s.walkProgress < 1) return;
        const gain = 12;
        set((cur) => {
          const loops = cur.loops + 1;
          const next = {
            walkActive: false,
            walkProgress: 0,
            tokens: cur.tokens + gain,
            loops,
            walkMinutes: cur.walkMinutes + 18,
            events: pushEvent(cur.events, "Loop complete", gain),
          };
          const ch = loops >= 3 ? grant({ ...cur, ...next }, "three-loops") : {};
          return { ...next, ...ch };
        });
      },
      cancelWalk: () => set({ walkActive: false, walkProgress: 0 }),
      vote: (id, amount) => {
        const s = get();
        const proposal = PROPOSALS.find((p) => p.id === id) || s.customProposals.find((p) => p.id === id);
        if (!proposal) return { ok: false, message: "Unknown proposal." };
        const spend = Math.min(amount, s.tokens);
        if (spend < 1) return { ok: false, message: `You need ${PRODUCT.token} to vote.` };
        set((cur) => {
          const next = {
            tokens: cur.tokens - spend,
            votes: { ...cur.votes, [id]: (cur.votes[id] ?? 0) + spend },
            events: pushEvent(cur.events, `Voted ${spend} on ${proposal.title}`, -spend),
          };
          return { ...next, ...grant({ ...cur, ...next }, "first-vote") };
        });
        return { ok: true, message: `Cast ${spend} ${PRODUCT.token} for ${proposal.title}.` };
      },
      pledge: (amount) => {
        const siteId = get().siteId;
        set((s) => {
          const next = {
            extraPledge: { ...s.extraPledge, [siteId]: s.extraPledge[siteId] + amount },
            events: pushEvent(s.events, `Intent ${amount} at ${siteId} (not charged)`, 0),
          };
          return { ...next, ...grant({ ...s, ...next }, "patron") };
        });
      },
      addProposal: (draft) => {
        const id = `custom-${nid()}`;
        const row: Proposal = { ...draft, id, custom: true, voteSeed: 0, sponsorSeed: 0 };
        set((s) => ({
          customProposals: [row, ...s.customProposals],
          votes: { ...s.votes, [id]: 0 },
          events: pushEvent(s.events, `Filed concept: ${draft.title}`, 0),
        }));
      },
      addComment: (proposalId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        set((s) => ({
          comments: [
            { id: nid(), proposalId, text: trimmed, at: new Date().toISOString(), author: s.handle },
            ...s.comments,
          ].slice(0, 80),
        }));
      },
      exportBundle: () => {
        const s = get();
        return JSON.stringify(
          {
            schema: PRODUCT.schema,
            brand: PRODUCT.brand,
            module: PRODUCT.module,
            canonical: PRODUCT.canonical,
            parent: PRODUCT.parentUrl,
            payments: PRODUCT.payments,
            version: PRODUCT.version,
            exported: new Date().toISOString(),
            handle: s.handle,
            pawsteps: s.tokens,
            visits: s.visits,
            loops: s.loops,
            walkMinutes: s.walkMinutes,
            reports: s.reports,
            streak: s.streak,
            siteId: s.siteId,
            votes: s.votes,
            extraPledge: s.extraPledge,
            customProposals: s.customProposals,
            comments: s.comments,
            events: s.events,
          },
          null,
          2,
        );
      },
      resetDemo: () => set({ ...initial, onboarded: true, handle: get().handle }),
    }),
    {
      name: "milomaps-civic-v1",
      skipHydration: true,
      partialize: (s) => ({
        siteId: s.siteId,
        handle: s.handle,
        onboarded: s.onboarded,
        nightMode: s.nightMode,
        tokens: s.tokens,
        visits: s.visits,
        walkMinutes: s.walkMinutes,
        loops: s.loops,
        votes: s.votes,
        lastVisitAt: s.lastVisitAt,
        lastAccessAt: s.lastAccessAt,
        lastVisitDay: s.lastVisitDay,
        streak: s.streak,
        reports: s.reports,
        extraPledge: s.extraPledge,
        events: s.events,
        customProposals: s.customProposals,
        comments: s.comments,
        challenges: s.challenges,
      }),
    },
  ),
);

export function allProposals(s: { customProposals: Proposal[] }): Proposal[] {
  return [...s.customProposals, ...PROPOSALS];
}
