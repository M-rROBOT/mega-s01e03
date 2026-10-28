# what #4471 shows

The support desk merged 412 reports about wrong dates into one ticket, #4471, and marked it
known: one issue, one fix queued. The queue holds **three bugs**. This repo files one ticket per
bug and adds a page to the kb that says so.

## The three tickets

| ticket | problem | reports | where it stands |
|---|---|---|---|
| [#1](https://github.com/M-rROBOT/mega-s01e03/issues/1) | the shared date parser reads day-first dates month first | **374** | closed — fixed |
| [#2](https://github.com/M-rROBOT/mega-s01e03/issues/2) | `booking-v3` prints an `MM/DD/YYYY` date hint to day-first tenants | **33** | closed — won't fix |
| [#3](https://github.com/M-rROBOT/mega-s01e03/issues/3) | invites land one day out — a timezone/DST offset, not a month flip | **5** | **open** |

374 + 33 + 5 = 412.

## What the desk did, and what it missed

Engineering closed #4471 on 5 October with two outcomes, and both are right:

- `parser` — **fixed**, `fix(dates): parse dd/mm for eu locales`
- `hint` — **won't fix**, `booking-v3` form retired

Tickets #1 and #2 are closed here to match. The third bug was not in the update. Inside #4471 it
was never a bug of its own — only five reports counted under the parser with a footnote under the
table — so closing #4471 passed over it. The parser fix does not touch a timezone offset, and a
retired form does not either. **#3 is still open.**

## The page

Delivered at the top of this repo, both files:

- the `.svx`: [`4471-split.svx`](4471-split.svx)
- the page as the desk will see it: [`4471-split.html`](4471-split.html) — rendered, one file, no server

The same page lives in the kb, where the kb keeps its pages, and the kb is built out so the
page sits at the route the desk reads it at:
[`build/kb/incidents/4471-split.html`](build/kb/incidents/4471-split.html).
The export came as files, not a site, so the built site is what the desk would see. This repo is the desk's export with the page added; nothing in the export was edited.

- in the kb: [`src/routes/kb/incidents/4471-split/+page.svx`](src/routes/kb/incidents/4471-split/+page.svx), served at `/kb/incidents/4471-split`
- rendered there too: [`src/routes/kb/incidents/4471-split/page.html`](src/routes/kb/incidents/4471-split/page.html) and [`rendered/4471-split.html`](rendered/4471-split.html)

It lives in the kb at `/kb/incidents/4471-split` and appears in the kb index. It is signed
`M-rROBOT`, so it carries desk ref **DR-T8HP-6VA9**.

## How the counts are derived

Nothing is typed into a paragraph. Every number on the page is computed from the export at
render time, which is the kb's own rule.

The desk's `src/lib/kb/causes.ts` already splits the queue two ways: it asks the platform whether
a tenant's locale is day-first, then separates reports that came through a `booking-v3` form
(`hint`) from the rest (`parser`). That gives 379 and 33, and the existing `CauseTable` on
[`/kb/incidents/4471`](src/routes/kb/incidents/4471/+page.svx) has been printing the `hint` row
as *"not this ticket — no ticket of its own"* since the page was written.

`causes.ts` cannot see the third bug. It places a report by tenant locale and channel, and a
one-day move looks like everything else, so five reports that describe a shifted zone land under
`parser` and get footnoted. [`src/lib/kb/split-4471.ts`](src/lib/kb/split-4471.ts) adds that one
rule — the ids the desk wrote into `src/lib/data/desk-notes.json` — and imports `causes.ts` for
the rest rather than editing it. 379 − 5 = 374.

I checked the desk's list of five against all 412 bodies: 403 contain a date pair with day and
month swapped, and the 9 that do not are those 5 plus 4 month-flip complaints with no date in
them. No sixth one-day report is hiding.

Two more facts the page prints, both computed:

- intake's tag disagrees with the cause on **38 of 412** reports — it guesses from the reporter's
  browser, while the cause follows the tenant;
- the export ships **427 rows for 412 reports**: 15 ids come twice with identical content.

## Nothing in the kb was edited

`#4471` stands as the desk's record of the queue, and decision 0001 stands as accepted — the kb's
own rule is that an accepted decision is replaced, never edited. The new page, `split-4471.ts`,
`tickets-4471.ts` and two components are additions.

## Running it

The export is `README.md` and `src/`. `svelte.config.js`,
`vite.config.js`, `src/app.html` and the two files under `src/routes/` that are not kb pages are
the frame it was exported out of, added back so the pages render.

```bash
npm install
npm run build                                               # prerenders the whole kb to build/
node scripts/render-page.mjs kb/incidents/4471-split rendered/4471-split.html
```

[`README.md`](README.md) is the kb's own README, exactly as it came with the export. This repo is
the kb: the export at its own root, with the page added.

---

MEGA.dev · S01E03 · *what it shows*
