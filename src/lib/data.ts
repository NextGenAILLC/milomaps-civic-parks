export type SiteId = "kaukauna" | "brewster" | "kelso";

export type Proposal = {
  id: string;
  siteId: SiteId;
  title: string;
  summary: string;
  why: string;
  cost: number;
  sponsorSeed: number;
  voteSeed: number;
  voteGoal: number;
  tag: string;
  custom?: boolean;
};

export type Sponsor = {
  id: string;
  siteId: SiteId;
  name: string;
  category: SponsorCategory;
  status: SponsorStatus;
  pledged: number;
  paid: boolean;
  isCustodian: boolean;
  note: string;
  website?: string;
  showcaseTitle?: string;
  showcaseBody?: string;
};

export type SponsorCategory = "bank" | "credit_union" | "veterinary" | "other";
export type SponsorStatus = "prospect" | "active";

export const SPONSOR_CATEGORY_LABELS: Record<SponsorCategory, string> = {
  bank: "Bank",
  credit_union: "Credit union",
  veterinary: "Veterinary",
  other: "Other",
};

export type Site = {
  id: SiteId;
  name: string;
  city: string;
  address: string;
  acres: number;
  hours: string;
  blurb: string;
  lat: number;
  lng: number;
  radiusM: number;
  features: string[];
  issues: { id: string; title: string; detail: string }[];
  mapKind: "pond" | "agility" | "trail";
};

export const SITES: Site[] = [
  {
    id: "kaukauna",
    name: "Kaukauna Dog Park",
    city: "Kaukauna",
    address: "366 Farmland Court, Kaukauna, WI",
    acres: 13,
    hours: "5 AM – 11 PM, year-round",
    blurb:
      "Off-leash fields, a swimming pond, and a Scout-built trail. Lighting, ground, and access are why turnout dies after dark.",
    lat: 44.2778,
    lng: -88.2714,
    radiusM: 450,
    mapKind: "pond",
    features: [
      "Fenced small-dog area",
      "Large off-leash field",
      "Fenced swimming pond",
      "Perimeter trail with two bridges",
    ],
    issues: [
      {
        id: "lighting",
        title: "Shoulder-hour lighting",
        detail:
          "After 6:30 in fall the pond loop and both gates go dark. Regulars park with headlights on or skip the second loop. Evening turnout collapses while the park is still open until 11.",
      },
      {
        id: "ground",
        title: "Uneven ground and frost heave",
        detail:
          "The parking-to-small-dog walk and near-pond stretch rut after thaw. Walkers, strollers, and knees take the hit; people with mobility limits stop at the lot.",
      },
      {
        id: "access",
        title: "Continuous accessible route",
        detail:
          "There is no firm path from a van stall through the double gates to seating, water, and the pond loop. Access is a neighbor priority, not a nicety.",
      },
      {
        id: "winter",
        title: "Winter edge readability",
        detail:
          "When snow covers the grass edge, the pond loop disappears. Year-round hours only help if the path still reads after a storm.",
      },
    ],
  },
  {
    id: "brewster",
    name: "Barks & Recreation",
    city: "Grand Chute",
    address: "3302 W Brewster Street, Grand Chute, WI",
    acres: 10,
    hours: "Dawn to dusk",
    blurb:
      "New county park with large and small yards and agility. Still needs pressure on after-dusk walks and lot-to-yard access.",
    lat: 44.2672,
    lng: -88.4451,
    radiusM: 400,
    mapKind: "agility",
    features: ["6.5-acre large-dog yard", "1-acre small-dog yard", "Agility area", "Paved parking"],
    issues: [
      {
        id: "after-hours",
        title: "After-dusk use",
        detail: "Hours close at dusk. January at 5 p.m. still needs a lit walk from the lot.",
      },
      {
        id: "agility-access",
        title: "Agility surface",
        detail: "Training is popular; the approach is not a firm accessible route.",
      },
    ],
  },
  {
    id: "kelso",
    name: "Kelso Park & Pond",
    city: "Kaukauna",
    address: "2801 Progress Way, Kaukauna, WI",
    acres: 8,
    hours: "Dawn to dusk",
    blurb: "Leashed pond loop. Grass goes to mud. A packed loop would open it beyond able-bodied walkers.",
    lat: 44.2921,
    lng: -88.2689,
    radiusM: 400,
    mapKind: "trail",
    features: ["Pond with fishing pier", "Grass walking trails", "Leashed dogs welcome", "Wildlife viewing"],
    issues: [
      { id: "mud", title: "Soft trail", detail: "Grass ruts after rain and freeze uneven." },
      { id: "pier", title: "Pier approach", detail: "No firm marked path from parking to the pier." },
    ],
  },
];

export const PROPOSALS: Proposal[] = [
  {
    id: "solar-lights",
    siteId: "kaukauna",
    title: "Solar path lighting",
    summary: "Warm, low-glare solar posts along the pond trail, gates, and parking walk.",
    why: "Makes evenings and winter usable without flooding neighbors with light.",
    cost: 18400,
    sponsorSeed: 0,
    voteSeed: 214,
    voteGoal: 400,
    tag: "Safety",
  },
  {
    id: "accessible-path",
    siteId: "kaukauna",
    title: "Firm accessible routes",
    summary: "Stabilized path from parking through double gates to seating, water, and the pond loop.",
    why: "Wheelchairs, walkers, and injured knees should reach the park, not just the lot.",
    cost: 42000,
    sponsorSeed: 0,
    voteSeed: 188,
    voteGoal: 500,
    tag: "Access",
  },
  {
    id: "seating-pods",
    siteId: "kaukauna",
    title: "Observation seating pods",
    summary: "Raised rest nodes with sight lines to the small-dog yard and pond.",
    why: "Owners who cannot stand for an hour still belong here with their dogs.",
    cost: 12800,
    sponsorSeed: 0,
    voteSeed: 96,
    voteGoal: 280,
    tag: "Rest",
  },
  {
    id: "winter-markers",
    siteId: "kaukauna",
    title: "Winter trail markers",
    summary: "High-contrast edge stakes so the pond loop still reads after snow.",
    why: "This park is open all year. The path should still read when the grass disappears.",
    cost: 6200,
    sponsorSeed: 0,
    voteSeed: 71,
    voteGoal: 180,
    tag: "Winter",
  },
  {
    id: "gate-pads",
    siteId: "kaukauna",
    title: "Gate and parking pads",
    summary: "Level pads at both gates and two van-accessible stalls.",
    why: "The first twenty feet decide whether someone with a mobility limit even tries.",
    cost: 9500,
    sponsorSeed: 0,
    voteSeed: 64,
    voteGoal: 200,
    tag: "Entry",
  },
  {
    id: "brewster-lot-lights",
    siteId: "brewster",
    title: "Lot-to-gate lighting",
    summary: "Pedestrian-scale lights from the lot to both yards.",
    why: "Paved parking is not enough if the walk in still goes dark in January.",
    cost: 15600,
    sponsorSeed: 0,
    voteSeed: 54,
    voteGoal: 220,
    tag: "Safety",
  },
  {
    id: "brewster-agility-pad",
    siteId: "brewster",
    title: "Accessible agility pad",
    summary: "Firm, drained pad into the agility area with a seated viewing strip.",
    why: "Training should not require standing in ruts.",
    cost: 21000,
    sponsorSeed: 0,
    voteSeed: 41,
    voteGoal: 200,
    tag: "Access",
  },
  {
    id: "kelso-loop",
    siteId: "kelso",
    title: "Packed pond loop",
    summary: "Compacted fines around the water with a flush pier approach.",
    why: "A leashed trail that only works in July is not a year-round park.",
    cost: 28000,
    sponsorSeed: 0,
    voteSeed: 38,
    voteGoal: 180,
    tag: "Access",
  },
];

export const SPONSORS: Sponsor[] = [
  {
    id: "fox-communities-credit-union",
    siteId: "kaukauna",
    name: "Fox Communities Credit Union",
    category: "credit_union",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Prospect for transparent project custody and member-visible park improvement funding.",
    website: "https://www.foxcu.org",
    showcaseTitle: "Credit union sponsor prospect",
    showcaseBody:
      "Could act as a true Civic Parks sponsor only after opting in to hold and report project funds transparently.",
  },
  {
    id: "community-first-credit-union",
    siteId: "kaukauna",
    name: "Community First Credit Union",
    category: "credit_union",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Prospect for a community banking sponsor role; not paid or active.",
    website: "https://www.communityfirstcu.org",
    showcaseTitle: "Community sponsor prospect",
    showcaseBody:
      "A future active listing would explain the funded park project and custody/reporting path.",
  },
  {
    id: "capital-credit-union",
    siteId: "kaukauna",
    name: "Capital Credit Union",
    category: "credit_union",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Prospect for sponsor custody on lighting or access projects; not paid or active.",
    website: "https://www.capitalcu.com",
    showcaseTitle: "Credit union prospect",
    showcaseBody:
      "Prospect cards stay grey until a verified record marks the sponsor paid/active after opt-in.",
  },
  {
    id: "bank-first-kaukauna",
    siteId: "kaukauna",
    name: "Bank First",
    category: "bank",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Local bank prospect for transparent sponsor custody; not paid or active.",
    website: "https://www.bankfirst.com",
    showcaseTitle: "Bank sponsor prospect",
    showcaseBody: "Can become a color sponsor only after a confirmed opt-in is recorded.",
  },
  {
    id: "associated-bank-fox-valley",
    siteId: "kaukauna",
    name: "Associated Bank",
    category: "bank",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Fox Valley bank prospect; no Civic Parks sponsorship has been recorded.",
    website: "https://www.associatedbank.com",
    showcaseTitle: "Bank prospect",
    showcaseBody: "Listed as a possible sponsor, not as a paid supporter.",
  },
  {
    id: "kaukauna-veterinary-clinic",
    siteId: "kaukauna",
    name: "Kaukauna Veterinary Clinic",
    category: "veterinary",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Veterinary prospect for project support or matching funds; not paid or active.",
    website: "https://www.kaukaunavet.com",
    showcaseTitle: "Veterinary sponsor prospect",
    showcaseBody: "A future active showcase can highlight the pet health tie-in and funded park work.",
  },
  {
    id: "fox-valley-animal-referral-center",
    siteId: "kaukauna",
    name: "Fox Valley Animal Referral Center",
    category: "veterinary",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Regional veterinary prospect; not paid or active.",
    website: "https://www.fvarc.com",
    showcaseTitle: "Veterinary prospect",
    showcaseBody: "Prospect listing only until a real sponsorship is confirmed.",
  },
  {
    id: "apple-valley-veterinary-clinic",
    siteId: "brewster",
    name: "Apple Valley Veterinary Clinic",
    category: "veterinary",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Grand Chute area veterinary prospect for Barks & Recreation improvements.",
    website: "https://www.applevalleyvetclinic.com",
    showcaseTitle: "Veterinary prospect",
    showcaseBody: "Could support a project after opt-in; this is not a paid listing.",
  },
  {
    id: "prospera-credit-union",
    siteId: "brewster",
    name: "Prospera Credit Union",
    category: "credit_union",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Fox Valley credit union prospect for community-funded park work.",
    website: "https://www.myprospera.com",
    showcaseTitle: "Credit union prospect",
    showcaseBody: "Can become an active color sponsor only after verified opt-in.",
  },
  {
    id: "unison-credit-union",
    siteId: "kelso",
    name: "Unison Credit Union",
    category: "credit_union",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Kaukauna credit union prospect for Kelso trail or access work.",
    website: "https://www.unisoncu.org",
    showcaseTitle: "Credit union prospect",
    showcaseBody: "Prospect only; active sponsor status requires a confirmed opt-in on record.",
  },
  {
    id: "kaukauna-feed-and-pet",
    siteId: "kaukauna",
    name: "Kaukauna Feed & Pet",
    category: "other",
    status: "prospect",
    pledged: 0,
    paid: false,
    isCustodian: false,
    note: "Local pet supply prospect for in-kind or project sponsorship; not paid or active.",
    showcaseTitle: "Local business prospect",
    showcaseBody: "Prospect card only until a true sponsorship is recorded.",
  },
];

export const PACKAGES = [
  { id: "trail", label: "Trail light", amount: 250, note: "One solar post" },
  { id: "segment", label: "Path segment", amount: 1000, note: "Twenty feet of firm route" },
  { id: "naming", label: "Naming year", amount: 2500, note: "Gate plaque, one season" },
];

export const TAGS = ["All", "Safety", "Access", "Rest", "Winter", "Entry"] as const;

export const CONCEPT_LEDGER = [
  {
    id: "c1",
    title: "Community token ballot for park capital",
    filed: "2026-08-24T22:41:00-05:00",
    owner: "Milo Maps",
    status: "Disclosed",
    body: "Participation mints PawSteps. Tokens are votes on a public capital list.",
  },
  {
    id: "c2",
    title: "Solar trail lighting for Kaukauna Dog Park",
    filed: "2026-08-24T22:48:00-05:00",
    owner: "Milo Maps",
    status: "Disclosed",
    body: "Low-glare solar posts on the pond loop, gates, and parking walk.",
  },
  {
    id: "c6",
    title: "Civic Parks on milomaps.org",
    filed: "2026-09-07T11:20:00-05:00",
    owner: "Milo Maps",
    status: "Disclosed",
    body: "Neighbor-board module on a Milo Maps civic host, built to merge with Amber Trails.",
  },
  {
    id: "c7",
    title: "Host attach: Civic Parks plus alternate parks host",
    filed: "2026-09-18T09:26:00-04:00",
    owner: "Milo Maps",
    status: "Disclosed",
    body: "milomaps.org is canonical. parks.milomaps.com may remain as an alternate host. Amber Trails stays on milomaps.com and www.",
  },
];

export const CHALLENGES = [
  { id: "first-visit", title: "Show up", detail: "Check in at any site.", reward: 5 },
  { id: "first-vote", title: "Cast a vote", detail: "Spend PawSteps on the ballot.", reward: 5 },
  { id: "three-loops", title: "Three loops", detail: "Finish three pond or trail loops.", reward: 12 },
  { id: "advocate", title: "Access advocate", detail: "File one access report.", reward: 8 },
  { id: "patron", title: "Local patron", detail: "Record a sponsor package intent.", reward: 6 },
];

export function siteById(id: SiteId) {
  return SITES.find((s) => s.id === id) ?? SITES[0];
}

export function haversineM(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371000;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) *
      Math.cos((bLat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
