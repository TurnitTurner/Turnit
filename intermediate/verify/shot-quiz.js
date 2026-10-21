/* One-off screenshot helper for a quiz file, phone width.
   Usage: node shot-quiz.js quizzes/module-1-quiz.html out-prefix */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const file = path.resolve(process.argv[2]);
const prefix = process.argv[3] || 'shot-quiz';
const src = fs.readFileSync(file, 'utf8');
const QUIZ = eval('(' + src.match(/var QUIZ\s*=\s*(\{[\s\S]*?\});\s*<\/script>/)[1] + ')');
const N = QUIZ.questions.length;

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 700 } });
  await page.goto('file://' + file);
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${prefix}-intro.png` });

  await page.click('#qz-start');
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${prefix}-q1.png` });

  for (let i = 0; i < N; i++) {
    const q = QUIZ.questions[i];
    const opts = await page.$$('.qz-opt');
    const wrongIdx = i === 0 ? (q.a === 0 ? 1 : 0) : q.a;
    await opts[wrongIdx].click();
    await page.waitForTimeout(200);
    if (i === 0) await page.screenshot({ path: `${prefix}-wrong-feedback.png` });
    if (wrongIdx === q.a) {
      await page.waitForTimeout(2000);
    } else {
      await page.click('#qz-go');
      await page.waitForTimeout(200);
    }
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${prefix}-results.png`, fullPage: true });
  await browser.close();
})();
