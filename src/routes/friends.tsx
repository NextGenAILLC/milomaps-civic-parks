import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LegalLayout } from "@/components/legal-layout";
import { copyNeighborPost } from "@/components/views-shared";
import { NEIGHBOR_POST, PRODUCT } from "@/lib/product";

const FRIENDS_TITLE = "Friends of Kaukauna Dog Park";
const FRIENDS_DESCRIPTION =
  "Warm invite to the neighbor-run Civic Parks board at milomaps.org — check in, earn PawSteps, vote on lighting and access. Not a city app. Free for neighbors.";

export const Route = createFileRoute("/friends")({
  head: () => ({
    meta: [
      { title: `${FRIENDS_TITLE} · ${PRODUCT.brand}` },
      { name: "description", content: FRIENDS_DESCRIPTION },
      { property: "og:title", content: FRIENDS_TITLE },
      { property: "og:description", content: FRIENDS_DESCRIPTION },
      { property: "og:url", content: `${PRODUCT.canonical}/friends` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: FRIENDS_TITLE },
      { name: "twitter:description", content: FRIENDS_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: `${PRODUCT.canonical}/friends` }],
  }),
  component: FriendsPage,
});

function FriendsPage() {
  return (
    <LegalLayout title={FRIENDS_TITLE}>
      <p className="text-base text-fg">
        Hey neighbors — if you walk Kaukauna Dog Park with your dog, this board is for you.
      </p>
      <p>
        Civic Parks on{" "}
        <a className="font-medium text-fg underline" href={PRODUCT.canonical}>
          milomaps.org
        </a>{" "}
        is a neighbor-run open ballot: check in, earn {PRODUCT.token}, and vote on lighting, ground,
        access, seating, and winter routes. Friends of Kaukauna Dog Park energy — regulars name the
        issues and keep the park free.
      </p>
      <p>
        It is <span className="font-medium text-fg">not</span> a city app and does not need city
        approval to collect community signal. Nobody pays to vote or check in. Stripe is off.
        Sponsors stay grey prospects until a real bank, credit union, or shelter partner opts in as
        custodian. No public admin email.
      </p>

      <Card className="border-primary">
        <CardHeader>
          <CardTitle className="text-lg">Open the Civic Parks board</CardTitle>
          <CardDescription>
            This product lives at milomaps.org — not milomaps.com (Amber Trails stays separate).
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <a
            href={PRODUCT.canonical}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-4 text-base font-medium text-primary-fg"
          >
            Go to milomaps.org
          </a>
          <Link
            to="/"
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-border bg-surface px-4 text-sm font-medium text-fg"
          >
            Open board on this device
          </Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Paste to Facebook</CardTitle>
          <CardDescription>Warm copy ready for a group post or story.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <pre className="whitespace-pre-wrap rounded-md border border-border bg-bg p-3 text-sm text-muted">
            {NEIGHBOR_POST}
          </pre>
          <Button className="h-11 w-full" onClick={copyNeighborPost}>
            Copy Facebook-ready post
          </Button>
          <p className="text-xs text-subtle">
            Prefer this share page in the link preview? Use{" "}
            <span className="font-medium text-fg">{PRODUCT.canonical}/friends</span>.
          </p>
        </CardContent>
      </Card>

      <p className="text-xs text-subtle">
        Neighbor board · not city hall · sponsors grey until true opt-in ·{" "}
        <Link to="/about" className="underline">
          About
        </Link>
        {" · "}
        <Link to="/transparency" className="underline">
          Transparency
        </Link>
      </p>
    </LegalLayout>
  );
}
