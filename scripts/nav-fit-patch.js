#!/usr/bin/env node
'use strict';
/*
 * Idempotent nav/fit CSS patcher for TURNIT lesson files.
 *
 * For each lesson HTML file:
 *   1. Detect the prefix from <div id="tn-XX">. Skip if no .XX-nav present.
 *   2. Skip if already patched (NAV-FIT PATCH marker present).
 *   3. Delete the mobile rule that hides the hint: #tn-XX .XX-nav-hint{display:none;}
 *   4. Insert the nav-fit CSS block just before the first </style>.
 *
 * Usage:
 *   node scripts/nav-fit-patch.js --dry-run [file...]   # show what would change, write nothing
 *   node scripts/nav-fit-patch.js [file...]              # patch in place
 *   node scripts/nav-fit-patch.js                        # patch every turnit-*.html lesson file in the repo root
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MARKER = 'NAV-FIT PATCH v1';

const PATCH_TEMPLATE = `
  /* ===== NAV-FIT PATCH v1 ===== */
  #tn-{{P}} .{{P}}-nav{position:sticky; bottom:-1px; z-index:40; flex-wrap:wrap;
    margin-top:18px; padding:12px 0 calc(13px + env(safe-area-inset-bottom,0px));
    background:var(--paper);
    border-top:1px solid var(--line); box-shadow:0 -10px 24px -18px rgba(22,32,43,.35);}
  #tn-{{P}} .{{P}}-nav-hint{font-size:13px; font-weight:600; color:var(--ink2); line-height:1.4;}
  #tn-{{P}} .{{P}}-nav-hint:not(:empty)::before{content:"\\1F512\\00a0";}
  #tn-{{P}} .{{P}}-top{margin-bottom:8px;}
  #tn-{{P}} .{{P}}-topbar{margin-bottom:8px;}
  #tn-{{P}} .{{P}}-sec{padding-top:10px;}
  @media (max-width:540px){
    #tn-{{P}} .{{P}}-nav-hint{display:block; order:-1; flex:0 0 100%; text-align:center; padding:0 4px 8px; font-size:12.5px;}
    #tn-{{P}} .{{P}}-nav-hint:empty{display:none;}
    #tn-{{P}} .{{P}}-nav{padding-top:10px; row-gap:0;}
  }
  @media (max-height:720px){
    #tn-{{P}} .{{P}}-h2{font-size:clamp(21px,3.4vw,27px); margin-bottom:8px;}
    #tn-{{P}} .{{P}}-p{margin-bottom:12px;}
  }
`;

function patchOne(filePath) {
  const name = path.basename(filePath);
  const src = fs.readFileSync(filePath, 'utf8');

  const idMatch = src.match(/<div\s+id="tn-([a-zA-Z0-9]+)"/);
  if (!idMatch) {
    return { name, status: 'skipped', reason: 'no <div id="tn-XX"> root found' };
  }
  const p = idMatch[1];

  const navRe = new RegExp('\\b' + p + '-nav\\b');
  if (!navRe.test(src)) {
    return { name, status: 'skipped', reason: `no .${p}-nav found (no nav bar)` };
  }

  if (src.includes(MARKER)) {
    return { name, status: 'skipped', reason: 'already patched (marker present)' };
  }

  const styleCloseIdx = src.indexOf('</style>');
  if (styleCloseIdx === -1) {
    return { name, status: 'flagged', reason: 'no </style> tag found; structure mismatch' };
  }

  let out = src;

  const hintHideRe = new RegExp(
    '[ \\t]*#tn-' + p + '\\s*\\.' + p + '-nav-hint\\s*\\{\\s*display\\s*:\\s*none\\s*;?\\s*\\}[ \\t]*\\r?\\n?'
  );
  const hadHintRule = hintHideRe.test(out);
  if (hadHintRule) {
    out = out.replace(hintHideRe, '');
  }

  const insertIdx = out.indexOf('</style>');
  const patchCss = PATCH_TEMPLATE.replace(/\{\{P\}\}/g, p);
  out = out.slice(0, insertIdx) + patchCss + out.slice(insertIdx);

  return {
    name,
    status: 'patched',
    prefix: p,
    hadHintRule,
    before: src,
    after: out,
  };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const fileArgs = args.filter(a => !a.startsWith('--'));

  let targets;
  if (fileArgs.length) {
    targets = fileArgs.map(f => path.resolve(f));
  } else {
    targets = fs.readdirSync(ROOT)
      .filter(f => f.startsWith('turnit-') && f.endsWith('.html') && f !== 'turnit-tracking-block.html')
      .map(f => path.join(ROOT, f))
      .sort();
  }

  const results = [];
  for (const filePath of targets) {
    const r = patchOne(filePath);
    results.push(r);
    if (r.status === 'patched' && !dryRun) {
      fs.writeFileSync(filePath, r.after, 'utf8');
    }
  }

  for (const r of results) {
    if (r.status === 'patched') {
      console.log(`PATCHED  ${r.name}  (prefix=${r.prefix}, hint-hide rule removed=${r.hadHintRule})${dryRun ? '  [dry-run, not written]' : ''}`);
    } else if (r.status === 'skipped') {
      console.log(`SKIPPED  ${r.name}  -- ${r.reason}`);
    } else {
      console.log(`FLAGGED  ${r.name}  -- ${r.reason}`);
    }
  }

  const counts = results.reduce((acc, r) => { acc[r.status] = (acc[r.status] || 0) + 1; return acc; }, {});
  console.log('\nSummary:', JSON.stringify(counts));
}

main();
