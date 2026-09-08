import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";
import { PRODUCT, PUBLIC_SPLIT } from "@/lib/product";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <LegalLayout title="Same map, one more chapter">
      <p>
        {PRODUCT.brand} is the parent. {PRODUCT.parentProduct} lives at{" "}
        <a className="text-fg underline" href={PRODUCT.parentUrl}>
          milomaps.com
        </a>
        . Civic Parks is the park-ballot module at{" "}
        <a className="text-fg underline" href={PRODUCT.canonical}>
          parks.milomaps.com
        </a>
        . Same brand. Same tokens. Built to merge.
      </p>
      <p>
        Neighbors never pay. Stripe is not connected on this beta. Sponsor packages record intent
        only. When real sponsor money is collected, it splits {PUBLIC_SPLIT.park}% park /{" "}
        {PUBLIC_SPLIT.operate}% operate / {PUBLIC_SPLIT.steward}% steward — on the page, not in a
        footnote.
      </p>
      <p>Not a city app. Votes are community signal.</p>
    </LegalLayout>
  );
}
