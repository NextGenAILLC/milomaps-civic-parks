export const PRODUCT = {
  brand: "Milo Maps",
  module: "civic-parks",
  moduleName: "Civic Parks",
  version: "1.0.0",
  schema: "milomaps.civic.v1",
  token: "PawSteps",
  canonical: "https://parks.milomaps.com",
  parentUrl: "https://milomaps.com",
  parentProduct: "Amber Trails",
  storyUrl: "https://milomaps.com/story",
  mapUrl: "https://milomaps.com/map",
  partnerUrl: "https://milomaps.com/pioneer",
  region: "Fox Cities, Wisconsin",
  build: "solo-public-beta",
  payments: "intent-only",
} as const;

export const FAMILY = [
  { label: "Civic Parks", href: "https://parks.milomaps.com", here: true },
  { label: "Amber Trails", href: "https://milomaps.com", here: false },
  { label: "Map", href: "https://milomaps.com/map", here: false },
  { label: "Story", href: "https://milomaps.com/story", here: false },
] as const;

export const PUBLIC_SPLIT = {
  park: 80,
  operate: 15,
  steward: 5,
  parkLabel: "Park work",
  operateLabel: "Keep the module running",
  stewardLabel: "Founder / steward",
  rule:
    "Neighbors never pay. Stripe is not connected yet. Packages record intent only — no card is charged. When Stripe goes live, the same 80 / 15 / 5 split applies to real sponsor dollars, shown here, not in a footnote.",
} as const;

export const GIFT_POST = `Kaukauna —

This is a gift to the dog park. Not a fundraiser.

I built Civic Parks on Milo Maps so we can check in at 366 Farmland Court, vote on the real problems — lighting, uneven ground, access for people who can’t walk the ruts — and let local businesses fund what we actually pick.

The park stays free. Nobody in this group is being asked for money. There is no payment form. Cards are not charged.

If a shop later buys a lighting or path package through Stripe, every dollar will be public:

80% park work
15% keep the tool running
5% steward (me)

That is the whole split. No asterisk. No fine print.

Regulars and group admins: use it, vote, share it. You are not selling anything. You are handing neighbors a ballot.

Not a city app. A Milo Maps module — same family as Amber Trails.

https://parks.milomaps.com`;
