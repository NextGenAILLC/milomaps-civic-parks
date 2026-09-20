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
