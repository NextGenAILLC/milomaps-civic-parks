import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";
import { LaunchNameCard } from "@/components/launch-name";
import { PRODUCT, PUBLIC_SPLIT } from "@/lib/product";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <LegalLayout title="Neighbor-run Civic Parks">
      <p>
        {PRODUCT.brand} is the parent. {PRODUCT.parentProduct} lives at{" "}
        <a className="text-fg underline" href={PRODUCT.parentUrl}>
          milomaps.com
        </a>
        . Civic Parks is the neighbor-board and park-ballot module at{" "}
        <a className="text-fg underline" href={PRODUCT.canonical}>
          milomaps.org
        </a>
        . parks.milomaps.com may still point here as an alternate host.
      </p>
      <LaunchNameCard />
      <p>
        The public posture is simple: not a city app, no city approval required to collect
        community signal, and no personal operator identity as the public face.
      </p>
      <p>
        Neighbors never pay to check in or vote. Stripe is not connected. Sponsor and community
        money is never held by a private individual operator; real project funds require a bank,
        credit union, or designated shelter partner as transparent custodian.
      </p>
      <p>
        If real sponsor money is recorded, the split is {PUBLIC_SPLIT.park}% park /{" "}
        {PUBLIC_SPLIT.operate}% operate / {PUBLIC_SPLIT.steward}% steward reserve.
      </p>
    </LegalLayout>
  );
}