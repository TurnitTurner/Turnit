# TURNIT — Intermediate Investing · Lesson List

7 modules · 35 lessons · **11 built** (Modules 1 and 2 complete, Module 3 underway)

**Assumed entry point:** the learner already has an account open, money invested — probably
in a broad index fund — and knows compounding, diversification, fees, dollar-cost averaging
and basic capital gains. Nothing in this course re-teaches those.

---

## Module 1 — Building A Real Portfolio ✅ complete

| # | Lesson | File | Slides |
|---|---|---|---|
| 1 | From One Fund To An Allocation | `01-from-one-fund-to-an-allocation.html` | 13 |
| 2 | Stocks And Bonds: Choosing Your Split | `02-stocks-and-bonds-choosing-your-split.html` | 13 |
| 3 | Why International Exposure Exists | `03-why-international-exposure-exists.html` | 9 |
| 4 | Large, Mid, And Small Companies | `04-large-mid-and-small-companies.html` | 10 |
| 5 | Three Portfolio Models Compared | `05-three-portfolio-models.html` | 10 |

## Module 2 — Funds Under The Hood ✅ complete

| # | Lesson | File | Slides |
|---|---|---|---|
| 6 | ETFs vs. Mutual Funds: What Actually Differs | `06-etfs-vs-mutual-funds.html` | 10 |
| 7 | How An Index Is Built (And Why It Matters) | `07-how-an-index-is-built.html` | 8 |
| 8 | How To Read A Fund Page | `08-how-to-read-a-fund-page.html` | 8 |
| 9 | Fund Overlap: Owning The Same Thing Twice | `09-fund-overlap.html` | 8 |
| 10 | Dividends, Reinvestment, And Total Return | `10-dividends-and-total-return.html` | 8 |

> Lesson 8 **replaced** the originally outlined *"Tracking Error: When A Fund Misses Its
> Index."* Tracking error's causes were already covered across lessons 6, 7 and 3, and the
> topic isn't actionable for broad index funds. The one idea worth keeping — *a fund trails
> its index by roughly its fee, and that's the design working* — is now a single widget on
> lesson 8 slide 4.

---

## Module 3 — Tax-Smart Investing 🔶 underway (1 of 5)

| # | Lesson | File | Slides |
|---|---|---|---|
| 11 | Asset Location: What Belongs In Which Account | `11-asset-location.html` | 8 |
| 12 | Qualified vs. Ordinary Dividends | — | — |
| 13 | Holding Periods And The Capital Gains Brackets | — | — |
| 14 | Tax-Loss Harvesting, And The Wash-Sale Rule | — | — |
| 15 | What A 1099 Actually Tells You | — | — |

## Module 4 — Risk You Cannot See In A Chart ⬜ not built

| # | Lesson |
|---|---|
| 16 | Volatility vs. Drawdown vs. Permanent Loss |
| 17 | Correlation: Why "Diversified" Can Still Move Together |
| 18 | Sequence-Of-Returns Risk |
| 19 | Concentration Risk: Company Stock And RSUs |
| 20 | Your Real Risk Tolerance vs. Your Stated One |

## Module 5 — Bonds And Cash, Properly ⬜ not built

| # | Lesson |
|---|---|
| 21 | What You Actually Own When You Buy A Bond |
| 22 | Yield, Price, And Why They Move Opposite |
| 23 | Duration: How Much Rates Will Hurt |
| 24 | Bond Funds vs. Individual Bonds |
| 25 | T-Bills, Money Market Funds, And HYSAs Compared |

## Module 6 — Looking At Individual Companies ⬜ not built

| # | Lesson |
|---|---|
| 26 | Should You Pick Stocks At All? |
| 27 | Reading An Income Statement |
| 28 | Reading A Balance Sheet And Cash Flow |
| 29 | Valuation Ratios And Their Limits |
| 30 | What Happens On Earnings Day |

## Module 7 — Running The Plan ⬜ not built

| # | Lesson |
|---|---|
| 31 | Rebalancing: Calendar vs. Bands |
| 32 | Writing An Investment Policy Statement |
| 33 | Benchmarking: Are You Actually Doing Well? |
| 34 | Employer Plans In Depth: Vesting, Fees, Rollovers |
| 35 | The Annual Review, And When To Change The Plan |

---

## Notes carried forward from the outline

**The compliance line moves here.** Foundations could stay descriptive. Intermediate can't:
asset location, tax-loss harvesting and bond duration are inherently "what should I do"
topics. Lessons 11, 14 and 23 need heavier hedging, and 14 should name the wash-sale rule's
30-day window without walking anyone through executing a harvest.

**Module 6 is the odd one out.** Everything else supports a long-term index approach; stock
analysis points elsewhere. Keep lesson 26 as a genuine gut-check — *most people should not,
and here's what it actually costs in time and outcomes* — rather than a throat-clearing
intro. To stay purely index-focused, cut Module 6 and promote a Module 8 on withdrawals,
HSAs and backdoor Roth.

**Some of these fight the format.** Reading a balance sheet in one interactive per slide is
hard. It wants an annotated-document widget — which is on the allowed list, and lesson 8's
fund page is a working example to copy. Budget accordingly, or split 27 and 28 into three
shorter lessons.

**Deliberately left out:** options, margin, crypto, day trading, leveraged ETFs. They're what
people expect from "intermediate," and each raises a real risk of a beginner acting on a
half-understanding. If they get covered, put them in one lesson called something like
*"What We're Not Teaching, And Why"* — which doubles as a credibility signal.

---

## Backlog across the built lessons

All 11 built lessons now pass both verification harnesses (static + behavioural),
at desktop and phone widths.

**Lesson 11 ("Asset Location"), built this pass:** prefix `lc`, 8 slides. Covers
asset location vs. asset allocation, tax-efficient vs. tax-inefficient holdings,
the three account tax treatments, a REIT-ordinary-dividend myth/fact grounded in
2025 Nareit data (79% of distributions taxed as ordinary income), a 4-case
placement exercise, and a 6-line recap. Closes on a verified Learned Hand quote
(*Gregory v. Helvering*, 69 F.2d 809, 2d Cir. 1934). One creative widget used (a
simplified 1099-form reveal on slide 2); slides 3, 4 and 6 use standard formats
(sort, tap-reveal comparison, scenario decisions) per the 1–2 widget cap. Carries
heavier hedging per this file's own note on lessons 11/14/23. One bug caught by
static checks and fixed before commit: two unprefixed helper classes (`ef`/`in`
on the sort-zone divs) renamed to `lc-eff`/`lc-inf`.

What was fixed in the Module 1–2 backlog pass:

- **Lesson 5 duplicate resolved** — kept the weather-test version (now
  `05-three-portfolio-models.html`); the assemble-a-portfolio-bench version was
  dropped because it repeated lesson 1's own build-a-mix mechanic.
- **Sticky nav** added to lessons 01–05 (06–10 already had it).
- **5-line recaps** brought up to the 6-line standard on 03, 04, 05, and 06, each
  with a 6th line summarizing a real idea from the lesson that wasn't recapped yet.
- **Lesson 01's chip count** trimmed from 7 to 6 (cut "Equities" as a near-duplicate
  of "stocks," which the lesson already uses as its primary word).
- Lesson 02's unprefixed `.red` class renamed to `.sb-red`, and its three
  single-letter scenario answers (all "b") varied by reordering two option pairs.
- Two pre-existing bugs the behavioural harness caught: a green hover term landing
  inside an `<h2>` on lesson 01 ("Allocation") and lesson 04 ("Small-Cap"), fixed
  by rewording each headline per BUILD-GUIDE §14.
- A real regression surfaced by adding the sticky nav: on lesson 02's drag-sort
  slide, the sticky bar could overlap a reset button or the disabled Previous
  button once content grew, causing click-intercept failures. Fixed with
  `scroll-margin-bottom` on reset buttons across 01–05.
- `verify/verify-lesson.js` itself had two latent gaps that happened to surface
  during this pass (not caused by any lesson edit): its generic click-driver
  never handled a card-to-zone drag-sort widget (lesson 02) or a click-N-times
  counter button (lesson 10's phone-notification feed), and its rapid-fire
  button clicking could cancel a timed animation before it registered (lesson
  10's growth race). All three are now handled generically, not lesson-specific
  hacks, so future lessons reusing these patterns are covered too.

**No Intermediate quizzes built yet** — still open.
