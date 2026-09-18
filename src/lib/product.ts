export const PRODUCT = {
  brand: "Milo Maps",
  module: "civic-parks",
  moduleName: "Civic Parks",
  version: "1.3.0",
  schema: "milomaps.civic.v1",
  token: "PawSteps",
  canonical: "https://milomaps.org",
  parksHost: "https://parks.milomaps.com",
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
  payments: "custodian-sponsor-only",
} as const;

export const FAMILY = [
  { label: "Civic Parks", href: "https://milomaps.org", here: true },
  { label: "Parks host", href: "https://parks.milomaps.com", here: false },
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
  stewardLabel: "Steward reserve",
  rule:
    "Neighbors never pay to check in or vote. Stripe is not connected. Real sponsor/community money only moves after a bank, credit union, or designated shelter partner opts in as the transparent custodian for a park project.",
} as const;

export const DOMAIN_LAUNCH = {
  canonicalHost: "milomaps.org",
  alternateHost: "parks.milomaps.com",
  liveHost: "milomaps-parks.netlify.app",
  statusUntilAttached:
    "Civic Parks is public at milomaps.org. parks.milomaps.com can keep pointing here too; Amber Trails stays on milomaps.com.",
  statusAttached: "This host is Civic Parks. Amber Trails stays on milomaps.com.",
  liveRows: [
    {
      address: "milomaps.org",
      loads: "Canonical Civic Parks host — neighbor board, open ballot, no checkout",
      href: "https://milomaps.org",
    },
    {
      address: "milomaps-parks.netlify.app",
      loads: "Netlify project host for the same app",
      href: "https://milomaps-parks.netlify.app",
    },
    {
      address: "parks.milomaps.com",
      loads: "May still exist as an alternate Civic Parks host",
      href: "https://parks.milomaps.com",
    },
    {
      address: "milomaps.com / www",
      loads: "Amber Trails — untouched. Do not change.",
      href: "https://www.milomaps.com",
    },
  ],
  stepPublic: {
    n: "1",
    title: "Keep Netlify visitor access public",
    where: "Netlify -> milomaps-parks -> Project configuration -> General -> Visitor access -> Project visibility -> Public",
    href: "https://app.netlify.com/projects/milomaps-parks/configuration/general#project-visibility",
    why: "Neighbors need the ballot without a team login.",
    locked:
      "If Public is locked: Team settings -> General -> Visitor access -> Default project visibility. Turn off 'Private for all projects,' then set this project to Public.",
  },
  step1: {
    n: "2",
    title: "Optional alternate host: parks.milomaps.com",
    where: "Cloudflare -> milomaps.com -> DNS -> parks can point to this Netlify app. Leave @ and www alone.",
    type: "CNAME",
    name: "parks",
    target: "milomaps-parks.netlify.app",
    proxy: "DNS only (grey cloud)",
    proxyHow:
      "Click the orange cloud so it turns grey. Orange in front of Netlify blocks their HTTPS certificate. Grey first. Orange later only after Civic Parks loads with a lock.",
  },
  step2: {
    n: "3",
    title: "Netlify domain list",
    where: "Netlify -> milomaps-parks -> Domain management should include milomaps.org and may include parks.milomaps.com.",
    domain: "parks.milomaps.com",
    href: "https://app.netlify.com/projects/milomaps-parks/domain-management",
    txtType: "TXT",
    txtName: "netlify-challenge.parks",
    txtHint: "Only if Netlify asks — paste the string they show as the content.",
  },
  leaveAlone: [
    { name: "@ / milomaps.com", reason: "Amber Trails apex — do not change" },
    { name: "www", reason: "Amber Trails on Vercel — do not change" },
    { name: "Nameservers", reason: "Stay on Cloudflare. Do not move the zone to Netlify." },
  ],
  doNot: [
    "Do not frame Civic Parks as a city app or imply city approval is required.",
    "Do not claim payments are live while Stripe is not connected.",
    "Do not route sponsor or community money through a private individual operator.",
  ],
} as const;

export const NEIGHBOR_POST = `Kaukauna Dog Park neighbors —

Civic Parks is a neighbor-run board for the park regulars: check in, earn PawSteps, and vote on the fixes that matter first.

It is not a city app and it does not need city approval to collect community signal. It is an open ballot in the style of Friends of Kaukauna Dog Park: regulars name the issues, vote in public, and keep the park free.

Nobody pays to vote or check in. There is no checkout here and Stripe is not connected.

If a true sponsor later funds a project, the money path has to be visible:

80% park work
15% keep the tool running
5% steward reserve

Sponsor and community money is never held by a private individual operator. It routes only through a bank, credit union, or designated shelter partner that opts in as a transparent custodian for the specific park project.

Use it, vote, and share the board. You are not selling anything. You are handing neighbors a ballot.

https://milomaps.org`;
