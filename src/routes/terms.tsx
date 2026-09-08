import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";
import { PRODUCT, PUBLIC_SPLIT } from "@/lib/product";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <LegalLayout title="Terms">
      <p>
        Civic Parks is a public-beta module of {PRODUCT.brand} at {PRODUCT.canonical}. It is not an
        official government service.
      </p>
      <p>
        {PRODUCT.token} are in-app credits, not money. Sponsor packages record intent. Stripe is not
        connected. No payment is processed here. When Stripe is live, {PUBLIC_SPLIT.park}% is park
        capital, {PUBLIC_SPLIT.operate}% operate, {PUBLIC_SPLIT.steward}% steward. Neighbors are not
        charged.
      </p>
      <p>Follow posted park rules. Do not trespass. Do not post other people’s private data.</p>
    </LegalLayout>
  );
}
