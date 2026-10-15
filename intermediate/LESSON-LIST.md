# TURNIT — Intermediate Investing · Lesson List

7 modules · 35 lessons · **19 built** (Modules 1, 2, and 3 complete, Module 4 underway)

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

## Module 3 — Tax-Smart Investing ✅ complete

| # | Lesson | File | Slides |
|---|---|---|---|
| 11 | Asset Location: What Belongs In Which Account | `11-asset-location.html` | 8 |
| 12 | Qualified vs. Ordinary Dividends | `12-qualified-vs-ordinary-dividends.html` | 9 |
| 13 | Holding Periods And The Capital Gains Brackets | `13-holding-periods-and-capital-gains-brackets.html` | 8 |
| 14 | Tax-Loss Harvesting, And The Wash-Sale Rule | `14-tax-loss-harvesting-and-wash-sale-rule.html` | 8 |
| 15 | What A 1099 Actually Tells You | `15-what-a-1099-actually-tells-you.html` | 8 |

## Module 4 — Risk You Cannot See In A Chart 🔶 underway (4 of 5)

| # | Lesson | File | Slides |
|---|---|---|---|
| 16 | Volatility vs. Drawdown vs. Permanent Loss | `16-volatility-drawdown-and-permanent-loss.html` | 9 |
| 17 | Correlation: Why "Diversified" Can Still Move Together | `17-correlation-why-diversified-can-still-move-together.html` | 8 |
| 18 | Sequence-Of-Returns Risk | `18-sequence-of-returns-risk.html` | 8 |
| 19 | Concentration Risk: Company Stock And RSUs | `19-concentration-risk-company-stock-and-rsus.html` | 8 |
| 20 | Your Real Risk Tolerance vs. Your Stated One | — | — |

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
the three account tax treatments, a fund-distribution tax fact, and a 4-case
placement exercise, closing with a 6-line recap. Closes on a verified Learned
Hand quote (*Gregory v. Helvering*, 69 F.2d 809, 2d Cir. 1934). One creative
widget used (a simplified 1099-form reveal on slide 2); slides 3, 4 and 6 use
standard formats (sort, tap-reveal comparison, scenario decisions) per the 1–2
widget cap. Carries heavier hedging per this file's own note on lessons 11/14/23.

Fixed after initial review: two unprefixed helper classes (`ef`/`in` on the
sort-zone divs) renamed to `lc-eff`/`lc-inf`; slide 3's sort widget wasn't
showing where a card landed or whether it was right (cards were hidden via
`display:none` on placement, with no correctness check at all) — now a placed
card stays visible in its zone with a green ✓ or red ✗; REITs and municipal
bonds were cut entirely since neither is introduced before Module 3 (replaced
with a CD, a fund-distribution fact, and a dividend-reinvestment case, with
extra term mentions woven in to keep the glossary density up); and the
Complete-slide icon was swapped from 🗂️ to 🚀, matching every other lesson.

**Lessons 12-15, built this pass — Module 3 complete:**

- **Lesson 12 ("Qualified vs. Ordinary Dividends"), prefix `qd`:** creative
  widget is a day-count ruler — a shaded 121-day qualifying window around
  the ex-dividend date, with 4 tappable buy/sell scenarios that draw their
  own held-span bar and the overlap. Slide 4 is a standard ordinary/
  qualified tax calculator across 3 income presets, using real 2026
  single-filer brackets (Rev. Proc. 2025-32).
- **Lesson 13 ("Holding Periods And The Capital Gains Brackets"), prefix
  `cg`:** creative widget is a stacking bar — ordinary income fills a
  horizontal bar first, then a highlighted gain segment stacks on top and
  visibly splits across rate-zone boundaries when it crosses one.
  Deliberately reuses Lesson 12's income presets and bracket figures for
  cross-lesson consistency, applied to a sale instead of a dividend.
- **Lesson 14 ("Tax-Loss Harvesting, And The Wash-Sale Rule"), prefix
  `tl`:** creative widget is a year-end netting worksheet/ledger with five
  tappable summary rows showing real arithmetic down to the $3,000
  ordinary-income offset and carryforward. Carries heavier hedging per
  this file's own note on lessons 11/14/23 — slide 6 exists specifically
  to name real friction (costs, time out of market, professional advice),
  and nothing in the lesson walks through placing an actual trade.
- **Lesson 15 ("What A 1099 Actually Tells You"), prefix `fm`:** creative
  widget is a full annotated consolidated-1099 reconstruction (1099-DIV
  and 1099-B panels with real box numbers/labels) — the first full 1099
  reconstruction in the course, closing the loop Lessons 11 and 14
  deliberately left open. Closes Module 3.

**Lessons 12-15, revised after user feedback:**

- **Lesson 12:** added a new slide 2, a tap-to-reveal comparison table
  going deeper on ordinary vs. qualified before the holding-period
  mechanics — 3 row-groups (The Default, The Tax Rate, What It Takes),
  Ordinary and Qualified side by side, 6 cells total. The lesson is now
  9 slides; everything after slide 1 renumbered.
- **Lesson 13:** slide 4 was rebuilt — it originally reused Lesson 12's
  toggle + three-income-preset calculator almost exactly, just applied
  to a sale instead of a dividend. It's now a one-day cliff selector: six
  tappable days straddling the one-year mark on one fixed scenario
  ($45,000 gain, $120,000 other income), so the dollar jump between day
  365 (short-term, $10,800) and day 366 (long-term, $6,750) is the whole
  point. Slide 6's explanations now show the addition (e.g. "$20,000 +
  $10,000 = $30,000") that leads to each threshold comparison, not just
  the conclusion.
- **Lesson 14:** slide 2 was rebuilt from two tap-reveal pills into an
  SVG price chart of a position down 15%, with "Sell Now" and "Keep
  Holding" buttons that each draw a different dashed continuation from
  today's point and update the result — realized vs. unrealized made
  visible rather than just defined. The lesson now has 2 of 2 creative
  widgets (the chart plus the netting ledger).
- **Lesson 15:** slides 3 and 6 originally described a box's contents in
  plain text only ("Box 1a shows $3,000"), which read as confusing once
  the actual form from slide 2 had scrolled out of view. Each of the 8
  cases now opens with a small static box chip — reusing slide 2's exact
  box styling — so the question is never divorced from what the form
  shows.

All four were caught and fixed mid-build by their own verification pass:
two unescaped apostrophes inside JS string literals on Lesson 14 (syntax
errors caught by `node --check`), a headline on Lesson 13 that
accidentally contained two chip terms verbatim (green words landing in an
`<h2>`), low green-term coverage on 12 and 14 from explanatory text sitting
in `id`'d reveal boxes the hover-term scanner skips by design (fixed by
weaving the same terms into static instruction lines instead), and on
Lesson 15, all 8 multiple-choice answers across two quiz slides landing on
the first option (answer-key hygiene — repositioned for a mixed pattern).

**Lesson 16 ("Volatility vs. Drawdown vs. Permanent Loss"), opens Module
4, prefix `vd`:** creative widget is an annotated real S&P 500 chart of
the Feb-Aug 2020 COVID crash — three tappable markers (Peak, Trough,
Recovery) on an actual historical path, each revealing its real date and
closing level (down 33.9% at the trough, a new high six months later).
Distinct from Lesson 14's branching hold/sell chart: this one shows a
single real history, not a hypothetical choice. Slide 4 ("Three
Investors, Same Crash") walks the same real crash through three
behavioral outcomes — sold at the bottom, held, kept contributing — to
make "selling locks in the loss" concrete without re-teaching Lesson 14's
tax-specific realized/unrealized framing. The Lehman Brothers bankruptcy
is cited as the permanent-loss contrast to the index-level recovery.
Closing quote required re-verification: the popular "voting machine /
weighing machine, short run / long run" line often attributed to
Benjamin Graham turned out to be Warren Buffett's own paraphrase, not a
verified Graham quote — used the original wording from Graham & Dodd's
*Security Analysis* (1934) instead. Two bugs caught by the lesson's own
verification pass: a headline that accidentally contained the "Bear
Market" chip term verbatim, and green-term coverage falling to 7 (needed
≥10) because most of the explanatory text sits in `id`'d reveal boxes the
scanner skips by design — fixed by weaving the same terms into static
instruction lines.

**Lesson 16, revised after user feedback — now 9 slides, 2 of 2 creative
widgets:** slide 2 was rebuilt from a static tap-marker chart into a
dark, trading-app-styled chart (ticker, live-ticking price, green/red
delta badge) that draws Apple's real Feb–Aug 2020 price path via
`requestAnimationFrame` and unlocks four review callouts (Peak, Crash
Day, Trough, Recovery) as the line passes them, each with its own
independently-sourced date and price. Switched the headline example from
the S&P 500 to a single real stock (AAPL) specifically so the crash could
be narrated as something that happened *to a company*, not just an
index. A new slide 3 ("A Headline, Then A Reaction") demonstrates why
volatility happens at all: two real headline cards, each with its own
mini chart that animates a price reaction on tap — a world event (WHO's
Mar 11, 2020 pandemic declaration, AAPL −9.9% the next day) against
company-specific news (AAPL's Jan 28, 2022 earnings beat, +7%) — with a
closing note contrasting market-wide moves against single-company moves,
foreshadowing Lesson 17's correlation topic without teaching it by name.
The animation duration was deliberately kept to 1.8s (matching Lesson
10's proven-safe ~1.5s precedent) rather than a more cinematic 4+
seconds, after tracing through the verification harness's timed-widget
fallback strategy and finding the longer duration left too little margin
to resolve reliably.

**Lesson 16, slide 2 — on-chart point markers added per user request.**
Peak/Crash/Trough/Recovery were previously named only in the callout
row below the chart; four small labeled markers (a white dot + outlined
text, reusing the tracking dot's fill/stroke treatment for visual
consistency) now sit directly on the chart line itself, at the exact
same coordinates the polyline already bends through. Each marker fades
in at the same moment its callout unlocks (both driven by the same
`unlockUpTo(f)` keyframe-threshold check), so the chart and the callout
row stay in sync rather than needing separate timing logic. Markers are
additive and never removed, consistent with the slide's existing
"once unlocked, stays unlocked" behavior across replays.

**Lesson 17 ("Correlation: Why 'Diversified' Can Still Move Together"),
prefix `cr`:** both creative widgets were deliberately built as new
mechanics rather than reusing Lesson 14's or Lesson 16's flat-vs-reacted
mini-chart toggle, per explicit user feedback that activities should
"vary and are different than the previous ones." Slide 2 ("Same Crash,
Three Lines") reuses Lesson 16's dark, trading-app chart styling (which
the user liked) but draws three real assets simultaneously — AAPL, the
U.S. Global Jets airline ETF, and the long-term Treasury bond ETF TLT —
through the same six real weeks of the Feb–Mar 2020 crash, animated via
three parallel `requestAnimationFrame` stroke-dash reveals (shared
1.8s duration, same safety margin established on Lesson 16), then
unlocks three legend buttons that each isolate their own line (dimming
the other two) and reveal that asset's real, independently-sourced move.
No numeric price values are displayed on this chart — only the three
lines' real directional shapes — specifically so nothing is asserted
that isn't separately stated as sourced text underneath. Slide 3 ("Two
Lines, Five Settings") is a new mechanic: five stepped buttons (−1,
−0.5, 0, +0.5, +1) redraw a second line against a fixed first line, so
the learner watches co-movement itself change shape at each setting. The
chart is explicitly labeled "Illustrative Lines — Not Real Market Data"
and no real correlation figure is attached to any step, since a search
for real correlation coefficients (stock-bond, two large tech stocks)
turned up only soft, single-source figures not solid enough to cite with
decimal precision. At the +1 setting the two lines are identical and
would otherwise fully overlap (one invisible underneath the other); a
dashed stroke was added to the second line plus a small color-coded
legend so both lines stay visibly distinct — and the second line stays
visible — at every setting, including the perfect-overlap case.
Deliberately avoided repeating the back-calculated "Delta fell ~64%"
figure style from research: the airline move is stated qualitatively
("roughly cut in half," sourced to a CNBC analyst comment) at the
sector/ETF level rather than naming one airline with false precision,
and TLT's number is not stated at all — the chart shows its real
direction (sharp rise, partial pullback) while the text states only
independently-sourced facts (a 6.4% single-day jump, a new 52-week high).
Slide 6's scenario-decision deliberately uses the real, verified 2022
numbers (S&P 500 about −18%, TLT about −31%, both down together) as one
of its four cases, directly reinforcing the recap point that correlation
isn't fixed — chosen over the originally-planned COVID-era stock/bond
"~0" anchor specifically because that figure would have contradicted the
lesson's own sourced research showing crisis-period correlation spikes.
Closing quote required the same re-verification discipline as Lesson
16's: the popular "diversification is the only free lunch in investing"
line attributed to Harry Markowitz was searched and found unverified
against any primary source (one paper reportedly found no evidence he
said it), so it was not used; instead, "Diversification is both observed
and sensible" — a short phrase reproduced consistently across multiple
independent secondary sources quoting Markowitz's actual 1952 *Journal
of Finance* paper — was used, while a longer surrounding sentence whose
exact wording varies slightly between secondary quotations was
deliberately left out rather than guessed at.

A post-ship review caught three issues in Lesson 17, all fixed and
reverified before Lesson 18 began: an author `display:block` CSS rule
was overriding the `[hidden]` attribute on the "Show All Three Again"
button, so it was visible on page load instead of only after an
isolate action — fixed with an explicit `[hidden]` selector; slide 6's
large-cap/small-cap case was marked "Moderate," but the real figure
(researchers estimate roughly 0.8, per a CME Group analysis) is High —
the case, its answer index, and its explanation were corrected; and
BUILD-GUIDE's prefix table and used-mechanics list hadn't been updated
since Lesson 10, so Lessons 11-17's mechanics (including both of
Lesson 16's and 17's) are now listed, which matters directly for
Lesson 18's "check the used-mechanics list" step.

**Lesson 18 ("Sequence-Of-Returns Risk"), prefix `sr`:** both creative
widgets are new mechanics — a learner-driven account-statement stepper
(slide 2) and an instant 3-way toggle (slide 3) — specifically avoiding
a third consecutive animated-line-chart slide after Lessons 16 and 17.
Both widgets share one JavaScript function (`calcSeries`) so the dollar
figures shown in both places are computed from the same code rather
than independently hand-typed, and are driven by one real, consistently
-sourced dataset: the S&P 500's actual annual total returns for
2000-2006 (YCharts), used in chronological order for "Account A" and
reversed for "Account B." A 2000-2009 full "lost decade" window was
tried first and rejected: reversing all ten years still front-loads a
crash into year 2 of the reversed order (2008's -37% lands early),
weakening the contrast; 2000-2006 keeps the three down years at one end
only, so reversing cleanly moves the whole crash from one end of the
window to the other. All balances were verified by direct computation,
not by hand: with no cash flow both orders land on an identical
$540,691; withdrawing $20,000/year, the chronological order ends at
$359,211 against $419,847 reversed; contributing the same $20,000/year
instead, the tilt exactly reverses ($722,170 vs. $661,534) — both gaps
equal $60,636, a consequence of the linear arithmetic rather than a
coincidence picked for the demo. "Account B" is explicitly labeled as
an illustrative reordering of the same seven real numbers ("Year 1"
through "Year 7"), never as a real retiree who retired in 2006, since a
real 2006 retiree's actual next six years were a different, unrelated
real sequence. Slide 2's single repeatable "Show Year" button needs
exactly 7 taps, deliberately kept one under the verification harness's
8-click sole-button-loop budget rather than using all 8 years of
available real data, to leave margin. The lesson stops short of naming
or teaching a "safe withdrawal rate" or the 4% rule — reserved for a
later module — defining "Withdrawal Rate" only generically and framing
the $500,000/$20,000 figures as an illustrative scenario throughout,
the same scope discipline Lesson 16 applied to correlation. One bug
was caught by the lesson's own verification pass and fixed before
shipping: the harness's final check (which un-hides every slide at
once to scan for green terms) revealed that the page's sticky bottom
nav — present on every lesson and normally harmless — happened to
overlap the very first green term on this lesson's title slide at
desktop width, because of how tall the title/vocab block and the
opening sentence of slide 2 happened to stack; confirmed by direct
Playwright inspection (the element reported at that screen position
was the nav, not the term) rather than guessed at. First fix attempt
trimmed vertical spacing on the title slide until the term's position
cleared the nav's footprint — reverted after review, since it was
fragile (any later copy edit to slides 1 or 2 could reintroduce the
same overlap, and the same risk existed for every future lesson, not
just this one) and left this lesson's title slide spaced differently
from every other lesson's for no content reason. The real fix is in
`verify/verify-lesson.js` itself: the tooltip check now scrolls the
term to the center of the viewport (`scrollIntoView({block:'center'})`)
instead of using `scrollIntoViewIfNeeded`'s nearest-edge behavior,
since the sticky-nav overlap only happens in the harness's own
artificial all-slides-unhidden state (used to count green terms) that
a real learner, who only ever sees one slide at a time, never
encounters. Reverified against Lessons 16-18 with no regressions.
Closing quote: Warren
Buffett's "Be fearful when others are greedy, and greedy when others
are fearful," verified against the actual text of his "Buy American. I
Am." New York Times op-ed (Oct. 16, 2008) after an initial search for a
sequence-of-returns-specific quote (Bengen, Milevsky) turned up nothing
that could be confirmed as an exact, primary-sourced quotation — the
same standard applied to the Graham and Markowitz quotes in Lessons 16
and 17. Checked for duplication against every other quote in this
repo (`grep -ril "fearful"` and `"buffett"` across both `intermediate/`
and the separate Foundations-level lesson files at the repo root,
which quote Buffett six different times) before shipping; confirmed
unique.

A second review caught a real self-contradiction in the first draft:
slide 3 shows that reordering the same seven returns changes a
*contributor's* ending balance by exactly as much as a withdrawer's
(just in the opposite direction), but the myth/fact claim, a scenario
case's explanation, and slide 2's own intro paragraph all separately
implied order "only" or "mainly" matters during decumulation — directly
contradicting the lesson's own widget. Fixed by rewriting all three to
one consistent framing (order matters whenever money moves in or out;
withdrawals make an early crash costly; contributions make a late
crash costly) rather than patching each symptom differently. The same
pass also caught slide 6's intro describing every case as an
accumulation-vs-decumulation pair, when two of its four cases actually
compare two people who are both already retired — reworded to cover
both pairings it actually contains.

**Lesson 19 ("Concentration Risk: Company Stock And RSUs"), prefix
`cc`:** both creative widgets are new mechanics, chosen specifically
against the now-current used-mechanics list (no hold/sell branch from
Lesson 14, no stepper or mutually-exclusive toggle from Lesson 18, no
dark animated chart from Lessons 16-17). Slide 2 ("Build Your
Exposure") is an additive exposure builder: three independent,
non-exclusive on/off toggles that each add a realistic dollar figure
to a running "percent of portfolio in one company" gauge for a
hypothetical employee, so a learner can freely explore every
combination (toggling things back off costs no progress — the gate
tracks which toggles have ever been switched on, not their current
state) and watch ordinary, individually-reasonable benefits (an RSU
grant, ESPP purchases, a stock-paid 401(k) match) stack into real
concentration. Slide 3 ("What Happened At Enron") is a single shared
trigger that flips two side-by-side status cards (Income, 401(k)
Balance) from a neutral to a red state at the same instant, rather
than two independently-tapped cards like Lesson 16's headline pair —
built specifically to dramatize the lesson's point that employer-stock
concentration hits income and net worth on the same day, from the same
cause, not as two separate risks. Two "Learn More" buttons unlock
after the flip for extended real detail. Deliberately uses Enron as
the real case rather than Lehman Brothers (Lesson 16's own example) —
a different real case teaching a different, additional point:
concentration through an employer relationship specifically, not just
holding one company's stock as an ordinary investment. Scoped
narrowly on purpose: does not teach 401(k) vesting, net unrealized
appreciation, or rollovers (reserved for Lesson 34 in Module 7), and
does not re-chip idiosyncratic risk or sector concentration (Lesson
17 owns those terms); does not state a recommended maximum percentage
of employer stock to hold, the same compliance hedge Lessons 11 and 14
use for "what should I do" territory. Real figures: a March 2002
Senate Democratic Policy Committee study found Enron's 401(k) was
57.7% company stock in 2001; separately, Sen. Edward Kennedy testified
at a Senate HELP Committee hearing that Enron workers had "more than
sixty percent" of their 401(k) in Enron stock — "more than half" is
used in-lesson since both sources support it, rather than asserting
one precise contested figure. A Congressional Research Service
analysis cited in 2002 Senate testimony found 89% of the Enron stock
held in 401(k)s had been purchased voluntarily by employees, not
received through the match. Enron's stock traded near $90 in late 2000
and closed at $0.26 on November 30, 2001, the day before the company
filed Chapter 11; about 4,000 Houston employees were laid off the next
day, December 3, 2001, per contemporaneous AP wire reporting and
Senate testimony from a former employee. Closing quote — "They lied to
us, kept encouraging us to hold onto our stock, and never let on that
our company was in serious trouble" — is verbatim Senate HELP
Committee testimony from former Enron employee Steven Lacey (Feb. 7,
2002, as reported by the IBEW Journal), found on the first search
attempt and checked for duplication against every other quote already
in this repo before shipping.

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
