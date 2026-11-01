# rebar.dk

Placeholder page served by GitHub Pages at https://rebar.dk: the text "rebar.dk" centred on a dark background. It's a single `index.html` with no build step. Push to `main` to deploy.

The Vue source of the earlier site lives in the separate `SebastianFlo/rebar.dk` repo.

## DNS

Cloudflare, **proxied** (orange cloud): four `A` records for `@` pointing at `185.199.108–111.153`, and `www` as a `CNAME` to `sebastianflo.github.io`. The `_github-pages-challenge-SebastianFlo` TXT record verifies the domain on GitHub. The one.com MX records and the Google verification TXT record handle email and Search Console and are unrelated to the site.

## HTTPS

Cloudflare terminates HTTPS with its own edge certificate. GitHub never managed to issue its Let's Encrypt certificate for this domain (it stayed at `authorization_created` for 13+ hours), so HTTPS-only is off on GitHub and enforced by Cloudflare instead:

- SSL/TLS mode must be **Full** or **Flexible**. "Full (strict)" fails with error 526, because GitHub presents its `*.github.io` certificate to Cloudflare.
- **Always Use HTTPS** is on.
- The custom domain must stay set in the repo's Pages settings (`CNAME` file), or GitHub won't serve the site for the `rebar.dk` host.
