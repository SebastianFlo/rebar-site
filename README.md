# rebar.dk

Danish landing page for rebar, an AI service that turns hand-drawn building plans into CAD files. Served by GitHub Pages at https://rebar.dk. No build step: push to `main` to deploy.

## How the page works

The page is drawn twice. The hand-drawn layer (`.layer--sketch`) is the real page. `lens.js` clones it into a CAD layer (`.layer--cad`) stacked on top and clipped to a circle around the mouse pointer. The **Vis som CAD** / **Show as CAD** button grows that circle over the whole page, for touch screens and keyboard users. Without JavaScript, visitors see the sketch layer only.

The site is in Danish (`/`, the default) and English (`/en/`). The two pages link to each other via the language switch in the header and declare each other with `hreflang`. There's no automatic redirect based on browser language.

| File | Contents |
|---|---|
| `index.html` | Danish page. |
| `en/index.html` | English page. Same markup as the Danish page with translated text; assets are referenced with `../`. |
| `plan.svg` | Floor plan geometry shared by both pages and both layers (`<use href="plan.svg#g-…">`), so the drawings line up exactly. |
| `styles.css` | Shared layout, then the sketch styles, then the CAD styles, then the lens. |
| `lens.js` | Clones the layer, equalises text block heights between the two fonts, and tracks the pointer. Toggle button labels come from its `data-label-cad` / `data-label-sketch` attributes. |
| `fonts/` | Self-hosted Architects Daughter (sketch) and JetBrains Mono (CAD), both under the SIL Open Font License. Self-hosted rather than loaded from Google Fonts, to avoid sending visitor IP addresses to Google. |

When editing:

- Change content in **both** `index.html` and `en/index.html`, and keep their structure identical. The CAD layer is generated from each page.
- Layer-specific extras must not affect layout. Use `.sketch-only` / `.cad-only` with absolute positioning, or pseudo-elements. Otherwise the layers drift apart vertically.
- The plan is drawn in centimetres (12 × 8 m flat). Room labels, areas and dimension texts are in each page (Danish `6.500` / `32,5 m²`, English `6500` / `32.5 m²`) and must match the geometry in `plan.svg`.

The Vue source of the earlier site lives in the separate `SebastianFlo/rebar.dk` repo.

## DNS

Cloudflare, **proxied** (orange cloud): four `A` records for `@` pointing at `185.199.108–111.153`, and `www` as a `CNAME` to `sebastianflo.github.io`. The `_github-pages-challenge-SebastianFlo` TXT record verifies the domain on GitHub. The Google verification TXT record is for Search Console.

## Email

`kontakt@rebar.dk` is handled by Cloudflare Email Routing, which forwards it to a personal inbox (Cloudflare dashboard → rebar.dk → Email → Email Routing). Cloudflare manages the MX records (`route1/2/3.mx.cloudflare.net`), the SPF record and the DKIM record; don't edit them by hand. Email Routing only receives: replies go out from the destination inbox.

## HTTPS

Cloudflare terminates HTTPS with its own edge certificate. GitHub never managed to issue its Let's Encrypt certificate for this domain (it stayed at `authorization_created` for 13+ hours), so HTTPS-only is off on GitHub and enforced by Cloudflare instead:

- SSL/TLS mode must be **Full** or **Flexible**. "Full (strict)" fails with error 526, because GitHub presents its `*.github.io` certificate to Cloudflare.
- **Always Use HTTPS** is on.
- The custom domain must stay set in the repo's Pages settings (`CNAME` file), or GitHub won't serve the site for the `rebar.dk` host.
