# Milo Maps · Civic Parks

Gift module for Kaukauna Dog Park and the Fox Valley.

Canonical public address: **https://parks.milomaps.com**

Live now (same app, until the name is attached): **https://milomaps-parks.netlify.app**

This does **not** replace [milomaps.com](https://milomaps.com) (Amber Trails). Civic Parks is a sibling module.

## What neighbors get

- Check in at 366 Farmland Court
- Vote on lighting, uneven ground, and access
- PawSteps (no purchase required)
- Sponsor packages record **intent only** — Stripe is not connected, cards are not charged
- Public split when money does flow: **80% park / 15% operate / 5% steward**

Neighbors never pay.

## Attach parks.milomaps.com

The same two edits are on the Park tab in the app. `milomaps.com` DNS stays on Cloudflare. **Do not change nameservers, apex, or `www`.** Those are Amber Trails.

`parks.milomaps.com` already has a Cloudflare record, but it is **proxied (orange cloud) to Amber Trails**. Civic Parks is not attached on Netlify yet.

Netlify cannot issue HTTPS while Cloudflare proxy is on. Use **DNS only (grey cloud)**. Do not move the zone to Netlify DNS.

Two edits. Nothing else.

1. Cloudflare → milomaps.com → DNS → **edit** the existing `parks` record (do not add a second one):

| Type  | Name  | Target                       | Proxy status          |
| ----- | ----- | ---------------------------- | --------------------- |
| CNAME | parks | `milomaps-parks.netlify.app` | DNS only (grey cloud) |

Click the orange cloud so it turns grey. Save. Leave `@` and `www` alone.

2. [Netlify → milomaps-parks → Domain management](https://app.netlify.com/projects/milomaps-parks/domain-management) → Add domain `parks.milomaps.com`.

If Netlify asks for a TXT check, add this and retry:

| Type | Name                      | Content (Netlify’s value) |
| ---- | ------------------------- | ------------------------- |
| TXT  | `netlify-challenge.parks` | the string they show      |

Wait until `https://parks.milomaps.com` loads Civic Parks (Kaukauna, PawSteps, 80 / 15 / 5). Then the Facebook gift can go out.

Do **not** turn the Cloudflare proxy (orange cloud) back on until that page is Civic Parks with a working lock.
