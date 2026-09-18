import { createFileRoute, Link } from "@tanstack/react-router";
import { SplitCard } from "@/components/views";
import { LegalLayout } from "@/components/legal-layout";
import { PRODUCT, PUBLIC_SPLIT } from "@/lib/product";

export const Route = createFileRoute("/transparency")({ component: Transparency });

function Transparency() {
  return (
    <LegalLayout title="Transparency and money path">
      <p>
        Civic Parks is a neighbor-run board and open ballot for Kaukauna Dog Park and nearby Fox
        Valley dog park improvements. It is not a city app, does not imply city approval, and does
        not require city approval to collect community signal.
      </p>
      <p>
        Sponsor and community money is <span className="font-medium text-fg">never</span> held by a
        private individual operator. Funds for park or shelter improvements route only through a
        sponsoring bank or credit union, or a designated shelter partner, after that organization
        opts in as a true sponsor.
      </p>
      <p>
        A true custodian sponsor acts as the transparent escrow/custody path for a specific park
        project. Until one opts in, the sponsor board shows the model in plain language and keeps
        prospects grey.
      </p>
      <p>
        Stripe is not connected here. There is no live checkout and no live payment wire. Neighbors
        still pay $0 to check in, earn {PRODUCT.token}, or vote.
      </p>
      <SplitCard />
      <p>
        If real sponsor dollars are recorded, the public split remains {PUBLIC_SPLIT.park}% park /{" "}
        {PUBLIC_SPLIT.operate}% operate / {PUBLIC_SPLIT.steward}% steward reserve, shown on the
        page instead of hidden in fine print.
      </p>
      <Link to="/" className="font-medium text-fg underline">
        Back to the park ballot
      </Link>
    </LegalLayout>
  );
}
