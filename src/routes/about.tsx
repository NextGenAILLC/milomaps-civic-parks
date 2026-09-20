import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";
import { PRODUCT, PUBLIC_SPLIT } from "@/lib/product";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <LegalLayout title="Neighbor-run Civic Parks">
      <p>
        Civic Parks on{" "}
        <a className="text-fg underline" href={PRODUCT.canonical}>
          milomaps.org
        </a>{" "}
        is a neighbor board and open ballot for park regulars — starting with Kaukauna Dog Park.
        It is not a city app and does not need city approval to collect community signal.
      </p>
      <p>
        Neighbors never pay to check in or vote. Stripe is not connected. Banks, credit unions, and
        other sponsors stay grey prospects until they opt in as a transparent custodian for a
        specific park project. Sponsor and community money is never held by a private individual
        operator.
      </p>
      <p>
        If real sponsor money is later recorded, the split is {PUBLIC_SPLIT.park}% park /{" "}
        {PUBLIC_SPLIT.operate}% operate / {PUBLIC_SPLIT.steward}% steward reserve.
      </p>
      <p>
        Operator tools stay behind a password on{" "}
        <a className="text-fg underline" href="/admin">
          /admin
        </a>
        . No operator email, phone, or inbox is shown on the public board.
      </p>
    </LegalLayout>
  );
}
