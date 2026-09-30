---
name: turnit
description: House style and build process for TURNIT financial-literacy lesson files (self-contained HTML/CSS/JS embeds pasted into a GoHighLevel custom code element). Invoke whenever the user types /turnit, or asks to create, edit, revise, polish, "clean up," or "run the standard pass on" a TURNIT lesson, module quiz, or funnel-page HTML file — including requests about title slides, key-term chips, green vocabulary/hover terms, Myth/Fact slides, recap or Complete slides, Start Over buttons, or gating. Also covers the standalone /capitalize pass (title-case a lesson's titles/labels/chips/buttons without touching sentence copy) when the user types /capitalize by itself.
---

# TURNIT lesson build process

TURNIT lessons are single self-contained HTML files: one `<div id="tn-XX">`
per lesson, inline `<style>` and `<script>`, pasted into a GoHighLevel
Custom Code element and iframed. There is no build step and no shared
runtime — every lesson carries its own copy of the engine code it needs.

The user's own working file is always the base. Never restart a lesson
from a template. Keep the container ID, existing content, slide order,
and voice. If the user says to leave certain slides alone, leave them
byte-for-byte alone, and diff the new file against the old one before
delivering to confirm nothing untouched actually moved.

## The 9 core steps

Apply all 9 unless the user asks for something narrower (like a bare
`/capitalize` pass, which runs step 4 only and touches nothing else).

1. **Title slide with key-term chips.** A green kicker line, a big
   all-caps title (half dark ink, half a blue-to-green gradient), and
   5–6 green term pills. Tapping or hovering a pill reveals its
   definition in a white box. Add this by default on slide 1 unless
   told otherwise — it's the lesson's on-ramp into its own vocabulary.

2. **Green hover terms throughout the lesson.** Key words in body copy
   are green with a dotted underline; hovering (or tapping, on a phone)
   shows a dark tooltip with the definition. Every definition — on the
   title chips and in the hover terms alike — comes from one shared
   glossary object in the script, so a term's wording never drifts
   between the two places it appears.

3. **Concision pass.** Cut every slide to the fewest words that still
   teach it: one line of card text, one short instruction per slide,
   filler trimmed. The one thing this pass never touches is the *why*
   inside a Myth/Fact explanation or quiz feedback — that reasoning is
   where the actual teaching happens, so it survives every trim.

4. **`/capitalize` pass.** Every word in titles, labels, chips,
   counters, and buttons gets a capital letter. Ordinary sentence copy
   (card text, explanations, instructions) is left exactly as written —
   this pass is about UI chrome, not prose. If the user's whole message
   is just `/capitalize`, do only this step and nothing else.

5. **Grammar pass** across the whole lesson.

6. **Balanced interactivity.** Standard formats (listed below) keep
   their existing shape — they are not creative canvases. The *only*
   slide eligible for a creative upgrade is a plain tap-to-reveal list
   that repeats the same shape as a slide right next to it; if a slide
   is already doing something distinct, leave it. Cap: 1–2 creative
   widgets per lesson, total. If the user explicitly asks to "make it
   more creative," that raises the ceiling for that one request only —
   it still never touches the standard formats, and the cap reverts
   after.

7. **Recap slide, checklist format.** Heading "Here's What You Now
   Know," six ✓ lines summarizing the lesson, then one "Your next move"
   line. Never a badge grid.

8. **Final "Complete" slide, green-box format.** Tells the learner to
   scroll down and click Mark As Complete, then Next Lesson. The
   wording swaps when the lesson is viewed full-screen (see the
   full-screen-aware prompt pattern already used across the lesson
   set). Ends on a short quote. No certificate, no badge.

9. **"↺ Start Over" buttons** on activities worth redoing: quizzes,
   Myth/Fact, drag-and-drop, flip grids, scratch cards. Sliders,
   toggles, and single-select pickers don't get one — there's nothing
   to "redo" in a way that changes the outcome.

## Rules that always apply

- **Output format:** one self-contained block of plain HTML/CSS/JS,
  pasteable into a GHL custom code element. No JSX, no React, no
  external build tooling. Images are embedded directly in the file
  (base64 or inline SVG) — never linked out.
- **Base and diff:** the existing file is the source of truth for
  container ID, content, slide order, and voice. Slides the user marks
  hands-off are compared against the prior version before delivery to
  confirm they're unchanged.
- **Brand look:** TURNIT blue (`#1568AE`) and green (`#209B73`),
  Poppins for headings/labels, Inter for body text, vocabulary always
  in green. All animation respects `prefers-reduced-motion`.
- **Slide structure:** Title slide, then one interactive per slide with
  Next locked until that slide's activity is actually done, then Recap,
  then Complete. Progress bar and "Slide N of M" live in the header.
  The "educational purposes only" disclaimer appears once, on the last
  slide only.
- **Gating that can't be cheated:** spamming one button never unlocks a
  slide on its own — the gate reads real interaction state. Once a
  slide is unlocked it stays unlocked, even if the learner hits Start
  Over on that slide's activity afterward.
- **Standard formats are never restyled:** Myth/Fact, quizzes, scenario
  decisions, side-by-side comparisons, calculators/simulators,
  annotated documents, Recap, and Complete all keep one consistent
  layout across every lesson. If a lesson already has a working version
  of one of these, port its existing layout — don't redesign it.
- **Creative patterns, used only where step 6 allows them:** trail/path,
  flip-card grid, scratch-off card, compass picker, scenario match,
  drag-and-drop sort.
- **Content rules:** define jargon for a true beginner; never re-teach
  a concept from an earlier lesson or reach forward into a later one;
  use realistic scenarios; keep every claim accurate and appropriately
  hedged; never recommend a specific product, broker, or ticker; label
  any projection as hypothetical; keep the educational-purposes-only
  disclaimer.
- **Technical must-work items:** drag-and-drop functions reliably
  inside an iframe (pointer + touch events, not just mouse); a scratch
  card ships with a "Reveal All" fallback for anyone who can't
  scratch it; the lesson posts its height to the parent window on load
  and resize so the GHL iframe resizes to fit rather than clipping or
  scrolling internally.

## Checks before delivery

**Code checks** — go through these explicitly, don't just eyeball it:
- No stray escape codes or mis-encoded characters.
- Slide numbers (`data-step`, "Slide N of M" labels) are sequential
  with no gaps or duplicates.
- Every `id` an event listener or `querySelector` references actually
  exists in the markup; every glossary term used by a chip or hover
  term has a definition; every class referenced in JS has its CSS rule.
- No leftovers from anything removed this pass (dead CSS, orphaned
  click handlers, stale comments describing a structure that's gone).
- No doubled words, no double spaces, no unclosed tags.

**A full automated click-through**, at both desktop and phone widths:
- Every gate unlocks the way it's supposed to, and every Start Over
  button actually resets its activity.
- Hover tooltips work with a mouse; tap equivalents work on touch.
- Drag-and-drop and scratch-card interactions both function.
- No horizontal overflow at narrow widths.
- Zero console errors.
- Take screenshots of any new or changed widgets so the result can be
  eyeballed, not just asserted.

Use Playwright for the click-through when it's available in the
environment (it has been in this repo's sessions) — load the file with
`file://`, drive the interactions, and check `page.on('pageerror')` /
`page.on('console')` for errors rather than assuming a green run. If
Playwright genuinely isn't available, say so plainly rather than
claiming the check passed.
