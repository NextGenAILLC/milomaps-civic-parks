export type BoardTier = "officer" | "at-large" | "prospect-liaison";

export type BoardSeat = {
  id: string;
  role: string;
  name: string;
  focus: string;
  note: string;
  tier: BoardTier;
};

/** Neighbor roles for Kaukauna Civic Parks — not city appointments. */
export const NEIGHBOR_BOARD: BoardSeat[] = [
  {
    id: "chair",
    role: "Board chair",
    name: "M. Keller",
    focus: "Agenda, ballot order, keeping the board neighbor-led",
    note: "Runs the open ranking so lighting vs access vs winter work is sequenced in public.",
    tier: "officer",
  },
  {
    id: "vice",
    role: "Vice / Access advocate",
    name: "S. Rivera",
    focus: "Parking-to-gate route, van stalls, seating reach",
    note: "Stands in when the chair is out. Keeps mobility users in every capital conversation — not as an afterthought.",
    tier: "officer",
  },
  {
    id: "notes",
    role: "Notes owner",
    name: "T. Olsen",
    focus: "PawSteps tallies, discussion notes, public ranking",
    note: "Publishes what neighbors voted and what still needs a true sponsor custodian. No public admin inbox.",
    tier: "officer",
  },
  {
    id: "trail",
    role: "At-large · Trail",
    name: "J. Novak",
    focus: "Pond loop, bridges, winter edge readability",
    note: "Walks the loop after storms and flags where the path disappears under snow or mud.",
    tier: "at-large",
  },
  {
    id: "winter",
    role: "At-large · Winter walks",
    name: "A. Berg",
    focus: "Shoulder-hour and January use",
    note: "Tracks when evening turnout collapses and which fixes bring people back.",
    tier: "at-large",
  },
  {
    id: "sponsor",
    role: "Sponsor liaison",
    name: "R. Haas",
    focus: "Banks, credit unions, and shelter partners as grey prospects",
    note: "Names prospects only. Dollars stay grey until a custodian opts in for a specific project. Never shows fake paid $".",
    tier: "prospect-liaison",
  },
];

/** Neighbor board — not city hall. */
export const QUORUM_NOTE =
  "Informal quorum: board chair or vice plus any two other named seats. Ranking votes are public neighbor signal for decision makers — they do not bind the City of Kaukauna or any parks department.";

export const DECISION_STEPS = [
  {
    title: "Neighbors earn and vote",
    detail: "Check-ins and real use mint PawSteps. Votes rank work in public — free, no card.",
  },
  {
    title: "Board reads the ranking",
    detail:
      "Chair, vice, and notes owner sequence what to pitch first. At-large neighbors keep trail and winter truth on the table. This is signal, not a city ordinance.",
  },
  {
    title: "True sponsors fund with a custodian",
    detail:
      "Banks and credit unions stay grey prospects until they opt in. Money never sits with a private operator. No public admin email.",
  },
] as const;

export type ProposalMeta = {
  who: string;
  boardNote: string;
  urgency: "now" | "this-season" | "next-year";
};

export const PROPOSAL_META: Record<string, ProposalMeta> = {
  "solar-lights": {
    who: "Weeknight walkers, winter regulars, anyone finishing work after dark",
    boardNote: "Board ranking question: is evening use worth solar posts before bigger path work?",
    urgency: "now",
  },
  "accessible-path": {
    who: "Wheelchair and walker users, injured knees, caregivers with strollers",
    boardNote:
      "Treat this as the unlock for every other amenity — if the gate walk fails, lighting and seating never reach the people who need them.",
    urgency: "now",
  },
  "seating-pods": {
    who: "Older owners, recovery walkers, people who stay while dogs play",
    boardNote: "Lower cost, high dignity. Pairs with access work so seating is reachable, not ornamental.",
    urgency: "this-season",
  },
  "winter-markers": {
    who: "January–March loop walkers and anyone navigating after snowfall",
    boardNote: "Cheap relative to paving. Keeps the year-round promise honest when the grass edge vanishes.",
    urgency: "this-season",
  },
  "gate-pads": {
    who: "First-time visitors with mobility limits; van users",
    boardNote: "Entry is the first twenty feet. The board can sequence pads ahead of full path if capital is staged.",
    urgency: "now",
  },
  "brewster-lot-lights": {
    who: "Grand Chute evening visitors leaving the lot after dusk close",
    boardNote: "County hours end at dusk; lighting the lot-to-gate walk is still a safety choice for shoulder months.",
    urgency: "this-season",
  },
  "brewster-agility-pad": {
    who: "Training regulars and seated observers",
    boardNote: "Agility is popular; a drained pad with a viewing strip turns ruts into a usable training edge.",
    urgency: "next-year",
  },
  "kelso-loop": {
    who: "Leashed pond walkers and pier users after rain or freeze",
    boardNote: "A packed loop is the difference between a July park and a year-round leashed trail.",
    urgency: "this-season",
  },
};
