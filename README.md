# Milo Maps · Civic Parks

Neighbor-run Civic Parks board for Kaukauna Dog Park / Fox Valley Friends of the Dog Park style organizing.

Canonical public address: **https://milomaps.org**

Alternate host that may still exist: **https://parks.milomaps.com**

Netlify project host: **https://milomaps-parks.netlify.app**

This does **not** replace [milomaps.com](https://milomaps.com) (Amber Trails). Civic Parks is a sibling module.

## What neighbors get

- Check in at 366 Farmland Court
- Vote on lighting, uneven ground, and access
- PawSteps (no purchase required)
- A clear neighbor board + open ballot for an effectively ungoverned day-to-day park
- Public copy that says this is **not a city app** and does **not** require city approval to collect community signal
- Sponsor packages record **intent only** - Stripe is not connected, cards are not charged
- Public split if real sponsor money is recorded: **80% park / 15% operate / 5% steward reserve**

Neighbors never pay.

## Transparency / money path

- Sponsor and community money is **never held by a private individual operator**.
- Funds for park/shelter improvements route only through a sponsoring bank or credit union, or a designated shelter partner, that opts in as a true sponsor.
- That sponsor acts as transparent custodian/escrow for the specific park project.
- Until a bank/CU/shelter partner sponsor exists, the app shows the model in plain language and does not pretend live payment wires exist.
- Grey sponsor cards are prospects only. Color sponsor cards require admin to mark the sponsor **paid + active**.

Public route: `/transparency`

## Sponsors

Seeded prospects include Fox Valley banks, credit unions, vets, and local pet businesses. They are data-driven in `src/lib/data.ts` and seeded into `migrations/0001_civic_parks.sql`.

Categories:

- `bank`
- `credit_union`
- `veterinary`
- `other`

True sponsors get a public showcase at `/sponsors/$sponsorId`. Prospect routes stay muted and clearly labeled as not paid.

Google Places can be wired later as an optional enhancement if an API key is present; the seed list is enough for v1.

## Admin

Route: `/admin`

Required env var:

- `ADMIN_PASSWORD` - server-side password for the operator admin route.

Recommended env var for durable deploy data:

- `DATABASE_URL` - Postgres connection string used by the existing `src/lib/db.ts` helper. Without it, local/preview runs use the existing in-memory PGLite fallback.

Admin can:

- See synced participants, check-ins, activity, and vote tallies
- List sponsors
- Toggle a prospect into a true sponsor by marking it paid + active
- Mark custodian sponsors
- Edit sponsor website, public note, and showcase copy

No personal operator phone, email, or name is published by the public app.

## Domains

`milomaps.org` is canonical. `parks.milomaps.com` may still exist and should continue to work as an alternate Civic Parks host. Do not break either host.

`milomaps.com` and `www.milomaps.com` remain Amber Trails.
