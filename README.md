# The Finland Primer

A year-round guide to Helsinki and Tallinn for American visitors — written for the people who come
because of Finland's innovation and entrepreneurial ecosystem. Two tracks behind a shared landing
page. A generalised successor to the GIE 2026 Primer.

```
index.html            Landing page — the choice, plus facts true for everyone
students.html         Student track — Helsinki · Tallinn · Before You Go
professionals.html    Professional track — Helsinki · Business Culture · Ecosystem · Tallinn · Before You Go
style.css             Shared stylesheet (inherits the GIE Primer's visual system)
charts.js             Daylight chart — renders into any element with data-daylight
addons/               Time-window overlays — see addons/README.md
```

## Deploying

Static files, no build step.

**Web route, no tooling:** create an empty repo on github.com (no README, no .gitignore), click
"uploading an existing file", then drag in the *contents* of this folder — not the folder itself, or
you'll end up a directory too deep. Check that `addons/` survived the drag before committing.

**Command line:**

```bash
git init && git add . && git commit -m "The Finland Primer"
git branch -M main
gh repo create <user>/finland-primer --public --source=. --push
```

Either way, finish with **Settings → Pages → Deploy from a branch → `main` / `(root)`**.

To preview locally: `python3 -m http.server` in this folder, then open `http://localhost:8000`.

## Audience

Written for **US visitors**. That assumption shows up in the passport and border sections (EES and
ETIAS apply to Americans), VAT refunds (non-EU visitors only), mobile carrier advice, the jet-lag
time zones, and the comparisons used to explain Finnish institutions — the Research Council as NSF,
Business Finland as NIST/SBIR, Finnvera as EXIM plus SBA, Bayh-Dole versus Finland's two-track IP
law. A non-US reader can still use most of it; those specific sections won't apply.

## Design notes

The stylesheet is lifted from the GIE 2026 Primer so the two sites read as siblings — Playfair
Display over DM Sans, cream ground, navy gradient hero, the same card and alert system. Two
additions: a spruce-green accent marks the student track, Finland blue the professional track.
Tabs, jump navigation and deep links (`#eco-vc`, `#ee-ferry`) all work as in the original.

## Keeping it evergreen

**Nothing in the two guides assumes a date.** Seasonality is structural: the calendar sections
describe what November is like, not what November 2026 is like. Slush is "mid-November annually",
Midsummer is "the Friday and Saturday between 19 and 25 June". That's deliberate, so the guides
stay correct without maintenance.

Anything true only for a specific window goes in `addons/` and layers on top via the empty
`.addon-slot` under each guide's tab bar. See `addons/README.md`.

## What will go stale anyway, and roughly how fast

| Within months | Within a year or two | Stable |
|---|---|---|
| ETIAS launch and mandatory dates | HSL fares (raised each January) | The 112 number, tap water, no tipping |
| Business Finland programme names, post-reorganisation | Sauna prices and hours | Euro in both countries, Schengen |
| Ferry fares (fully dynamic) | Hotel rates | The ABC zone structure |
| Slush ticket availability | VC fund sizes and mandates | Public-holiday closure patterns |
| Defence spending figures | Company financials | All of the cultural guidance |

The Business Culture tab and the etiquette sections have the longest shelf life in the whole site.
The Ecosystem tab has the shortest — it's flagged inline where facts are contested or fast-moving,
and it corrects six things that circulating briefing material still gets wrong.

## Sources

Practical figures were triangulated across independent sources in September 2026 — HSL, Finavia,
Port of Helsinki, Visit Finland, Finnish Customs, Yle, the operators' own sites, Numbeo and
Statistics Finland. Ecosystem figures come from Statistics Finland, the Finnish Government, FVCA,
Tesi, Business Finland, company financial releases, Finlex, and the Atlantic Council. Where sources
conflicted, the page says so.
