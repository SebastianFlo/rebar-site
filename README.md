# rebar.dk

Danish landing page for rebar, an AI service that turns hand-drawn building plans into CAD files. Served by GitHub Pages at https://rebar.dk. No build step: push to `main` to deploy.

## How the page works

The page is drawn twice. The hand-drawn layer (`.layer--sketch`) is the real page. `lens.js` clones it into a CAD layer (`.layer--cad`) stacked on top and clipped to a circle around the mouse pointer. The **Vis som CAD** button grows that circle over the whole page, for touch screens and keyboard users. Without JavaScript, visitors see the sketch layer only.

| File | Contents |
|---|---|
| `index.html` | Content (Danish) and the shared plan geometry in `<defs>`. Both layers `<use>` the same geometry, so the drawings line up exactly. |
| `styles.css` | Shared layout, then the sketch styles, then the CAD styles, then the lens. |
| `lens.js` | Clones the layer, equalises text block heights between the two fonts, and tracks the pointer. |
| `fonts/` | Self-hosted Architects Daughter (sketch) and JetBrains Mono (CAD), both under the SIL Open Font License. Self-hosted rather than loaded from Google Fonts, to avoid sending visitor IP addresses to Google. |

When editing:

- Change content only in `index.html`. The CAD layer is generated from it.
- Layer-specific extras must not affect layout. Use `.sketch-only` / `.cad-only` with absolute positioning, or pseudo-elements. Otherwise the layers drift apart vertically.
- The plan is drawn in centimetres (12 × 8 m flat). Dimension texts in the CAD layer are hard-coded and must match the geometry.

The Vue source of the earlier site lives in the separate `SebastianFlo/rebar.dk` repo.

## DNS

Cloudflare, **proxied** (orange cloud): four `A` records for `@` pointing at `185.199.108–111.153`, and `www` as a `CNAME` to `sebastianflo.github.io`. The `_github-pages-challenge-SebastianFlo` TXT record verifies the domain on GitHub. The one.com MX records and the Google verification TXT record handle email and Search Console and are unrelated to the site.

## HTTPS

Cloudflare terminates HTTPS with its own edge certificate. GitHub never managed to issue its Let's Encrypt certificate for this domain (it stayed at `authorization_created` for 13+ hours), so HTTPS-only is off on GitHub and enforced by Cloudflare instead:

- SSL/TLS mode must be **Full** or **Flexible**. "Full (strict)" fails with error 526, because GitHub presents its `*.github.io` certificate to Cloudflare.
- **Always Use HTTPS** is on.
- The custom domain must stay set in the repo's Pages settings (`CNAME` file), or GitHub won't serve the site for the `rebar.dk` host.
