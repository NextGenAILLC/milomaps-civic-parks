# Milo Maps · Civic Parks

Gift module for Kaukauna Dog Park and the Fox Valley.

Canonical public address: **https://parks.milomaps.com**

This does **not** replace [milomaps.com](https://milomaps.com) (Amber Trails). Civic Parks is a sibling module.

## What neighbors get

- Check in at 366 Farmland Court
- Vote on lighting, uneven ground, and access
- PawSteps (no purchase required)
- Sponsor packages record **intent only** — Stripe is not connected, cards are not charged
- Public split when money does flow: **80% park / 15% operate / 5% steward**

Neighbors never pay.

## Go live (parks.milomaps.com)

DNS for `milomaps.com` is on Cloudflare. `www` already points at Vercel. `parks` has no record yet.

**Do not change the apex or `www`.** Add one record:

| Type  | Name  | Target                | Proxy        |
| ----- | ----- | --------------------- | ------------ |
| CNAME | parks | `cname.vercel-dns.com` | DNS only     |

Then in the Vercel project **milomaps-parks**, add domain `parks.milomaps.com`.

Leave Amber Trails on `milomaps.com` / `www.milomaps.com`.
