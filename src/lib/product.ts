export const PRODUCT = {
  brand: "Milo Maps",
  module: "civic-parks",
  moduleName: "Civic Parks",
  version: "1.1.0",
  schema: "milomaps.civic.v1",
  token: "PawSteps",
  canonical: "https://parks.milomaps.com",
  liveNow: "https://milomaps-parks.netlify.app",
  parentUrl: "https://milomaps.com",
  parentWww: "https://www.milomaps.com",
  parentProduct: "Amber Trails",
  storyUrl: "https://milomaps.com/story",
  mapUrl: "https://milomaps.com/map",
  partnerUrl: "https://milomaps.com/pioneer",
  netlifyDomains: "https://app.netlify.com/projects/milomaps-parks/domain-management",
  netlifyVisibility:
    "https://app.netlify.com/projects/milomaps-parks/configuration/general#project-visibility",
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

export const DOMAIN_LAUNCH = {
  canonicalHost: "parks.milomaps.com",
  liveHost: "milomaps-parks.netlify.app",
  statusUntilAttached:
    "Civic Parks is built. Three clicks from here: make the live host public, then attach the name. parks.milomaps.com still loads Amber Trails until DNS is edited.",
  statusAttached: "parks.milomaps.com is Civic Parks. Amber Trails stays on milomaps.com.",
  stepPublic: {
    n: "1",
    title: "Netlify — make the live host public",
    where: "Netlify → milomaps-parks → Project configuration → General → Visitor access → Project visibility → Public",
    href: "https://app.netlify.com/projects/milomaps-parks/configuration/general#project-visibility",
    why: "The live module is behind a Netlify team login until this is Public. Neighbors cannot open milomaps-parks.netlify.app without it.",
  },
  step1: {
    n: "2",
    title: "Cloudflare",
    where: "Cloudflare → milomaps.com → DNS → Edit the existing parks record. Do not add a second one.",
    type: "CNAME",
    name: "parks",
    target: "milomaps-parks.netlify.app",
    proxy: "DNS only (grey cloud)",
    proxyHow: "Click the orange cloud so it turns grey. Leave it grey until Civic Parks loads with a lock.",
  },
  step2: {
    n: "3",
    title: "Netlify",
    where: "Netlify → milomaps-parks → Domain management → Add domain parks.milomaps.com",
    domain: "parks.milomaps.com",
    href: "https://app.netlify.com/projects/milomaps-parks/domain-management",
    txtType: "TXT",
    txtName: "netlify-challenge.parks",
    txtHint: "Only if Netlify asks — paste the string they show.",
  },
  leaveAlone: [
    { name: "@ / milomaps.com", reason: "Amber Trails apex — do not change" },
    { name: "www", reason: "Amber Trails on Vercel — do not change" },
    { name: "Nameservers", reason: "Stay on Cloudflare. Do not move the zone to Netlify." },
  ],
  doNot: [
    "Do not post the Facebook gift until parks.milomaps.com loads Civic Parks — Kaukauna, PawSteps, 80 / 15 / 5, Stripe off.",
    "Do not leave the parks cloud orange while attaching. Grey first.",
    "Stripe stays off. Neighbors still never pay.",
  ],
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
