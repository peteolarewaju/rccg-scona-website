# Deploying & maintaining this site

Everything you need to take over the RCCG Solution Center parish website.
No build tools, no frameworks — it is plain HTML, CSS, and JavaScript.

---

## Read this first: the one thing that breaks deploys

**The website is not at the root of this repository. It lives in the `site/` folder.**

```
rccg-scona-website/
├── site/                 ← THE WEBSITE. index.html is in here.
│   ├── index.html
│   ├── about.html  watch.html  give.html  food-pantry.html  contact.html
│   ├── css/  js/  images/
├── netlify/functions/    ← serverless function (recent service videos)
├── netlify.toml          ← tells Netlify to publish site/
├── DEPLOYMENT.md  README.md
```

If Netlify publishes the **repo root**, visitors get **"Page not found"** on every
page — because there is no `index.html` at the root. This is the single most
common way this site breaks. The fix is always the same: make sure Netlify's
**publish directory is `site`**.

---

## Recommended: connect the repo to Netlify (deploys happen automatically)

Set this up once, and every push to `main` publishes the site by itself. This is
the best option for handover — nothing to drag, no folder mistakes possible, and
the recent-services function works.

1. Sign in at [app.netlify.com](https://app.netlify.com).
2. **Add new site → Import an existing project → Deploy with GitHub.**
3. Authorize Netlify to access GitHub, then pick the `rccg-scona-website` repo.
4. On the build settings screen, confirm these values. `netlify.toml` should fill
   them in automatically — if any field is blank or different, set it manually:

   | Setting | Value |
   |---|---|
   | Base directory | *(leave empty)* |
   | Build command | *(leave empty)* |
   | **Publish directory** | **`site`** |
   | Functions directory | `netlify/functions` |

5. Click **Deploy**. In under a minute you get a live URL like
   `random-name-123.netlify.app`.
6. Rename it to something sensible under **Domain management → Options →
   Edit site name** (e.g. `rccg-scona`).

**To verify it worked:** open the site and check that (a) the home page loads —
not "Page not found", (b) the Contact page shows the map, and (c) the Watch page
lists recent services.

### After that, updating the site is just:

```bash
git add -A
git commit -m "Describe the change"
git push
```

Netlify rebuilds and publishes within a minute. No other steps.

---

## Alternative: manual drag-and-drop

Only use this if you are not connecting the repo to Git. **Netlify Drop ignores
`netlify.toml`** — it publishes exactly the folder you drop, which is why
dropping the repo root fails.

- Drag **the `site` folder** onto [app.netlify.com/drop](https://app.netlify.com/drop).
- Do **not** drag the repo root, the repo `.zip` from GitHub, or the parent folder.

**Trade-off:** drag-and-drop does not deploy the serverless function, so the
Watch page falls back to its built-in list of videos instead of pulling the
newest ones from YouTube automatically. Everything else works normally.

---

## Alternative: deploy from a terminal

```bash
npm install -g netlify-cli
netlify login
netlify link          # pick the existing site, once
netlify deploy --prod # reads netlify.toml, so no flags needed
```

Run this from the repo root, not from inside `site/`.

---

## How the site keeps itself up to date

Two things update on their own. Neither needs manual editing when a new service
is posted:

- **Home page video** — embeds the church's YouTube uploads playlist, which
  always starts at the newest upload.
- **Watch page "Recent Services"** — [`netlify/functions/recent-videos.mjs`](netlify/functions/recent-videos.mjs)
  reads the channel's RSS feed on the server (the browser cannot read it
  directly — the feed sends no CORS headers), tidies the ALL-CAPS titles, and
  serves it as JSON. [`site/js/recent-videos.js`](site/js/recent-videos.js)
  renders it when the page loads.

The Watch page also has a **live-stream detector**
([`site/js/live-check.js`](site/js/live-check.js)): it hides the player when the
church is offline (YouTube otherwise shows an ugly "video unavailable" box) and
reveals it automatically, checking every 60 seconds, once a Sunday service goes
live.

If the function is ever unavailable, the Watch page quietly falls back to the
video tiles written into `site/watch.html`. The site never appears broken.

**Channel ID:** `UCzvTHbLCrNOadRYDHbtL59g` (RCCG SCONA TV). If the parish ever
changes YouTube channels, update it in `netlify/functions/recent-videos.mjs`,
`site/js/live-check.js`, and the playlist embed in `site/index.html`.

---

## Editing common content

| What | Where |
|---|---|
| Service times | `site/index.html` (schedule cards), `site/contact.html`, and the footer of every page |
| Recurring events | `site/index.html` — the `event-item` blocks |
| Giving details | `site/give.html`, plus the summary on `site/index.html` |
| Contact info / map | `site/contact.html` |
| Food pantry | `site/food-pantry.html` |
| Pastor photo | replace `site/images/pastor.jpg` |
| Colours & fonts | the variables at the top of `site/css/style.css` |

Service times and the church address appear in the footer of **all six pages** —
search across `site/*.html` when they change so no page is left stale.

---

## Previewing locally before publishing

```bash
cd site && python3 -m http.server 8000
```

Then open `http://localhost:8000`. The YouTube and map embeds behave better over
`http://` than by double-clicking the files.

Note: the recent-services function does **not** run under a plain HTTP server,
so the Watch page shows its fallback tiles locally. To test the function too,
run `netlify dev` from the repo root instead.

---

## Custom domain

When the parish has its own domain (e.g. `rccgsolutioncenter.org`), add it under
**Domain management → Add a domain** and follow the DNS instructions. Netlify
issues the HTTPS certificate free and renews it automatically.
