import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";
import { PRODUCT } from "@/lib/product";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <LegalLayout title="Privacy">
      <p>
        Check-ins, votes, notes, and pledge intent stay in your browser on this solo build. They are
        not sent to {PRODUCT.brand} servers from this module.
      </p>
      <p>
        Location is optional and used only to measure distance to the selected park. Coordinates are
        not stored and not uploaded.
      </p>
      <p>
        When Stripe is connected, card data stays with Stripe. We would only receive payment
        confirmation, amount, and package — not a full card number. Children under 13 should not use
        this module.
      </p>
    </LegalLayout>
  );
}
