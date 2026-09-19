# Time-window add-ons

The two guides (`students.html`, `professionals.html`) are deliberately **evergreen**. Nothing in them
assumes a particular month, year or trip. Seasonality is handled structurally — the calendar sections
describe what *November* is like, not what November 2026 is like — so the guides stay correct without
maintenance.

Everything that is true only for a specific window lives here instead, as a separate page that layers
on top.

## How the layering works

Each guide has an empty slot immediately below its tab bar:

```html
<div class="addon-slot"></div>
```

`.addon-slot:empty` is `display: none`, so when there's no active window the guides show nothing and
look exactly as they do now. To activate one, replace that empty div with the banner block that sits
commented out just above it in each file, and point its `href` at the add-on page:

```html
<div class="addon-slot">
  <a class="addon-banner" href="addons/2026-11-11.html">
    <div class="addon-text">
      <div class="addon-when">Visiting 11–13 November 2026</div>
      <div class="addon-title">Your window, specifically</div>
      <div class="addon-sub">Who's in town, what's on, who to ask for.</div>
    </div>
    <span class="addon-go">Open the add-on →</span>
  </a>
</div>
```

When the window passes, empty the div again. The guide underneath never changed.

The banner picks up the track colour automatically — spruce green on `body.stu`, Finland blue on
`body.pro` — so the same markup works in both guides.

## Making a new add-on

1. Copy `_template.html` to a dated filename, e.g. `2026-11-11.html`.
2. Fill in the front matter block at the top: dates, audience, one-line purpose.
3. Fill the sections. Delete any you don't need — an add-on should be short. If it runs longer than
   a screen or two, something in it probably belongs in the evergreen guide instead.
4. Activate the banner in whichever guide(s) it applies to.

An add-on is also the right home for anything **audience-specific** rather than merely time-specific:
a named delegation, a particular university's cohort, a single company's visit. The evergreen guide
stays general; the overlay carries the names.

## What belongs in an add-on vs the evergreen guide

| Add-on | Evergreen guide |
|---|---|
| "Sunset is 16:05 that week, and it will be dark by the time you leave the last meeting" | "Helsinki runs from 5h50m to 19h of daylight across the year" |
| "Slush is 18–19 November, so your hotel will cost double" | "Slush runs mid-November; capacity tightens and rates roughly double" |
| "The Christmas market opens the day you arrive" | "December has markets, lights and atmosphere" |
| Named people, specific meetings, a real agenda | Institutions, roles, and who to ask for |
| "Alexander Nevsky Cathedral is closed for restoration until March" | What the cathedral is |
| A specific delegation's schedule and counterparts | How Finnish meetings run |

The rule of thumb: **if it will still be true in three years and for every reader, it goes in the
guide.**

## Building a delegation add-on

The most common case: a named group, in town for a few days, with an agenda. That add-on should
cover at minimum:

- **Daylight and weather for those exact dates**, stated plainly. Mid-November in Helsinki is
  roughly 7–8 hours of daylight with mid-afternoon sunset and grey rather than snow; mid-June never
  gets dark. Visitors are more often blindsided by this than by anything else.
- **What else is in town.** Slush in mid-November moves hotel prices, fills the city with the whole
  ecosystem, and spawns 600+ side events — a threat to your budget and an opportunity for your
  agenda at the same time. Conferences, sporting events and public holidays all count.
- **Closures and holiday hours.** Check against the public-holiday list in the professional guide's
  business-calendar section.
- **The agenda itself** — counterparts, venues, realistic travel times between them, who is hosting
  what.
- **Who they're meeting**, with the one question worth asking each person.
- **What to do with the gaps**, specific to where they'll actually be standing.

Research it fresh each time. Everything in that list moves.
