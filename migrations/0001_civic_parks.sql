CREATE TABLE IF NOT EXISTS civic_sponsors (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bank', 'credit_union', 'veterinary', 'other')),
  status TEXT NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect', 'active')),
  pledged_cents INTEGER NOT NULL DEFAULT 0,
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  is_custodian BOOLEAN NOT NULL DEFAULT FALSE,
  note TEXT NOT NULL DEFAULT '',
  website TEXT,
  showcase_title TEXT NOT NULL DEFAULT '',
  showcase_body TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS civic_activity (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (
    kind IN (
      'participant',
      'checkin',
      'vote',
      'access_report',
      'comment',
      'concept',
      'package_intent'
    )
  ),
  site_id TEXT NOT NULL,
  participant_handle TEXT,
  proposal_id TEXT,
  proposal_title TEXT,
  amount INTEGER NOT NULL DEFAULT 0,
  note TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS civic_vote_tallies (
  proposal_id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  proposal_title TEXT NOT NULL,
  community_votes INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS civic_activity_created_at_idx ON civic_activity (created_at DESC);
CREATE INDEX IF NOT EXISTS civic_activity_kind_idx ON civic_activity (kind);
CREATE INDEX IF NOT EXISTS civic_sponsors_site_status_idx ON civic_sponsors (site_id, status);

INSERT INTO civic_sponsors (
  id,
  site_id,
  name,
  category,
  status,
  pledged_cents,
  paid,
  is_custodian,
  note,
  website,
  showcase_title,
  showcase_body
)
VALUES
  (
    'fox-communities-credit-union',
    'kaukauna',
    'Fox Communities Credit Union',
    'credit_union',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Prospect for transparent project custody and member-visible park improvement funding.',
    'https://www.foxcu.org',
    'Credit union sponsor prospect',
    'Could act as a true Civic Parks sponsor only after opting in to hold and report project funds transparently.'
  ),
  (
    'community-first-credit-union',
    'kaukauna',
    'Community First Credit Union',
    'credit_union',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Prospect for a community banking sponsor role; not paid or active.',
    'https://www.communityfirstcu.org',
    'Community sponsor prospect',
    'A future active listing would explain the funded park project and custody/reporting path.'
  ),
  (
    'capital-credit-union',
    'kaukauna',
    'Capital Credit Union',
    'credit_union',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Prospect for sponsor custody on lighting or access projects; not paid or active.',
    'https://www.capitalcu.com',
    'Credit union prospect',
    'Prospect cards stay grey until an admin marks the sponsor paid/active after opt-in.'
  ),
  (
    'bank-first-kaukauna',
    'kaukauna',
    'Bank First',
    'bank',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Local bank prospect for transparent sponsor custody; not paid or active.',
    'https://www.bankfirst.com',
    'Bank sponsor prospect',
    'Can become a color sponsor only after admin confirms a real opt-in.'
  ),
  (
    'associated-bank-fox-valley',
    'kaukauna',
    'Associated Bank',
    'bank',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Fox Valley bank prospect; no Civic Parks sponsorship has been recorded.',
    'https://www.associatedbank.com',
    'Bank prospect',
    'Listed as a possible sponsor, not as a paid supporter.'
  ),
  (
    'kaukauna-veterinary-clinic',
    'kaukauna',
    'Kaukauna Veterinary Clinic',
    'veterinary',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Veterinary prospect for project support or matching funds; not paid or active.',
    'https://www.kaukaunavet.com',
    'Veterinary sponsor prospect',
    'A future active showcase can highlight the pet health tie-in and funded park work.'
  ),
  (
    'fox-valley-animal-referral-center',
    'kaukauna',
    'Fox Valley Animal Referral Center',
    'veterinary',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Regional veterinary prospect; not paid or active.',
    'https://www.fvarc.com',
    'Veterinary prospect',
    'Prospect listing only until a real sponsorship is confirmed.'
  ),
  (
    'apple-valley-veterinary-clinic',
    'brewster',
    'Apple Valley Veterinary Clinic',
    'veterinary',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Grand Chute area veterinary prospect for Barks & Recreation improvements.',
    'https://www.applevalleyvetclinic.com',
    'Veterinary prospect',
    'Could support a project after opt-in; this is not a paid listing.'
  ),
  (
    'prospera-credit-union',
    'brewster',
    'Prospera Credit Union',
    'credit_union',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Fox Valley credit union prospect for community-funded park work.',
    'https://www.myprospera.com',
    'Credit union prospect',
    'Can become an active color sponsor only after verified opt-in.'
  ),
  (
    'unison-credit-union',
    'kelso',
    'Unison Credit Union',
    'credit_union',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Kaukauna credit union prospect for Kelso trail or access work.',
    'https://www.unisoncu.org',
    'Credit union prospect',
    'Prospect only; active sponsor status requires admin confirmation.'
  ),
  (
    'kaukauna-feed-and-pet',
    'kaukauna',
    'Kaukauna Feed & Pet',
    'other',
    'prospect',
    0,
    FALSE,
    FALSE,
    'Local pet supply prospect for in-kind or project sponsorship; not paid or active.',
    NULL,
    'Local business prospect',
    'Prospect card only until a true sponsorship is recorded.'
  )
ON CONFLICT (id) DO NOTHING;
