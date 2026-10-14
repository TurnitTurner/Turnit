# TURNIT — Intermediate Investing Lesson Build Guide

This is the complete working standard for building TURNIT lessons. Hand this file to
Claude Code along with the `lessons/` folder and it should be able to produce new
lessons that match what's already shipped.

Read this whole file before writing any code. The existing lessons in `lessons/` are
the reference implementation — when something here is ambiguous, open a recent one
(`09-fund-overlap.html` or `10-dividends-and-total-return.html` are the newest) and
copy the structure exactly.

---

## 1. What a lesson is, physically

**One self-contained block of plain HTML + CSS + JS.** No framework, no build step, no
external files except Google Fonts. It gets pasted into a GoHighLevel **Custom Code /
HTML element** on a funnel page and displayed in an iframe.

Hard constraints:

- No JSX, no React, no npm. Plain ES5-flavoured JS (`var`, `function`, no optional
  chaining) — it has to run in whatever browser a student has.
- No `<html>`, `<head>` or `<body>` tags. The file starts with `<meta charset="utf-8">`,
  then a comment block, then the markup, then `<style>`, then the `<script>` blocks.
- Images embedded directly (inline SVG or data URI). No external image hosts.
- Everything scoped under one container ID so lessons can't bleed into each other
  or into GHL's own page styles.

---

## 2. Scoping — non-negotiable

Every lesson gets a unique two-letter prefix. Used so far:

| Prefix | Lesson |
|---|---|
| `al` | From One Fund To An Allocation |
| `sb` | Stocks And Bonds: Choosing Your Split |
| `ix` | Why International Exposure Exists |
| `sz` | Large, Mid, And Small Companies |
| `pm` / `bx` | Three Portfolio Models (two versions) |
| `ef` | ETFs vs. Mutual Funds |
| `ib` | How An Index Is Built |
| `fp` | How To Read A Fund Page |
| `ov` | Fund Overlap |
| `dr` | Dividends And Total Return |
| `lc` | Asset Location |
| `qd` | Qualified Vs. Ordinary Dividends |
| `cg` | Holding Periods And The Capital Gains Brackets |
| `tl` | Tax-Loss Harvesting, And The Wash-Sale Rule |
| `fm` | What A 1099 Actually Tells You |
| `vd` | Volatility Vs. Drawdown Vs. Permanent Loss |

Pick a new unused prefix for each new lesson. Then:

```html
<div id="tn-XX">
  <div class="XX-wrap"> ... </div>
</div>
```

```css
#tn-XX{
  --b:#1568AE; --g:#209B73; --ink:#16202B; --ink2:#56657a; --mut:#9AA8B6;
  /* ...tokens... */
  all:initial; display:block; box-sizing:border-box; width:100%;
  font-family:'Inter',...; color:var(--ink); line-height:1.6; background:#fff;
}
#tn-XX *,#tn-XX *::before,#tn-XX *::after{box-sizing:border-box;}
```

- `all:initial` on the root wipes inherited GHL styles.
- **Every** class is prefixed: `.XX-h2`, `.XX-sec`, `.XX-nav`. No bare class names
  except a tiny set of shared state words (`on`, `done`, `right`, `off`, `picked`,
  `answer`, `locked`, `is-disabled`, `correct`, `wrong`, `in`, `center`, `prev`, `next`).
- The tooltip element is the one exception — it's appended to `document.body` so it
  can escape overflow, so its class (`.XX-tip`) is defined **outside** the `#tn-XX`
  selector. Give it `box-sizing:border-box` explicitly, since the root reset doesn't
  reach it.

---

## 3. Brand tokens

```
Blue    #1568AE   (primary)
Green   #209B73   (accent, and ALL vocabulary)
Gold    #D99A23 / #E0A93C
Red     #C0392B   (myth / wrong)
Ink     #16202B   Ink2 #56657a   Muted #9AA8B6
Paper   #fff      Mist #F5F8FB   Tint #EAF7F1   Line #E7EDF3
```

Fonts: **Poppins** (600/700/800) for headlines, labels, numbers and buttons.
**Inter** (400–700) for body copy. One `@import` at the top of the `<style>` block.

Headline gradient: `linear-gradient(95deg,var(--b),var(--g))` with
`-webkit-background-clip:text; -webkit-text-fill-color:transparent;`

**Per-lesson data palette.** Each lesson defines 2–4 semantic colours as CSS vars and
helper classes, and uses them as *data* colour, not decoration. Examples:

- `ef`: ETF = blue, Mutual Fund = teal, thin market = gold → `.w-e`, `.w-m`, `.w-w`
- `ib`: Who Gets In = blue, How Much Each Gets = teal, When It Changes = gold → `.r-a/b/c`
- `dr`: reinvested = green, taken as cash = amber → `.p-a`, `.p-c`

The helper class sets `--f`/`--p`/`--k`/`--r` and its `bg`/`bd` partners, then every
component reads `var(--p)` etc. This is what makes a lesson feel like one system.

---

## 4. Slide structure

8 slides is the current default. 9–13 is acceptable when the content genuinely needs it,
but newer lessons trend shorter and tighter — **shorter is better**.

```
1  Title & Key Terms          (never gated)
2  First interactive
3  Interactive
4  Interactive
5  Myth Or Fact (5 claims)
6  Interactive / scenarios
7  Recap (6 ✓ lines)          (never gated)
8  Complete                   (never gated)
```

Each section:

```html
<section class="XX-sec XX-reveal" data-step="N">
  <p class="XX-kicker">Section Name · N / TOTAL</p>
  <h2 class="XX-h2">Title In Title Case</h2>
  <p class="XX-p">One short sentence of instruction.</p>
  ...widget...
  <p class="XX-count" id="XX-thing-count">Done 0 Of 3</p>
  <div class="XX-reset-row"><button type="button" class="XX-reset-btn" id="XX-thing-reset">↺ Start Over</button></div>
  <p class="XX-disclaimer-inline">Hedging, sourcing, "not to scale", etc.</p>
</section>
```

Header (above slide 1) carries the brand mark, progress bar, slide label and
"Slide N Of M". The long disclaimer sits **after** the last section and is shown only
on the final slide.

---

## 5. The four script blocks

Every lesson has exactly four `<script>` blocks, in this order. Blocks 2–4 are
near-identical across lessons — copy them from a recent lesson and change the prefix.

### Block 1 — Content logic
Wires every widget. Publishes progress onto the container as `data-*` attributes and
fires a custom event:

```js
function state(k,v){ root.setAttribute('data-'+k,v); root.dispatchEvent(new CustomEvent('XX-state')); }
function postHeight(){ var h=root.scrollHeight+40; if(window.parent) window.parent.postMessage({turnitLessonHeight:h},'*'); }
```

Call `postHeight()` after **every** DOM change, plus on load, on resize, and on a
1000ms interval. The parent page uses it to resize the iframe.

### Block 2 — Full-screen aware prompt
Swaps the last slide's copy between "Scroll Down To Continue" and "Close Full Screen
To Continue". Copy verbatim, change the prefix.

### Block 3 — Green hover terms
Harvests the glossary from the slide-1 chips and wraps the first mention of each term
per slide. See §7.

### Block 4 — Pagination layer
Shows one slide at a time, locks Next, reads the `data-*` state. See §6.

---

## 6. Gating — the part people get wrong

The pagination layer **never** talks to the widgets directly. It only reads state the
content layer published on the container. This is what makes gates un-cheatable.

```js
var GATES=[
  {step:2, key:'fund',  need:3, hint:function(n){ return 'Reviewed '+n+' of 3 — tap them all to continue'; }},
  ...
];
root.addEventListener('XX-state',function(){
  GATES.forEach(function(g){
    var n=+(root.getAttribute('data-'+g.key)||0);
    if(n>=g.need) markDone(g.step); else liveHint(g.step, g.hint(n));
  });
});
```

Rules:

1. **Count distinct items, not clicks.** Use an object as a set
   (`seen[k]=1; state('key', Object.keys(seen).length)`). Tapping one card six times
   must leave the counter at 1. This is explicitly tested.
2. **Sticky.** `markDone` sets `done[step]=true` and never unsets it. Pressing
   "↺ Start Over" clears the widget's visual state but the slide stays unlocked.
3. **Counter never exceeds its denominator.** If there are 6 possible combinations but
   the gate needs 4, display `Math.min(n,4)+' Of 4'`. A counter reading "5 Of 4" is a bug.
4. **Live hints.** While locked, the nav hint updates with progress
   ("Reviewed 2 of 3 — tap them all to continue"). It renders with a 🔒 via
   `.XX-nav-hint:not(:empty)::before{content:"\1F512\00a0";}`.
5. Slides 1, Recap and Complete are pre-unlocked: `var done={1:true,7:true,8:true};`

---

## 7. Green hover terms

Slide 1 defines 5–6 key terms as chips. Block 3 then scans every later slide and wraps
the **first mention per slide** of each term in a green dotted-underline span with a
dark tooltip on hover (desktop) / tap (touch).

The gotchas, all of which have bitten before:

- **Scope `PROSE` to non-interactive text only.** A term wrapped inside a `<button>`
  swallows the tap that button needs, because the term's handler calls
  `stopPropagation()`. The automated test asserts zero terms inside buttons.
  Typical selector:
  ```js
  var PROSE='.XX-p, .XX-sub, .XX-note, .XX-why, .XX-recap-item span, .XX-h2, '
          + '.XX-next-move, .XX-sort-row > span, .XX-case-q, .XX-disclaimer-inline';
  ```
- **Elements with an `id` are skipped** (`if(el.id) continue;`) because the content
  script rewrites them at runtime. This is the #1 cause of low term coverage: most
  explanatory copy is generated into id'd reveal boxes, which the engine never sees.
  **Fix by weaving terms into static prose**, not by changing the engine.
- **Sort longest phrase first** when terms overlap, or "dividend" eats "ex-dividend date":
  ```js
  TERMS.sort(function(a,b){ return b.t.length-a.t.length; });
  ```
- **Skip slide 1** — the chips already define the terms there:
  ```js
  if(sec.getAttribute('data-step')==='1') return;
  ```
- Don't let a term land in an `<h2>`. A green dotted word inside a big bold headline
  reads like a mistake. If it happens, reword the headline so the term falls in body copy.
- Don't let a term land on a dark background — the green fails contrast.
- Target **12–20 wrapped terms** across the lesson, present on most slides.

`ALT` maps each term to a regex alternation for its inflections:
```js
var ALT={ 'overlap':'overlaps?|overlapping', 'weighting':'weightings?|cap-weighted|equal-weighted' };
```

---

## 8. Mobile

- Sticky bottom nav so Next is always reachable. This was a real bug found in student
  feedback — on a phone the Next button sat below the fold on most slides.
  ```css
  #tn-XX .XX-nav{position:sticky; bottom:0; z-index:40;
    padding:12px 0 calc(12px + env(safe-area-inset-bottom,0px));
    background:var(--paper); border-top:1px solid var(--line);
    box-shadow:0 -10px 24px -18px rgba(22,32,43,.35);}
  ```
- Under 540px the nav hint moves **above** the buttons (`order:-1; flex:0 0 100%`)
  instead of being hidden.
- Multi-column grids collapse to one column. Stat tiles become label-left / value-right rows.
- **Zero horizontal overflow at 390px and 320px.** Tested.
- If a reference panel is needed while answering questions, make it
  `position:sticky; top:0` — see slide 3 of `08-how-to-read-a-fund-page.html`.
  A student can't answer questions about a page they've scrolled past.

Always include:
```css
@media (prefers-reduced-motion:reduce){
  #tn-XX .XX-reveal{opacity:1 !important; transform:none !important;}
  #tn-XX .XX-finish-arrow{animation:none !important;}
  /* kill transitions on animated widgets */
}
```

---

## 9. Creativity — read this twice

The lessons were criticised for being **too similar to each other**. Distinct mechanics
*within* a lesson is not enough. The fix that actually worked:

> **Give each lesson at least one slide that looks like something from real life**, not
> another panel of brand-coloured cards.

Working examples:

- `10-dividends` slide 2 — a **dark phone screen** with a stack of push notifications
  that slide in as you advance through four quarters. Nothing else in the course looks
  like it, and it shows "this happens automatically" better than any sentence could.
- `08-fund-page` slide 2 — a reconstruction of VOO's **actual published fund page**,
  eight numbered fields you tap.
- `09-fund-overlap` slide 3 — two **Venn circles** that physically slide together or
  apart to the real overlap percentage.
- `07-index` slide 2 — the real S&P 500 rulebook on a **dark panel**, then you run an
  admissions desk and admit/reject four companies.

Before building, check this list of mechanics **already used**, and don't just reach
for one of them:

```
tap-reveal cards → shared box      slider scrubbing a chart      fund × size picker grid
expanding table rows               myth/fact sorter              two-card reveal
match quiz (2–3 options)           admit/reject judgment         two-mode toggle machine
chain nodes                        sliding window over a bar     annotated hotspots on a document
value-lookup drill                 gap meter                     Venn pair picker
company × fund X-ray grid          phone notification feed       three-column progressive split
animated growth race               compass picker                scratch-off        drag-and-drop sort
flip-card grid                     proportional bubbles          real-geometry globe
```

**Limit: 1–2 creative widgets per lesson.** The rest are standard formats, which are
never restyled: Myth/Fact, quizzes, scenario decisions, side-by-side comparisons,
calculators, annotated documents, Recap, Complete.

Also vary the **colour treatment** between neighbouring lessons. If lesson 9 is a grid
of blue/teal/gold cards, lesson 10 should not be.

---

## 10. Content rules

- **Never re-teach an earlier lesson or teach a later one early.** Check `LESSON-LIST.md`.
  Example: dividend *taxes* belong to Module 3 Lesson 12, so lesson 10 deliberately
  leaves them out and says so in its header comment.
- **Real data, sourced and dated.** Name real funds and tickers (VOO, VTI, SPY, QQQ,
  VXUS, RSP). Look figures up — don't recall them. Put the sources and the as-of date in
  the file's header comment, and hedge in an inline disclaimer: *"published at the time
  of writing; check the live page before acting."*
- **Cross-lesson consistency.** If lesson 7 says the top 10 is 38.6%, lesson 9 says
  38.6% too. Pick one source and stick to it, or avoid restating the figure.
- **Where sources disagree, say so.** VOO/QQQ overlap is 34.5% or 46.4% depending on
  method, so the lesson says "about half" and explains why there's a range.
- **Never fabricate a record attributed to a real company.** The slide-10 notification
  is from a generic "Your Brokerage" with a neutral glyph — *not* Robinhood's name and
  logo on an invented message with invented amounts. Reference real companies in prose
  instead ("Robinhood puts this setting under Account → Menu → Investing"), and verify
  the claim first.
- **Answer-key hygiene.** Vary correct-answer positions. Never run the same letter five
  times, never a clean A-B-C-D cycle, and never make the correct option conspicuously
  the longest. This has been caught repeatedly — check it every time.
- **Myth/Fact pattern.** Mix them (M F M F M), don't cluster.
- **Hedge honestly.** Label every projection hypothetical. If a chart is illustrative,
  say "not drawn to scale" or "an illustration, not a forecast and not a replay of history".
- No product recommendations. Funds are named "because they are widely held and easy to
  look up, not as recommendations."
- Keep the full "educational purposes only" disclaimer on the last slide.
- **Verify every quote's attribution** before using it. Used so far: Bogle ×2, Lynch,
  Buffett, Rockefeller, Munger.

---

## 11. Copy style

- Title Case for every heading, label, chip, counter and button. Small words stay
  lowercase unless first: *"Cash vs. Invested Assets"*, *"What Compounding Actually Needs"*.
- Body copy in sentence case, second person, plain words.
- **Be concise.** One short sentence of instruction per slide. Cut anything that
  restates the previous sentence.
- The **one exception**: never cut the "why" in Myth/Fact explanations or quiz feedback.
  That's where the teaching happens.
- The Recap is exactly **six ✓ lines** plus a "Your next move:" line that names a
  concrete two-minute action.

---

## 12. Verification — run before claiming anything works

`verify/` has both harnesses. Run them on every lesson, every time.

```bash
python3 verify/static-checks.py lessons/09-fund-overlap.html
node verify/verify-lesson.js lessons/09-fund-overlap.html
```

**Static checks:** script syntax (`node --check`), dangling/duplicate IDs, unprefixed
classes, `data-step` sequence vs `TOTAL`, kicker numbering, gate keys vs published state
keys, recap row count, chip count, literal `\uXXXX` escapes in markup (they render as
plain text in HTML attributes — recurring bug), and stray quotes inside `data-def`
attributes (this broke a chip once).

**Behavioural checks (Playwright, headless Chromium at `/opt/pw-browsers/chromium`):**
walk all slides at **1280×900 and 390×700** — every gate locks and unlocks, every reset
leaves the slide unlocked, spamming one control doesn't advance a counter, Next is
on-screen on every slide, zero horizontal overflow, no console errors, tooltip opens and
fits the viewport, zero green terms inside buttons, six recap rows, and a backwards walk
through every slide.

Then **look at screenshots** of any new widget at 390px. The automated pass won't catch
a slider that reads like a progress bar or a green word in a headline — both were found
by eye.

Two cautions learned the hard way:

- When a test fails, check whether the *test* is wrong before "fixing" working code.
  Several failures were bad expectations.
- Full-page screenshots render `position:sticky` elements at their scroll position, so
  the sticky nav appears to overlap content. Take a viewport-sized screenshot to confirm.

---

## 13. Build order

1. Settle the lesson's **one core idea** and the 5–6 key terms.
2. **Research and verify the real figures first.** Record sources + as-of date.
3. Decide the **two creative widgets** and check them against §9's used-mechanics list.
4. Decide the **visual world** — what does at least one slide look like from real life?
5. Write the file end to end (markup → style → four scripts).
6. Static checks → fix → behavioural checks → fix.
7. Screenshot the new widgets at 390px and actually look at them.
8. Report what was built, what was verified, and anything you had to judge.

Do not gather material *after* opening a skill or template — you end up with a polished
file and thin content.

---

## 14. Known recurring bugs

| Bug | Symptom | Fix |
|---|---|---|
| Literal `—` in markup | Renders as the text `—` | Scan the markup region (before `<style>`); JS string escapes are fine |
| Nested `"` in `data-def` | Attribute terminates early, chip breaks | Rephrase; the static check catches it |
| Green term inside a button | Card tap does nothing | Remove that selector from `PROSE` |
| Term in an `<h2>` | Green dotted word in a big headline | Reword the headline |
| Low term coverage | Only 4–9 wrapped | Weave terms into static prose; id'd elements are skipped |
| Counter overshoot | "5 Of 4" | `Math.min(n,need)` |
| Class name collision | e.g. `.XX-quote` used for a dark panel *and* the pull quote | Rename one; static check flags duplicates |
| Tooltip overflows at 320px | Tip wider than viewport | `box-sizing:border-box` on `.XX-tip` |
| `setInterval` keeps Node alive | jsdom test hangs | `dom.window.close(); process.exit(0)` |

---

## 15. Open decisions in the current set

- **Three Portfolio Models ships twice** — `05-three-portfolio-models-compared.html`
  (weather-test widget) and `05-ALT-three-portfolio-models-build.html` (assemble-a-
  portfolio bench). Both are finished and verified. Pick one.
- **Lessons 01–05 lack the sticky-nav fix.** Only 06–10 have it. Worth a sweep.
- **Five lessons have 5-line recaps** (03, 04, both 05s, 06) against the six-line standard.
- **Lesson 01 has 7 key-term chips** against the 5–6 standard.
- **No Intermediate quizzes exist yet.** The quiz files that exist are for the Beginner
  course. The quiz format is a separate standalone funnel page, not part of a lesson.
