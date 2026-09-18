import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <LegalLayout title="Privacy">
      <p>
        Check-ins, votes, notes, concepts, and package intent stay in your browser for the live
        PawSteps experience. The app also makes a best-effort sync of display handles and activity
        summaries so the password-protected admin view can monitor participation and vote tallies.
      </p>
      <p>
        Location is optional and used only to measure distance to the selected park. Coordinates are
        not stored and not uploaded.
      </p>
      <p>
        Stripe is not connected here. There is no checkout and no card data is collected by this
        module. Sponsor or community money must use a true bank, credit union, or shelter partner
        custodian before any real project funding is represented as active.
      </p>
      <p>Children under 13 should not use this module.</p>
    </LegalLayout>
  );
}
