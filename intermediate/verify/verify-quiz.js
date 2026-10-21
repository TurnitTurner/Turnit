/* ============================================================
   Behavioural check for a TURNIT module-quiz funnel page.
   Not the lesson harness (verify-lesson.js) — quizzes have no slides,
   no gates, no chips; they're a single linear flow with its own shape.

   Walks the quiz at desktop and phone widths: answers a mix of right
   and wrong questions (right answers wait out the real 1.8s
   auto-advance timer rather than being special-cased), confirms the
   results screen shows the expected score, and checks for console
   errors and horizontal overflow exactly the way verify-lesson.js
   does, so the two harnesses agree on what "clean" means.

   Usage: node verify-quiz.js quizzes/module-1-quiz.html
   ============================================================ */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const file = process.argv[2];
if (!file) { console.error('usage: node verify-quiz.js <quiz.html>'); process.exit(1); }
const abs = path.resolve(file);
if (!fs.existsSync(abs)) { console.error('not found: ' + abs); process.exit(1); }

// pull the QUIZ config out of the file the same way a learner's browser
// would build it, so the expected answer key always matches the shipped file
const src = fs.readFileSync(abs, 'utf8');
const m = src.match(/var QUIZ\s*=\s*(\{[\s\S]*?\});\s*<\/script>/);
if (!m) { console.error('could not find QUIZ config in file'); process.exit(1); }
const QUIZ = eval('(' + m[1] + ')');
const N = QUIZ.questions.length;

let failed = false;
function fail(msg) { console.log('  FAIL  ' + msg); failed = true; }

async function run(width, height) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => {
    if (m.type() === 'error' && !/ERR_TUNNEL|ERR_NAME|ERR_CERT_AUTHORITY_INVALID|fonts\.googleapis/.test(m.text())) {
      errors.push('console: ' + m.text());
    }
  });

  await page.goto('file://' + abs);
  await page.waitForTimeout(300);

  const label = width < 600 ? 'phone' : 'desktop';
  console.log(`--- ${label} (${width}x${height}) ---`);

  // start screen
  const startBtn = await page.$('#qz-start');
  if (!startBtn) { fail(`${label}: no #qz-start button on the intro screen`); await browser.close(); return; }
  await startBtn.click();
  await page.waitForTimeout(200);

  // walk every question: miss the first one on purpose (to exercise the
  // wrong-answer path and #qz-go), get the rest right (to exercise the
  // real 1.8s auto-advance timer, not a mocked one)
  for (let i = 0; i < N; i++) {
    const q = QUIZ.questions[i];
    const opts = await page.$$('.qz-opt');
    if (opts.length !== 4) { fail(`Q${i + 1} (${label}): expected 4 options rendered, found ${opts.length}`); break; }

    const wrongIdx = i === 0 ? (q.a === 0 ? 1 : 0) : q.a; // miss Q1 deliberately, answer the rest correctly
    await opts[wrongIdx].click();
    await page.waitForTimeout(150);

    const fb = await page.$('.qz-fb');
    if (!fb) { fail(`Q${i + 1} (${label}): no feedback box appeared after answering`); break; }

    if (wrongIdx === q.a) {
      // correct: wait out the real auto-advance timer
      await page.waitForTimeout(2000);
    } else {
      // wrong: explicit continue button
      const go = await page.$('#qz-go');
      if (!go) { fail(`Q${i + 1} (${label}): answered wrong but no #qz-go continue button appeared`); break; }
      await go.click();
      await page.waitForTimeout(200);
    }
  }

  await page.waitForTimeout(400);
  const scoreEl = await page.$('.qz-score b');
  if (!scoreEl) {
    fail(`${label}: results screen never appeared (no .qz-score)`);
  } else {
    const scoreText = (await scoreEl.textContent()).trim();
    const expected = `${N - 1}/${N}`; // missed exactly Q1
    console.log(`  score shown: "${scoreText}" (expected "${expected}")`);
    if (scoreText !== expected) fail(`${label}: results score mismatch — got "${scoreText}", expected "${expected}"`);
  }

  const reviewMiss = await page.$('.qz-rvi.miss');
  if (!reviewMiss) fail(`${label}: results review doesn't show the one missed question`);

  // overflow check
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log(`  horizontal overflow: ${overflow}px`);
  if (overflow > 1) fail(`${label}: ${overflow}px of horizontal overflow`);

  console.log(`  errors: ${errors.length ? JSON.stringify(errors) : 'none'}`);
  if (errors.length) fail(`${label}: console/page errors present`);

  await browser.close();
}

(async () => {
  console.log(`quiz: ${path.basename(abs)}   questions: ${N}   title: ${QUIZ.lesson}`);
  await run(1280, 900);
  await run(390, 700);
  console.log(failed ? '\nFAILED' : '\nAll quiz behavioural checks passed.');
  process.exit(failed ? 1 : 0);
})();
