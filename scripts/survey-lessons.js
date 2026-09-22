#!/usr/bin/env node
'use strict';
/* One-off survey to understand structure variance across lesson files before writing the nav-fit patcher. */
const fs = require('fs');
const path = require('path');

const dir = __dirname + '/..';
const files = fs.readdirSync(dir).filter(f =>
  f.startsWith('turnit-') && f.endsWith('.html') && f !== 'turnit-tracking-block.html'
);

const rows = [];
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const idMatch = src.match(/<div\s+id="tn-([a-z0-9]+)"/i);
  const prefix = idMatch ? idMatch[1] : null;
  const styleOpenCount = (src.match(/<style[\s>]/gi) || []).length;
  const styleCloseCount = (src.match(/<\/style>/gi) || []).length;
  const hasNavClass = prefix ? new RegExp('\\b' + prefix + '-nav\\b').test(src) : false;
  const hasNavHintRule = prefix
    ? new RegExp('#tn-' + prefix + '\\s*\\.' + prefix + '-nav-hint\\s*\\{\\s*display\\s*:\\s*none\\s*;?\\s*\\}').test(src)
    : false;
  const hasMarker = src.includes('NAV-FIT PATCH');
  const hasPaper = /--paper\s*:/.test(src);
  const hasLine = /--line\s*:/.test(src);
  const hasInk2 = /--ink2\s*:/.test(src);
  rows.push({ f, prefix, styleOpenCount, styleCloseCount, hasNavClass, hasNavHintRule, hasMarker, hasPaper, hasLine, hasInk2 });
}

for (const r of rows) {
  console.log(
    r.f.padEnd(52),
    'prefix=' + (r.prefix || 'NONE').padEnd(6),
    'style=' + r.styleOpenCount + '/' + r.styleCloseCount,
    'nav=' + r.hasNavClass,
    'hintRule=' + r.hasNavHintRule,
    'marker=' + r.hasMarker,
    'vars(paper/line/ink2)=' + r.hasPaper + '/' + r.hasLine + '/' + r.hasInk2
  );
}

console.log('\nTotal files:', rows.length);
console.log('No prefix detected:', rows.filter(r => !r.prefix).length);
console.log('No nav class:', rows.filter(r => !r.hasNavClass).length);
console.log('Nav but no hint-hide rule:', rows.filter(r => r.hasNavClass && !r.hasNavHintRule).length);
console.log('Multiple <style> blocks:', rows.filter(r => r.styleOpenCount > 1).length);
console.log('Missing one of --paper/--line/--ink2 (but has nav):', rows.filter(r => r.hasNavClass && !(r.hasPaper && r.hasLine && r.hasInk2)).length);
