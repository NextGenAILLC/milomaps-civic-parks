import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";
import { PRODUCT, PUBLIC_SPLIT } from "@/lib/product";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <LegalLayout title="Terms">
      <p>
        Civic Parks is a public-beta module of {PRODUCT.brand} at {PRODUCT.canonical}. It is not an
        official government service, not a city app, and not a claim of city approval.
      </p>
      <p>
        {PRODUCT.token} are in-app credits, not money. Sponsor packages record intent only. Stripe
        is not connected and no payment is processed here. Neighbors are not charged.
      </p>
      <p>
        Sponsor and community money is never held by a private individual operator. Real park or
        shelter project funds require a sponsoring bank, credit union, or designated shelter partner
        that has opted in as transparent custodian. If real sponsor money is recorded,{" "}
        {PUBLIC_SPLIT.park}% is park work, {PUBLIC_SPLIT.operate}% operate, and{" "}
        {PUBLIC_SPLIT.steward}% steward reserve.
      </p>
      <p>Follow posted park rules. Do not trespass. Do not post other people’s private data.</p>
    </LegalLayout>
  );
}
