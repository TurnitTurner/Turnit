#!/usr/bin/env node
/**
 * TURNIT lesson behavioural verification.
 *
 *     node verify/verify-lesson.js lessons/09-fund-overlap.html
 *     node verify/verify-lesson.js lessons/09-fund-overlap.html --shots
 *
 * Walks every slide at desktop and phone widths with Playwright and checks the
 * things that actually broke in practice. Auto-detects the lesson's #tn-XX prefix.
 *
 * Needs: npm i playwright   (Chromium at /opt/pw-browsers/chromium if present)
 *
 * This is a generic harness. It exercises gates by clicking every button inside
 * each slide, which unlocks most widgets. Widgets driven by a range input or a
 * timed animation are handled too. If a new widget needs something special, add
 * a case to `drive()` rather than loosening a check.
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FILE = process.argv[2];
const SHOTS = process.argv.includes('--shots');
if (!FILE) { console.error('usage: node verify-lesson.js <lesson.html> [--shots]'); process.exit(2); }

const src = fs.readFileSync(FILE, 'utf8');
const PX = (src.match(/id="tn-([a-z]{2,3})"/) || [])[1];
if (!PX) { console.error('FATAL: no #tn-XX container found'); process.exit(2); }
const TOTAL = parseInt((src.match(/var TOTAL=(\d+)/) || [])[1], 10);

const fails = [];
const fail = (m) => { fails.push(m); };

// wrap the fragment into a real page
const tmp = path.join(require('os').tmpdir(), `turnit-verify-${Date.now()}.html`);
fs.writeFileSync(tmp,
  "<!doctype html><html><head><meta name=viewport content='width=device-width,initial-scale=1'>" +
  "</head><body style='margin:0'>" + src + "</body></html>");

const EXEC = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;

async function unlocked(pg) {
  return !(await pg.evaluate((p) => document.querySelector('#' + p + '-next').classList.contains('locked'), PX));
}

// Exercise a slide's controls, stopping as soon as its gate opens.
// Adaptive so slides without timed widgets don't pay the animation wait.
async function drive(pg, step) {
  const sliders = await pg.$$(`[data-step="${step}"] input[type=range]`);
  for (const s of sliders) {
    const min = +(await s.getAttribute('min') || 0);
    const max = +(await s.getAttribute('max') || 100);
    for (let i = 0; i <= 4; i++) {
      const v = Math.round(min + (max - min) * i / 4);
      await s.evaluate((el, val) => { el.value = val; el.dispatchEvent(new Event('input', { bubbles: true })); }, v);
      await pg.waitForTimeout(60);
    }
    if (await unlocked(pg)) return;
  }
  for (let pass = 0; pass < 3; pass++) {
    const btns = await pg.$$(`[data-step="${step}"] button:not([disabled]):not(.${PX}-reset-btn)`);
    if (!btns.length) break;
    for (const b of btns) {
      try { await b.click({ timeout: 1200 }); } catch (e) { /* hidden or detached */ }
      await pg.waitForTimeout(90);
    }
    if (await unlocked(pg)) return;
    // a timed widget (growth race) may still be running — give it one chance
    await pg.waitForTimeout(2200);
    if (await unlocked(pg)) return;
  }
}

async function run(w, h, label) {
  const browser = await chromium.launch({ executablePath: EXEC });
  const pg = await browser.newPage({
    viewport: { width: w, height: h }, hasTouch: w < 600, isMobile: w < 600,
  });
  const errs = [];
  pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  pg.on('console', (m) => {
    if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME|fonts\.googleapis/.test(m.text())) {
      errs.push('console: ' + m.text());
    }
  });
  await pg.goto('file://' + tmp);
  await pg.waitForTimeout(500);

  const locked = () => pg.evaluate((p) => document.querySelector('#' + p + '-next').classList.contains('locked'), PX);
  const ovf = () => pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const nextVis = () => pg.evaluate((p) => {
    const r = document.querySelector('#' + p + '-next').getBoundingClientRect();
    return r.top >= 0 && r.bottom <= innerHeight + 0.5;
  }, PX);
  const cur = () => pg.evaluate((p) => document.querySelector('#' + p + '-slide-count').textContent, PX);

  console.log(`\n--- ${label} (${w}x${h}) ---`);

  for (let step = 1; step <= TOTAL; step++) {
    const o = await ovf();
    if (o > 0) fail(`${label} slide ${step}: ${o}px horizontal overflow`);
    if (!await nextVis() && step < TOTAL) fail(`${label} slide ${step}: Next button is off-screen`);

    const wasLocked = await locked();
    await drive(pg, step);
    const nowLocked = await locked();

    if (step < TOTAL && nowLocked) {
      fail(`${label} slide ${step}: still locked after exercising every control`);
    }

    // resets must not re-lock the slide
    const resets = await pg.$$(`[data-step="${step}"] .${PX}-reset-btn`);
    for (const r of resets) {
      try { await r.click({ timeout: 1500 }); } catch (e) { }
      await pg.waitForTimeout(200);
      if (await locked()) fail(`${label} slide ${step}: Start Over re-locked the slide (gates must be sticky)`);
    }

    console.log(`  slide ${step}  ${await cur()}  locked ${wasLocked}->${nowLocked}  ovf ${o}  nextVis ${await nextVis()}`);

    if (SHOTS) {
      await pg.screenshot({ path: `shot-${PX}-${label}-s${step}.png` });
    }
    if (step < TOTAL) {
      if (await locked()) break;
      await pg.click(`#${PX}-next`);
      await pg.waitForTimeout(320);
    }
  }

  const end = await cur();
  if (!end.includes(`${TOTAL} Of ${TOTAL}`)) fail(`${label}: never reached the last slide (stopped at "${end}")`);

  // final slide chrome
  const hidden = await pg.evaluate((p) => getComputedStyle(document.querySelector('#' + p + '-next')).display, PX);
  if (hidden !== 'none') fail(`${label}: Next is still visible on the final slide`);
  const disc = await pg.evaluate((p) => getComputedStyle(document.querySelector('.' + p + '-disclaimer')).display, PX);
  if (disc === 'none') fail(`${label}: the full disclaimer is hidden on the final slide`);

  // walk all the way back
  for (let i = 0; i < TOTAL - 1; i++) { await pg.click(`#${PX}-prev`); await pg.waitForTimeout(120); }
  const back = await cur();
  if (!back.includes('1 Of')) fail(`${label}: Previous did not return to slide 1 (landed on "${back}")`);
  console.log(`  walked back to ${back}`);

  // spam-proofing: one control, many clicks, must not run a counter up
  await pg.evaluate((p) => document.querySelectorAll('.' + p + '-sec').forEach((s) => s.classList.remove(p + '-hide')), PX);
  await pg.waitForTimeout(150);

  // green terms
  const terms = await pg.evaluate((p) => {
    const bySlide = {};
    document.querySelectorAll('#tn-' + p + ' .' + p + '-sec').forEach((s) => {
      const t = [...s.querySelectorAll('.' + p + '-term')].map((e) => e.textContent);
      if (t.length) bySlide[s.getAttribute('data-step')] = t;
    });
    return {
      total: document.querySelectorAll('#tn-' + p + ' .' + p + '-term').length,
      inButtons: [...document.querySelectorAll('#tn-' + p + ' .' + p + '-term')]
        .filter((e) => e.closest('button')).map((e) => e.textContent),
      inHeadings: [...document.querySelectorAll('#tn-' + p + ' .' + p + '-h2 .' + p + '-term')]
        .map((e) => e.textContent),
      slides: Object.keys(bySlide).length, bySlide,
    };
  }, PX);
  console.log(`  green terms: ${terms.total} across ${terms.slides} slides`);
  Object.keys(terms.bySlide).forEach((k) => console.log(`    s${k}: ${terms.bySlide[k].join(' | ')}`));
  if (terms.inButtons.length) fail(`${label}: green terms inside buttons (they swallow the tap): ${JSON.stringify(terms.inButtons)}`);
  if (terms.inHeadings.length) fail(`${label}: green terms inside an <h2>: ${JSON.stringify(terms.inHeadings)}`);
  if (terms.total < 10) fail(`${label}: only ${terms.total} green terms — weave more into static prose (target 12-20)`);

  // tooltip
  const el = await pg.$(`#tn-${PX} .${PX}-term`);
  if (el) {
    await el.scrollIntoViewIfNeeded();
    await pg.waitForTimeout(350);
    if (w < 600) { await el.tap(); } else { await el.hover(); }
    await pg.waitForTimeout(280);
    const tip = await pg.evaluate((p) => {
      const t = document.querySelector('.' + p + '-tip');
      if (!t) return null;
      const r = t.getBoundingClientRect();
      return { hidden: t.hidden, w: Math.round(r.width), fits: r.left >= 0 && r.right <= innerWidth + 1 };
    }, PX);
    console.log(`  tooltip: ${JSON.stringify(tip)}`);
    if (!tip || tip.hidden) fail(`${label}: tooltip did not open`);
    else if (!tip.fits) fail(`${label}: tooltip overflows the viewport`);
  }

  if (errs.length) fail(`${label}: ${errs.length} console/page error(s): ${JSON.stringify(errs.slice(0, 4))}`);
  console.log(`  errors: ${errs.length ? errs.length : 'none'}`);

  await browser.close();
}

(async () => {
  console.log(`lesson prefix: ${PX}   TOTAL=${TOTAL}   file: ${path.basename(FILE)}`);
  await run(1280, 900, 'desktop');
  await run(390, 700, 'phone');
  try { fs.unlinkSync(tmp); } catch (e) { }
  console.log('');
  if (fails.length) {
    fails.forEach((f) => console.log('  FAIL  ' + f));
    console.log(`\n${fails.length} failure(s).`);
    process.exit(1);
  }
  console.log('All behavioural checks passed.');
  process.exit(0);
})();
