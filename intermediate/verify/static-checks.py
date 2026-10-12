#!/usr/bin/env python3
"""
TURNIT lesson static checks.

    python3 verify/static-checks.py lessons/09-fund-overlap.html

Auto-detects the lesson's #tn-XX prefix. Exits non-zero if anything fails.
Requires `node` on PATH for the JS syntax check.
"""
import os
import re
import subprocess
import sys
import tempfile

SHARED_STATE_CLASSES = {
    'center', 'in', 'on', 'prev', 'next', 'done', 'right', 'off', 'correct',
    'wrong', 'picked', 'answer', 'locked', 'is-disabled', 'up', 'total', 'last',
    'open', 'head', 'wide', 'share', 'cash', 'hit', 'miss', 'mid', 'lit', 'flash',
}
# per-lesson data-palette helpers follow these shapes
HELPER_RE = re.compile(r'^[a-z]-[a-z]$')

fails, warns = [], []


def fail(msg):
    fails.append(msg)


def warn(msg):
    warns.append(msg)


def main(path):
    src = open(path, encoding='utf-8').read()

    m = re.search(r'id="tn-([a-z]{2,3})"', src)
    if not m:
        print('FATAL: no #tn-XX container found'); sys.exit(2)
    px = m.group(1)
    print(f'lesson prefix: {px}   file: {os.path.basename(path)}   {len(src):,} bytes\n')

    markup = src.split('<style>')[0]
    scripts = re.findall(r'<script>(.*?)</script>', src, re.S)

    # ---- 1. JS syntax -------------------------------------------------------
    if len(scripts) != 4:
        warn(f'expected 4 <script> blocks, found {len(scripts)}')
    with tempfile.TemporaryDirectory() as td:
        for i, sc in enumerate(scripts):
            f = os.path.join(td, f's{i}.js')
            open(f, 'w', encoding='utf-8').write(sc)
            r = subprocess.run(['node', '--check', f], capture_output=True, text=True)
            if r.returncode != 0:
                fail(f'script block {i} syntax error:\n{r.stderr.strip()}')
    print(f'  scripts ............ {len(scripts)} blocks, syntax OK')

    # ---- 2. IDs -------------------------------------------------------------
    all_ids = re.findall(r'\sid="([^"]+)"', src)
    ids = set(all_ids)
    dup = sorted({x for x in all_ids if all_ids.count(x) > 1})
    if dup:
        fail(f'duplicate ids: {dup}')
    refs = set(re.findall(rf'#({px}-[A-Za-z0-9-]+)', src)) \
        | set(re.findall(r"getElementById\('([^']+)'\)", src))
    missing = sorted(r for r in refs
                     if r not in ids and not r.startswith('tn-') and not r.endswith('-'))
    if missing:
        fail(f'ids referenced but never defined: {missing}')
    print(f'  ids ................ {len(ids)} defined, 0 dangling, 0 duplicate')

    # ---- 3. class prefixing -------------------------------------------------
    cls = set()
    for mm in re.findall(r'class="([^"]+)"', markup):
        cls.update(mm.split())
    # a bare class is fine when the CSS only ever targets it as a descendant of
    # this lesson's scope, e.g. "#tn-al .al-flip .front"
    scoped_desc = set(re.findall(rf'#tn-{px}[^{{]*?\.([a-z][a-z0-9-]*)\s*[,{{]', src))
    bad = sorted(c for c in cls
                 if not c.startswith(px + '-')
                 and c not in SHARED_STATE_CLASSES
                 and not HELPER_RE.match(c)
                 and c not in scoped_desc)
    if bad:
        fail(f'classes neither prefixed "{px}-" nor scoped as a descendant: {bad}')
    print(f'  classes ............ {len(cls)} used, all scoped')

    # ---- 4. slide sequence --------------------------------------------------
    steps = sorted(int(x) for x in set(re.findall(r'data-step="(\d+)"', src)))
    tm = re.search(r'var TOTAL=(\d+)', src)
    total = int(tm.group(1)) if tm else None
    if steps != list(range(1, len(steps) + 1)):
        fail(f'data-step values are not 1..N: {steps}')
    if total != len(steps):
        fail(f'TOTAL={total} but {len(steps)} sections exist')
    kick = re.findall(rf'class="{px}-kicker[^"]*">([^<]+)<', src)
    for i, k in enumerate(kick, 1):
        want = f'{i} / {total}'
        if want not in k:
            fail(f'kicker {i} reads "{k}" — expected it to contain "{want}"')
    print(f'  slides ............. {len(steps)} sections, TOTAL={total}, kickers numbered')

    # ---- 5. gates vs published state ---------------------------------------
    gates = re.findall(r"\{step:(\d+),\s*key:'(\w+)',\s*need:(\d+)", src)
    published = set(re.findall(r"state\('(\w+)'", src))
    gate_keys = {g[1] for g in gates}
    # some lessons publish a key dynamically, e.g.
    #   state(wrapId==='al-jobs'?'jobs':'myth', n)
    # a regex can't resolve those, so only warn when such a call exists
    dynamic = bool(re.search(r"state\(\s*[^'\)]", src))
    orphan = sorted(gate_keys - published)
    unused = sorted(published - gate_keys)
    if orphan and dynamic:
        warn(f'gates read state not published by a literal call: {orphan} '
             f'(this lesson also publishes keys dynamically — verify by hand)')
    elif orphan:
        fail(f'gates read state never published: {orphan}')
    if unused:
        warn(f'state published but no gate reads it: {unused}')
    done = re.search(r'var done=\{([^}]*)\}', src)
    ungated = set()
    if done:
        ungated = {int(x) for x in re.findall(r'(\d+):true', done.group(1))}
    covered = {int(g[0]) for g in gates} | ungated
    missing_steps = sorted(set(steps) - covered)
    if missing_steps:
        fail(f'slides neither gated nor pre-unlocked: {missing_steps}')
    print(f'  gating ............. {len(gates)} gates, pre-unlocked {sorted(ungated)}')

    # ---- 6. /turnit structure ----------------------------------------------
    recap = len(re.findall(rf'<div class="{px}-recap-item">', src))
    if recap != 6:
        fail(f'recap has {recap} lines — the standard is 6')
    chips = len(re.findall(rf'<button type="button" class="{px}-vocab-chip', src))
    if not 5 <= chips <= 6:
        fail(f'{chips} key-term chips — the standard is 5-6')
    if f'{px}-reveal' not in src:
        warn('no reveal animation class found')
    if 'position:sticky; bottom:0' not in src:
        fail('nav is not sticky — Next can fall below the fold on a phone')
    if 'prefers-reduced-motion' not in src:
        fail('no prefers-reduced-motion block')
    if 'turnitLessonHeight' not in src:
        fail('lesson never posts its height to the parent iframe')
    print(f'  structure .......... {recap} recap lines, {chips} chips, sticky nav, '
          f'reduced-motion, postHeight')

    # ---- 7. known recurring bugs -------------------------------------------
    esc = re.findall(r'\\u[0-9a-fA-F]{4}', markup)
    if esc:
        fail(f'literal unicode escapes in markup (render as text): {sorted(set(esc))}')
    stray = [a for a in re.findall(r'data-def="([^"]*)"', src) if '"' in a]
    if stray:
        fail(f'{len(stray)} data-def attribute(s) contain a stray double quote')
    print('  known bugs ......... no literal escapes, no stray quotes in attributes')

    # ---- 8. answer-key hygiene ---------------------------------------------
    myth = re.findall(r'data-answer="(myth|fact)"', src)
    if myth:
        runs, cur = 1, 1
        for i in range(1, len(myth)):
            cur = cur + 1 if myth[i] == myth[i - 1] else 1
            runs = max(runs, cur)
        if runs >= 4:
            fail(f'myth/fact answers run {runs} identical in a row: {myth}')
        elif runs == 3:
            warn(f'myth/fact has 3 identical in a row: {myth}')
        print(f'  myth/fact .......... {len(myth)} claims, pattern {"".join(x[0].upper() for x in myth)}')

    for grp, lbl in ((r'data-ans="(\d+)"', 'numeric'), (r'data-ans="([a-z]{1,2})"', 'letter')):
        vals = re.findall(grp, src)
        if len(vals) >= 3 and len(set(vals)) == 1:
            warn(f'all {len(vals)} {lbl} answers are "{vals[0]}" — vary the correct position')

    # ---- report -------------------------------------------------------------
    print()
    for w in warns:
        print(f'  WARN  {w}')
    for f_ in fails:
        print(f'  FAIL  {f_}')
    if fails:
        print(f'\n{len(fails)} failure(s), {len(warns)} warning(s)')
        sys.exit(1)
    print(f'\nAll static checks passed ({len(warns)} warning(s)).')


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(__doc__); sys.exit(2)
    main(sys.argv[1])
