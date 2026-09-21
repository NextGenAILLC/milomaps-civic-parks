export type BoardSeat = {
  id: string;
  role: string;
  name: string;
  focus: string;
  note: string;
};

/** Neighbor roles for Kaukauna Civic Parks — not city appointments. */
export const NEIGHBOR_BOARD: BoardSeat[] = [
  {
    id: "chair",
    role: "Board chair",
    name: "M. Keller",
    focus: "Agenda, ballot order, keeping the board neighbor-led",
    note: "Runs the open ranking so lighting vs access vs winter work is sequenced in public.",
  },
  {
    id: "trail",
    role: "Trail steward",
    name: "J. Novak",
    focus: "Pond loop, bridges, winter edge readability",
    note: "Walks the loop after storms and flags where the path disappears under snow or mud.",
  },
  {
    id: "access",
    role: "Access advocate",
    name: "S. Rivera",
    focus: "Parking-to-gate route, van stalls, seating reach",
    note: "Keeps mobility users in every capital conversation — not as an afterthought.",
  },
  {
    id: "winter",
    role: "Winter walks lead",
    name: "A. Berg",
    focus: "Shoulder-hour and January use",
    note: "Tracks when evening turnout collapses and which fixes bring people back.",
  },
  {
    id: "ballot",
    role: "Ballot clerk",
    name: "T. Olsen",
    focus: "PawSteps tallies, discussion notes, public ranking",
    note: "Publishes what neighbors voted and what still needs a true sponsor custodian.",
  },
  {
    id: "sponsor",
    role: "Sponsor liaison",
    name: "R. Haas",
    focus: "Banks, credit unions, and shelter partners as grey prospects",
    note: "Names prospects only. Dollars stay grey until a custodian opts in for a specific project.",
  },
];

export const DECISION_STEPS = [
  {
    title: "Neighbors earn and vote",
    detail: "Check-ins and real use mint PawSteps. Votes rank work in public — free, no card.",
  },
  {
    title: "Board reads the ranking",
    detail: "Neighbor roles sequence what to pitch first. This is signal, not a city ordinance.",
  },
  {
    title: "True sponsors fund with a custodian",
    detail:
      "Banks and credit unions stay grey prospects until they opt in. Money never sits with a private operator.",
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

/** Draft hierarchy for Rob to approve — neighbor board, not city appointments. */
export const BOARD_HIERARCHY = [
  {
    seat: "Board chair",
    does: "Sets ballot order, opens short comment windows, keeps one decision in focus.",
  },
  {
    seat: "Access advocate (vice)",
    does: "Watches gate-to-path access, mobility, and whether work reaches people who need it.",
  },
  {
    seat: "Notes / ballot clerk",
    does: "Publishes what passed, what waited, and the public ranking after each window.",
  },
  {
    seat: "At-large neighbors",
    does: "Equal votes from park regulars (trail, winter, evening use).",
  },
  {
    seat: "Sponsor liaison (non-custodial)",
    does: "Names grey prospects only. Never holds dollars; true sponsors opt in as custodians.",
  },
  {
    seat: "Observer (optional)",
    does: "City or sponsor liaison may watch; no vote until seated as a neighbor.",
  },
] as const;

/** Quorum note — adjustable after Rob approves. */
export const BOARD_QUORUM_NOTE =
  "Quorum draft: board chair + two seated neighbors. Simple majority of seated votes. Sponsors stay grey until a real opt-in.";
