# TURNIT — Intermediate Investing

Everything needed to keep building this course: the 22 lessons that exist, the full
build standard, and the verification tooling.

```
README.md          you are here
BUILD-GUIDE.md     the complete standard — hand this to Claude Code
LESSON-LIST.md     all 35 lessons, what's built, what's outlined, open decisions
lessons/           25 files
verify/            static + behavioural checks
```

---

## Using a lesson

Each `.html` file is a self-contained fragment. Paste the whole thing into a
**GoHighLevel funnel page → Custom Code / HTML element**, then display that page in an
iframe. No build step, no dependencies beyond Google Fonts.

The lesson posts its height to the parent window so the iframe can resize:

```js
window.parent.postMessage({turnitLessonHeight: h}, '*');
window.parent.postMessage({turnitScrollTop: 1}, '*');   // on slide change
```

Your parent page should listen for both.

---

## Giving this to Claude Code

Point it at `BUILD-GUIDE.md` first, then a recent lesson as the reference
implementation. Something like:

> Read BUILD-GUIDE.md and LESSON-LIST.md. Then read lessons/09-fund-overlap.html and
> lessons/10-dividends-and-total-return.html as the reference implementation — those two
> are the newest and pass every check.
>
> Build Module 3 Lesson 11, "Asset Location: What Belongs In Which Account."
>
> Follow the guide exactly: new two-letter prefix, 8 slides, 5–6 key terms, six recap
> lines, two creative widgets that aren't on the used-mechanics list, and at least one
> slide that looks like something from real life rather than another panel of
> brand-coloured cards. Research the real figures before writing and cite them in the
> header comment. Then run both verification harnesses and fix what they find.

Lessons 07–10 pass every check with zero warnings — use those as the model, not 01–05.

---

## Verification

```bash
python3 verify/static-checks.py lessons/09-fund-overlap.html
node    verify/verify-lesson.js  lessons/09-fund-overlap.html          # needs: npm i playwright
node    verify/verify-lesson.js  lessons/09-fund-overlap.html --shots  # also writes PNGs
```

Both auto-detect the lesson's `#tn-XX` prefix, so they work on any lesson including
new ones.

**static-checks.py** — JS syntax, dangling/duplicate IDs, class scoping, `data-step`
sequence vs `TOTAL`, kicker numbering, gate keys vs published state, recap line count,
chip count, sticky nav, reduced-motion, `postHeight`, literal `\uXXXX` escapes in markup,
stray quotes in `data-def` attributes, and myth/fact answer-key patterns.

**verify-lesson.js** — walks every slide at 1280×900 and 390×700: every gate opens,
Start Over never re-locks a slide, Next stays on-screen, zero horizontal overflow, no
console errors, reaches the last slide, walks all the way back, tooltip opens and fits,
and no green terms trapped inside buttons or headings.

Two things the tools can't judge — check them by eye on a 390px screenshot:

- whether a widget *reads* correctly (a slider that looks like a progress bar passed
  every automated check and was still wrong)
- whether the lesson looks too much like the one before it

---

## Current state

| | |
|---|---|
| Built | 25 lessons — Modules 1, 2, 3, 4, and 5 complete |
| Outlined | 10 lessons — Modules 6–7 |
| Passing every check | all 25 (01–25), at desktop and phone widths |
| Intermediate quizzes | not built yet |

The lesson-5 duplicate, the missing sticky nav on 01–05, the 5-line recaps, lesson 01's
7th chip, and a couple of bugs the harness itself was missing (see LESSON-LIST.md's
backlog section for the full list) have all been fixed and reverified. Nothing in the
backlog currently blocks shipping 01–10.

> `01` reports a warning about gate keys `jobs` and `myth`. That one is **fine** — the
> lesson publishes those keys dynamically, which a regex can't resolve. Verified by hand.
