#!/usr/bin/env python3
"""
Static checks for a TURNIT module-quiz funnel page (intermediate/quizzes/*.html).

Not the lesson harness: quizzes are a different shape (no chips, no
data-step slides, no recap), so static-checks.py's rules don't apply here.
This validates the QUIZ config block directly: 10 questions, 4 options
each, a valid correct-answer index, the 4/4/2 easy/medium/hard split, each
lesson referenced exactly twice, and an answer-key letter distribution
that isn't lopsided (the Foundations quizzes' own flaw: 7 of 10 answers
were B).

It also checks for length, since raw option-length comparability was
claimed but never measured and 69/70 questions across the first 7
Intermediate quizzes turned out to have the longest option be the correct
one (the correct option carried its own justification, distractors were
bare claims). Checked per quiz: the correct option is the strict longest
in at most 3 of 10 questions, the strict shortest in at most 3 of 10
(so "shortest wins" doesn't become the new tell), and no option within a
question is more than 2x the length of the shortest option in that
question. Also flags (warns, non-fatal) any question stem over 90 chars
or any option over 60 chars, as a concision nudge.

Usage: python3 -I quiz-static-checks.py quizzes/module-1-quiz.html
"""
import sys, re, json

def fail(msg):
    print("  FAIL  " + msg)
    global failed
    failed = True

def main():
    global failed
    failed = False
    path = sys.argv[1]
    src = open(path, encoding='utf-8').read()

    m = re.search(r'var QUIZ\s*=\s*(\{.*?\});\s*</script>', src, re.S)
    if not m:
        print("  FAIL  could not find `var QUIZ = {...};` config block")
        sys.exit(1)
    raw = m.group(1)

    # The config is JS, not strict JSON (unquoted keys, single quotes aren't
    # used here but trailing content and JS string escapes like — are).
    # Convert just enough to parse as JSON: quote bare keys.
    js = raw
    js = re.sub(r'([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*:', r'\1"\2":', js)
    try:
        cfg = json.loads(js)
    except Exception as e:
        print("  FAIL  could not parse QUIZ config as JSON after key-quoting: %s" % e)
        sys.exit(1)

    title = cfg.get('lesson', '')
    qs = cfg.get('questions', [])
    print("quiz title: %r   questions: %d" % (title, len(qs)))

    if len(qs) != 10:
        fail("expected exactly 10 questions, found %d" % len(qs))

    L_PREVIEW = ['A', 'B', 'C', 'D']
    diffs = {}
    lessons = {}
    letters = {0: 0, 1: 0, 2: 0, 3: 0}
    longest_correct = 0
    shortest_correct = 0
    warnings = []
    for i, q in enumerate(qs):
        n = i + 1
        opts = q.get('o', [])
        if len(opts) != 4:
            fail("Q%d: expected 4 options, found %d" % (n, len(opts)))
        a = q.get('a')
        if not isinstance(a, int) or not (0 <= a <= 3):
            fail("Q%d: answer index `a` is not 0-3 (got %r)" % (n, a))
        else:
            letters[a] = letters.get(a, 0) + 1
        d = q.get('diff')
        if d not in ('easy', 'medium', 'hard'):
            fail("Q%d: diff %r is not easy/medium/hard" % (n, d))
        else:
            diffs[d] = diffs.get(d, 0) + 1
        for key in ('topic', 'q', 'e', 'lesson'):
            if not q.get(key):
                fail("Q%d: missing or empty `%s`" % (n, key))
        les = q.get('lesson')
        if les:
            lessons[les] = lessons.get(les, 0) + 1

        if len(opts) == 4 and isinstance(a, int) and 0 <= a <= 3:
            lens = [len(o) for o in opts]
            if lens[a] == max(lens) and lens.count(max(lens)) == 1:
                longest_correct += 1
            if lens[a] == min(lens) and lens.count(min(lens)) == 1:
                shortest_correct += 1
            ratio = max(lens) / max(min(lens), 1)
            if ratio > 2.0:
                fail("Q%d: option length ratio %.1fx too wide (lens %s) — "
                     "distractors look thin next to the answer" % (n, ratio, lens))
        stem = q.get('q', '')
        if len(stem) > 90:
            warnings.append("Q%d: stem is %d chars (aim <=90) — %r" % (n, len(stem), stem))
        for k, o in enumerate(opts):
            if len(o) > 60:
                warnings.append("Q%d option %s: %d chars (aim <=60) — %r" %
                                 (n, L_PREVIEW[k], len(o), o))

    print("  longest-opt-wins .... %d/%d (cap 3)" % (longest_correct, len(qs)))
    if longest_correct > 3:
        fail("correct option is the strict longest in %d/%d questions (cap 3) — "
             "the answer is guessable by length" % (longest_correct, len(qs)))
    print("  shortest-opt-wins ... %d/%d (cap 3)" % (shortest_correct, len(qs)))
    if shortest_correct > 3:
        fail("correct option is the strict shortest in %d/%d questions (cap 3) — "
             "shortest-wins is just as guessable" % (shortest_correct, len(qs)))
    for w in warnings:
        print("  warn  " + w)

    want = {'easy': 4, 'medium': 4, 'hard': 2}
    if diffs != want:
        fail("difficulty split is %s, expected %s" % (diffs, want))
    else:
        print("  difficulty split .... %s" % diffs)

    off = [l for l, c in lessons.items() if c != 2]
    if off:
        fail("lessons not referenced exactly twice: %s" %
             {l: lessons[l] for l in off})
    else:
        print("  lessons covered ..... %d, each referenced exactly twice" % len(lessons))

    L = ['A', 'B', 'C', 'D']
    dist = {L[k]: letters[k] for k in range(4)}
    print("  answer-key spread ... %s" % dist)
    mx = max(letters.values()) if letters else 0
    if mx > 5:
        fail("answer key is lopsided: one letter used %d/%d times" % (mx, len(qs)))

    if failed:
        print("\nquiz-static-checks FAILED")
        sys.exit(1)
    else:
        print("\nAll quiz static checks passed.")

if __name__ == '__main__':
    main()
