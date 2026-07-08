# RCCG Solution Center For All Nations — Parish Website

A six-page website for a real Indianapolis church parish (The Redeemed Christian Church of
God — Solution Center For All Nations, 1424 N Tibbs Avenue). Hand-built with plain
HTML/CSS/JS — no framework, no build step, no server code — and deployed as a static site
on Netlify. Everything the browser serves lives in the [`site/`](site/) folder.

**Live demo:** https://rccg-scona-preview.netlify.app

## Highlights

- **Responsive, theme-consistent design** styled after the parent church's national brand
  (navy + gold, Montserrat/Poppins), with a mobile nav, sticky header, and reusable card
  and section components in a single [`stylesheet`](site/css/style.css).
- **Self-updating sermon video** — the home page embeds the church's YouTube uploads
  playlist, so the newest Sunday service always appears with no manual editing.
- **Smart live-stream detection** ([`js/live-check.js`](site/js/live-check.js)) — instead
  of showing YouTube's jarring "video unavailable" box when the church is offline, the
  Watch page hides the player and polls the YouTube IFrame API every 60 seconds, revealing
  the live stream automatically the moment a Sunday service goes live.
- **Location map** with a coordinate-pinned Google Maps embed and a one-tap directions link.
- **Content researched from public sources** — service times, channel ID, and parish
  details were gathered from the church's YouTube, the RCCGNA parish directory, and parish
  social pages, then structured into the site.

## Tech

Plain HTML5, modern CSS (custom properties, grid/flexbox, `@media` queries), and a little
vanilla JavaScript. No dependencies to install. Static-hosted on Netlify via drag-and-drop
deploys.

## Pages

| File | Purpose |
|---|---|
| `site/index.html` | Home — hero, weekly service schedule, latest service video, recurring events, pastor welcome, giving teaser |
| `site/about.html` | About the parish, mission/vision/beliefs, Pastor Ayodeji Obajolu, RCCG heritage, salvation steps |
| `site/watch.html` | Live-stream embed (auto-live on Sundays) + six recent service replays + channel links |
| `site/give.html` | Three Ways to Give — Zelle (317-507-9973), Cash App ($Rccgsc), Offering Box |
| `site/food-pantry.html` | Community Food Pantry — 1st & 3rd Saturday monthly |
| `site/contact.html` | Address, phones, email, mailing PO Box, socials, Google Map with pin, directions link |

## One thing to do before launch

**Add the pastor's photo.** Save his portrait as `site/images/pastor.jpg`.
Until that file exists, pages show a branded placeholder automatically — nothing breaks.

## How the video sections work

- The channel ID for RCCG SCONA TV is `UCzvTHbLCrNOadRYDHbtL59g`.
- The home page embeds the uploads playlist (`videoseries?list=UUzvTHbLCrNOadRYDHbtL59g`),
  which **always starts with the newest upload** — it updates itself every week with no editing.
- The watch page's top player uses `embed/live_stream?channel=...`, which automatically shows
  the live service when streaming is on; otherwise it shows an offline notice.
- The six "Recent Services" tiles on `watch.html` are hard-coded video IDs. Refresh them
  occasionally: copy the 11-character ID from a YouTube video URL and swap it into the
  `youtube.com/embed/<ID>` iframe and its caption.

## Updating common things

- **Service times** appear in three places: home page cards, contact page card, and every
  page's footer. Search for the time (e.g. `11:30am`) across `site/*.html` when they change.
- **Events**: the "Upcoming & Recurring" list is in `index.html` (`event-item` blocks —
  copy one, edit the date bubble and text). One-off announcements are best posted to the
  Facebook group, which the site links to.
- **Colors/fonts**: edit the variables at the top of `site/css/style.css`.
- **Giving handles**: in `give.html` and the teaser section of `index.html`.

## Previewing locally

From the project folder run `python3 -m http.server 8000 --directory site`
then open http://localhost:8000. (Opening the files directly also works, but the
YouTube/Maps embeds behave better over http.)

## Hosting

Any static host works — GitHub Pages, Netlify, Cloudflare Pages, or shared church hosting.
Upload the *contents* of `site/` to the web root. No environment variables or database needed.

## Sources used to build the content

- Parent church style/structure/logo/mission text: https://www.rccg.org (logo used with the
  parent church's permission, per the parish)
- Weekly schedule, phones, videos: the parish YouTube channel "RCCG SCONA TV"
  (https://www.youtube.com/@rccgsolutioncenterforallna510)
- Pastor's full name, office phone, pastor email: RCCGNA parish directory (parish #239, Zone IN-1)
- Church email: the parish's UENI listing (rccgsolutioncenter.ueniweb.com)
- Established date (Feb 18, 2003): parish Facebook page
- Giving details: parish "Three Ways to Give" service slide
