# Milo Maps · Civic Parks

Gift module for Kaukauna Dog Park and the Fox Valley.

Canonical public address: **https://parks.milomaps.com**

Live now (same app, temporary host until the name is attached): **https://milomaps-parks.netlify.app**

This does **not** replace [milomaps.com](https://milomaps.com) (Amber Trails). Civic Parks is a sibling module.

## What neighbors get

- Check in at 366 Farmland Court
- Vote on lighting, uneven ground, and access
- PawSteps (no purchase required)
- Sponsor packages record **intent only** — Stripe is not connected, cards are not charged
- Public split when money does flow: **80% park / 15% operate / 5% steward**

Neighbors never pay.

## Attach parks.milomaps.com

DNS for `milomaps.com` is on Cloudflare. `www` already points at Vercel (Amber Trails). `parks` has no record yet.

**Do not change the apex or `www`.** Two small steps:

1. Cloudflare → milomaps.com → DNS → Add record:

| Type  | Name  | Target                         | Proxy    |
| ----- | ----- | ------------------------------ | -------- |
| CNAME | parks | `milomaps-parks.netlify.app`   | DNS only |

2. [Netlify → milomaps-parks → Domain management](https://app.netlify.com/projects/milomaps-parks/domain-management) → Add domain `parks.milomaps.com`.

Leave Amber Trails on `milomaps.com` / `www.milomaps.com`.

Do not post the Facebook gift until `https://parks.milomaps.com` loads Civic Parks.
