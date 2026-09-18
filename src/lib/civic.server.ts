import { createServerFn } from "@tanstack/react-start";
import { timingSafeEqual } from "node:crypto";
import {
  PROPOSALS,
  SPONSOR_CATEGORY_LABELS,
  SPONSORS,
  type SiteId,
  type Sponsor,
  type SponsorCategory,
  type SponsorStatus,
} from "@/lib/data";

export type PublicSponsor = Sponsor & {
  updatedAt: string;
};

export type PublicActivityKind =
  | "participant"
  | "checkin"
  | "vote"
  | "access_report"
  | "comment"
  | "concept"
  | "package_intent";

export type PublicActivityInput = {
  kind: PublicActivityKind;
  siteId: SiteId;
  participantHandle?: string;
  proposalId?: string;
  proposalTitle?: string;
  amount?: number;
  note?: string;
};

export type AdminActivityRow = {
  id: string;
  kind: PublicActivityKind;
  siteId: string;
  participantHandle: string | null;
  proposalId: string | null;
  proposalTitle: string | null;
  amount: number;
  note: string;
  createdAt: string;
};

export type AdminParticipantRow = {
  participantHandle: string;
  events: number;
  checkins: number;
  votes: number;
  lastSeenAt: string;
};

export type AdminVoteTally = {
  proposalId: string;
  siteId: string;
  proposalTitle: string;
  seedVotes: number;
  communityVotes: number;
  totalVotes: number;
};

export type AdminDashboard = {
  sponsors: PublicSponsor[];
  activity: AdminActivityRow[];
  participants: AdminParticipantRow[];
  voteTallies: AdminVoteTally[];
  categories: typeof SPONSOR_CATEGORY_LABELS;
};

export type AdminPasswordInput = {
  password: string;
};

export type SponsorUpdateInput = AdminPasswordInput & {
  id: string;
  name: string;
  category: SponsorCategory;
  status: SponsorStatus;
  pledged: number;
  paid: boolean;
  isCustodian: boolean;
  note: string;
  website?: string;
  showcaseTitle: string;
  showcaseBody: string;
};

type SponsorRow = {
  id: string;
  site_id: SiteId;
  name: string;
  category: SponsorCategory;
  status: SponsorStatus;
  pledged_cents: number;
  paid: boolean;
  is_custodian: boolean;
  note: string;
  website: string | null;
  showcase_title: string;
  showcase_body: string;
  updated_at: string;
};

type ActivityRow = {
  id: string;
  kind: PublicActivityKind;
  site_id: string;
  participant_handle: string | null;
  proposal_id: string | null;
  proposal_title: string | null;
  amount: number;
  note: string;
  created_at: string;
};

type ParticipantRow = {
  participant_handle: string;
  events: number;
  checkins: number;
  votes: number;
  last_seen_at: string;
};

type TallyRow = {
  proposal_id: string;
  site_id: string;
  proposal_title: string;
  community_votes: number;
};

const SITE_IDS = new Set<SiteId>(["kaukauna", "brewster", "kelso"]);
const SPONSOR_CATEGORIES = new Set<SponsorCategory>(["bank", "credit_union", "veterinary", "other"]);
const SPONSOR_STATUSES = new Set<SponsorStatus>(["prospect", "active"]);
const ACTIVITY_KINDS = new Set<PublicActivityKind>([
  "participant",
  "checkin",
  "vote",
  "access_report",
  "comment",
  "concept",
  "package_intent",
]);

function cleanText(value: unknown, max = 500): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanOptionalText(value: unknown, max = 500): string | undefined {
  const text = cleanText(value, max);
  return text || undefined;
}

function cleanNumber(value: unknown, min = 0, max = 1_000_000): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(max, Math.max(min, n));
}

function normalizeSiteId(value: unknown): SiteId {
  return SITE_IDS.has(value as SiteId) ? (value as SiteId) : "kaukauna";
}

function normalizeCategory(value: unknown): SponsorCategory {
  return SPONSOR_CATEGORIES.has(value as SponsorCategory) ? (value as SponsorCategory) : "other";
}

function normalizeStatus(value: unknown): SponsorStatus {
  return SPONSOR_STATUSES.has(value as SponsorStatus) ? (value as SponsorStatus) : "prospect";
}

function normalizePublicActivity(value: PublicActivityInput): PublicActivityInput {
  const kind = ACTIVITY_KINDS.has(value.kind) ? value.kind : "participant";
  return {
    kind,
    siteId: normalizeSiteId(value.siteId),
    participantHandle: cleanOptionalText(value.participantHandle, 80),
    proposalId: cleanOptionalText(value.proposalId, 120),
    proposalTitle: cleanOptionalText(value.proposalTitle, 160),
    amount: Math.round(cleanNumber(value.amount, 0, 100_000)),
    note: cleanOptionalText(value.note, 800),
  };
}

function normalizeSponsorUpdate(value: SponsorUpdateInput): SponsorUpdateInput {
  const paid = Boolean(value.paid);
  const status = normalizeStatus(value.status);
  return {
    password: cleanText(value.password, 500),
    id: cleanText(value.id, 120),
    name: cleanText(value.name, 160),
    category: normalizeCategory(value.category),
    status,
    pledged: cleanNumber(value.pledged, 0, 1_000_000),
    paid,
    isCustodian: Boolean(value.isCustodian),
    note: cleanText(value.note, 800),
    website: cleanOptionalText(value.website, 300),
    showcaseTitle: cleanText(value.showcaseTitle, 200),
    showcaseBody: cleanText(value.showcaseBody, 1600),
  };
}

function sponsorFromRow(row: SponsorRow): PublicSponsor {
  return {
    id: row.id,
    siteId: row.site_id,
    name: row.name,
    category: row.category,
    status: row.status,
    pledged: Math.round(row.pledged_cents / 100),
    paid: row.paid,
    isCustodian: row.is_custodian,
    note: row.note,
    website: row.website ?? undefined,
    showcaseTitle: row.showcase_title,
    showcaseBody: row.showcase_body,
    updatedAt: row.updated_at,
  };
}

function activityFromRow(row: ActivityRow): AdminActivityRow {
  return {
    id: row.id,
    kind: row.kind,
    siteId: row.site_id,
    participantHandle: row.participant_handle,
    proposalId: row.proposal_id,
    proposalTitle: row.proposal_title,
    amount: row.amount,
    note: row.note,
    createdAt: row.created_at,
  };
}

function fallbackSponsors(siteId?: SiteId): PublicSponsor[] {
  const now = new Date().toISOString();
  return SPONSORS.filter((s) => !siteId || s.siteId === siteId).map((s) => ({
    ...s,
    updatedAt: now,
  }));
}

async function listSponsors(siteId?: SiteId): Promise<PublicSponsor[]> {
  const { getSql } = await import("./db");
  const sql = await getSql();
  const rows = siteId
    ? await sql.query<SponsorRow>(
        `SELECT id, site_id, name, category, status, pledged_cents, paid, is_custodian,
                note, website, showcase_title, showcase_body, updated_at::text AS updated_at
           FROM civic_sponsors
          WHERE site_id = $1
          ORDER BY CASE WHEN status = 'active' AND paid THEN 0 ELSE 1 END, category, name`,
        [siteId],
      )
    : await sql.query<SponsorRow>(
        `SELECT id, site_id, name, category, status, pledged_cents, paid, is_custodian,
                note, website, showcase_title, showcase_body, updated_at::text AS updated_at
           FROM civic_sponsors
          ORDER BY site_id, CASE WHEN status = 'active' AND paid THEN 0 ELSE 1 END, category, name`,
      );
  return rows.map(sponsorFromRow);
}

async function getDashboard(): Promise<AdminDashboard> {
  const { getSql } = await import("./db");
  const sql = await getSql();
  const [sponsors, activityRows, participantRows, tallyRows] = await Promise.all([
    listSponsors(),
    sql.query<ActivityRow>(
      `SELECT id, kind, site_id, participant_handle, proposal_id, proposal_title, amount,
              note, created_at::text AS created_at
         FROM civic_activity
        ORDER BY created_at DESC
        LIMIT 120`,
    ),
    sql.query<ParticipantRow>(
      `SELECT participant_handle,
              COUNT(*)::int AS events,
              COUNT(*) FILTER (WHERE kind = 'checkin')::int AS checkins,
              COUNT(*) FILTER (WHERE kind = 'vote')::int AS votes,
              MAX(created_at)::text AS last_seen_at
         FROM civic_activity
        WHERE participant_handle IS NOT NULL AND participant_handle <> ''
        GROUP BY participant_handle
        ORDER BY MAX(created_at) DESC
        LIMIT 80`,
    ),
    sql.query<TallyRow>(
      `SELECT proposal_id, site_id, proposal_title, community_votes
         FROM civic_vote_tallies
        ORDER BY community_votes DESC, proposal_title`,
    ),
  ]);

  const tallies = new Map<string, TallyRow>(tallyRows.map((row) => [row.proposal_id, row]));
  const voteTallies: AdminVoteTally[] = PROPOSALS.map((proposal) => {
    const row = tallies.get(proposal.id);
    tallies.delete(proposal.id);
    const communityVotes = row?.community_votes ?? 0;
    return {
      proposalId: proposal.id,
      siteId: proposal.siteId,
      proposalTitle: proposal.title,
      seedVotes: proposal.voteSeed,
      communityVotes,
      totalVotes: proposal.voteSeed + communityVotes,
    };
  });
  for (const row of tallies.values()) {
    voteTallies.push({
      proposalId: row.proposal_id,
      siteId: row.site_id,
      proposalTitle: row.proposal_title,
      seedVotes: 0,
      communityVotes: row.community_votes,
      totalVotes: row.community_votes,
    });
  }

  return {
    sponsors,
    activity: activityRows.map(activityFromRow),
    participants: participantRows.map((row) => ({
      participantHandle: row.participant_handle,
      events: row.events,
      checkins: row.checkins,
      votes: row.votes,
      lastSeenAt: row.last_seen_at,
    })),
    voteTallies: voteTallies.sort((a, b) => b.totalVotes - a.totalVotes),
    categories: SPONSOR_CATEGORY_LABELS,
  };
}

function requireAdminPassword(input: AdminPasswordInput): void {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (!configured) {
    throw new Error("ADMIN_PASSWORD is not configured on this deployment.");
  }
  const supplied = cleanText(input.password, 500);
  const configuredBytes = Buffer.from(configured);
  const suppliedBytes = Buffer.from(supplied);
  if (
    configuredBytes.length !== suppliedBytes.length ||
    !timingSafeEqual(configuredBytes, suppliedBytes)
  ) {
    throw new Error("Invalid admin password.");
  }
}

export const getPublicSponsors = createServerFn({ method: "POST" })
  .validator((data: { siteId?: SiteId }) => ({ siteId: data?.siteId ? normalizeSiteId(data.siteId) : undefined }))
  .handler(async ({ data }): Promise<PublicSponsor[]> => {
    try {
      return await listSponsors(data.siteId);
    } catch (err) {
      console.error("[civic] sponsor list failed; using seed fallback", err);
      return fallbackSponsors(data.siteId);
    }
  });

export const recordPublicActivity = createServerFn({ method: "POST" })
  .validator((data: PublicActivityInput) => normalizePublicActivity(data))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { assertSameSiteRequest } = await import("./auth/isolation.server");
    assertSameSiteRequest();
    const { getSql } = await import("./db");
    const sql = await getSql();
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await sql.query(
      `INSERT INTO civic_activity (
         id, kind, site_id, participant_handle, proposal_id, proposal_title, amount, note
       )
       VALUES ($1, $2, $3, NULLIF($4, ''), NULLIF($5, ''), NULLIF($6, ''), $7, $8)`,
      [
        id,
        data.kind,
        data.siteId,
        data.participantHandle ?? "",
        data.proposalId ?? "",
        data.proposalTitle ?? "",
        data.amount ?? 0,
        data.note ?? "",
      ],
    );

    if (data.kind === "vote" && data.proposalId && data.proposalTitle) {
      await sql.query(
        `INSERT INTO civic_vote_tallies (proposal_id, site_id, proposal_title, community_votes)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (proposal_id) DO UPDATE
           SET community_votes = civic_vote_tallies.community_votes + EXCLUDED.community_votes,
               proposal_title = EXCLUDED.proposal_title,
               site_id = EXCLUDED.site_id,
               updated_at = now()`,
        [data.proposalId, data.siteId, data.proposalTitle, data.amount ?? 0],
      );
    }

    return { ok: true };
  });

export const getAdminDashboard = createServerFn({ method: "POST" })
  .validator((data: AdminPasswordInput) => ({ password: cleanText(data?.password, 500) }))
  .handler(async ({ data }): Promise<AdminDashboard> => {
    const { assertSameSiteRequest } = await import("./auth/isolation.server");
    assertSameSiteRequest();
    requireAdminPassword(data);
    return getDashboard();
  });

export const saveSponsor = createServerFn({ method: "POST" })
  .validator((data: SponsorUpdateInput) => normalizeSponsorUpdate(data))
  .handler(async ({ data }): Promise<AdminDashboard> => {
    const { assertSameSiteRequest } = await import("./auth/isolation.server");
    assertSameSiteRequest();
    requireAdminPassword(data);
    const { getSql } = await import("./db");
    const sql = await getSql();
    const pledgedCents = Math.round(data.pledged * 100);
    const status = data.status === "active" && data.paid ? "active" : "prospect";
    await sql.query(
      `UPDATE civic_sponsors
          SET name = $2,
              category = $3,
              status = $4,
              pledged_cents = $5,
              paid = $6,
              is_custodian = $7,
              note = $8,
              website = NULLIF($9, ''),
              showcase_title = $10,
              showcase_body = $11,
              updated_at = now()
        WHERE id = $1`,
      [
        data.id,
        data.name,
        data.category,
        status,
        pledgedCents,
        data.paid,
        data.isCustodian,
        data.note,
        data.website ?? "",
        data.showcaseTitle,
        data.showcaseBody,
      ],
    );
    return getDashboard();
  });
