'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { completeLesson } from '@/app/actions/progress'
import { getNextLesson } from '@/lib/lessons'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Trophy,
  RotateCcw,
  Flame,
  Search,
  Building2,
  TrendingUp,
  TrendingDown,
  Scale,
  Layers,
  Percent,
  Ticket,
  Handshake,
  Rocket,
  AlertTriangle,
  Landmark,
  Receipt,
  ShieldCheck,
  Coins,
} from 'lucide-react'

const LESSON_ID = 'intro-to-the-stock-market'

const TOTAL = 10

/* ---------- Branded wordmark ---------- */
function Turnit({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-[#1a5fb4] to-[#26a269] bg-clip-text pr-[0.08em] font-extrabold italic tracking-tight text-transparent ${className}`}
    >
      TURNIT
    </span>
  )
}

/* ---------- Jargon Buster callout ---------- */
function JargonBuster({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-[#1a5fb4]/20 bg-[#1a5fb4]/5 p-5 text-left shadow-sm">
      <p className="mb-1 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a5fb4]">
        <Search className="h-4 w-4" />
        Jargon Buster
      </p>
      <p className="text-lg font-bold text-foreground">{term}</p>
      <p className="mt-1 text-base leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

/* ---------- Money helpers ---------- */
const fmtUSD = (n: number, digits = 0) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })

/* ---------- Illustrative (not predictive) annual return paths ----------
   Index path: loosely modeled on the ballpark ~10% long-run historical
   average annual return often cited for a broad U.S. stock index, with
   modest year-to-year variation. Single-stock path: same rough long-run
   average, but with the much larger swings typical of one company.
   These are simplified teaching illustrations, not real historical data
   or a forecast of future returns. */
const INDEX_RETURNS = [
  0.09, 0.12, 0.06, 0.14, 0.08, 0.1, 0.05, 0.13, 0.09, 0.11, 0.07, 0.12, 0.1, 0.06, 0.14, 0.09, 0.11, 0.08, 0.1,
  0.13, 0.06, 0.12, 0.09, 0.1, 0.07, 0.11, 0.08, 0.14, 0.09, 0.1,
]
const STOCK_RETURNS = [
  0.22, -0.28, 0.4, 0.05, -0.18, 0.35, -0.1, 0.55, -0.35, 0.2, 0.06, -0.22, 0.48, -0.05, -0.15, 0.3, 0.12, -0.3,
  0.42, 0.02, -0.4, 0.6, -0.02, -0.08, 0.25, 0.15, -0.2, 0.5, -0.25, 0.28,
]

function pathValues(returns: number[], years: number, monthlyContribution: number) {
  const values: number[] = []
  let balance = 0
  for (let y = 0; y < years; y++) {
    balance = (balance + monthlyContribution * 12) * (1 + returns[y % returns.length])
    balance = Math.max(balance, 0)
    values.push(balance)
  }
  return values
}

/* ============================================================= */

export function LessonFiveContent() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  // slide state
  const [quizAnswer, setQuizAnswer] = useState<'a' | 'b' | 'c' | null>(null)
  const [demandSide, setDemandSide] = useState<'buyers' | 'sellers' | null>(null)
  const [assetFocus, setAssetFocus] = useState<'stock' | 'bond' | 'fund' | null>(null)
  const [volYears, setVolYears] = useState(20)

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return quizAnswer !== null
      default:
        return true
    }
  })()

  const goTo = (n: number) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  const next = () => step < TOTAL - 1 && goTo(step + 1)
  const back = () => step > 0 && goTo(step - 1)

  const finish = async () => {
    setIsSubmitting(true)
    try {
      await completeLesson(LESSON_ID, 100)
      setSaved(true)
    } catch (e) {
      console.error('[v0] Failed to save lesson progress:', e)
    }
    setIsSubmitting(false)
    goTo(TOTAL - 1)
  }

  const restart = () => {
    setQuizAnswer(null)
    setDemandSide(null)
    setAssetFocus(null)
    setVolYears(20)
    goTo(0)
  }

  const nextLesson = getNextLesson(LESSON_ID)

  /* ---- Slide 3 supply & demand demo ---- */
  const BASE_PRICE = 50
  const price =
    demandSide === 'buyers' ? BASE_PRICE + 18 : demandSide === 'sellers' ? BASE_PRICE - 16 : BASE_PRICE
  const tiltPct = demandSide === 'buyers' ? 78 : demandSide === 'sellers' ? 22 : 50

  /* ---- Slide 6 volatility simulator ---- */
  const CONTRIB = 300
  const indexPath = useMemo(() => pathValues(INDEX_RETURNS, volYears, CONTRIB), [volYears])
  const stockPath = useMemo(() => pathValues(STOCK_RETURNS, volYears, CONTRIB), [volYears])
  const indexFinal = indexPath[indexPath.length - 1] ?? 0
  const stockFinal = stockPath[stockPath.length - 1] ?? 0
  const maxVal = Math.max(...indexPath, ...stockPath, 1)
  const contributed = CONTRIB * 12 * volYears

  /* ---- Slide 4 matrix column focus classes ---- */
  const matrixCol = (col: 'stock' | 'bond' | 'fund', isLast = false) => {
    if (assetFocus === col) {
      const edge = isLast ? 'border-b-2' : ''
      if (col === 'stock') return `border-[#1a5fb4] bg-[#1a5fb4]/5 ${edge}`
      if (col === 'bond') return `border-[#e66100] bg-[#e66100]/5 ${edge}`
      return `border-[#26a269] bg-[#26a269]/5 ${edge}`
    }
    return assetFocus ? 'border-transparent opacity-40' : 'border-transparent'
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:py-12">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Link href="/learn">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back
          </Button>
        </Link>
        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <TrendingUp className="h-4 w-4 text-[#1a5fb4]" />
          <Turnit className="text-sm" /> Intro to the Stock Market
        </span>
      </div>

      {/* HUD progress */}
      <div className="mb-10">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => {
            const filled = i <= step
            return (
              <div key={i} className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    filled ? 'bg-gradient-to-r from-[#1a5fb4] to-[#26a269]' : ''
                  }`}
                  style={{ width: filled ? '100%' : '0%' }}
                />
              </div>
            )
          })}
        </div>
        <div className="mt-2 text-right text-xs font-medium text-muted-foreground">
          Slide {step + 1} of {TOTAL}
        </div>
      </div>

      {/* ===================== SLIDE 1 — WHAT IS "THE MARKET"? ===================== */}
      {step === 0 && (
        <div className="text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[#1a5fb4]">
            Lesson 5 · The Setup
          </p>
          <h1 className="mb-4 text-balance text-4xl font-extrabold text-foreground md:text-5xl">
            What is &ldquo;the stock market,&rdquo; really?
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-xl leading-relaxed text-muted-foreground">
            You&apos;ve got your empty basket. Now let&apos;s talk about what actually goes inside it. First,
            a quick gut check.
          </p>

          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-[#1a5fb4]/20 bg-card p-8 shadow-sm md:p-10">
            <p className="mx-auto max-w-lg text-pretty text-xl font-bold text-foreground">
              When the news says &ldquo;the market was up today,&rdquo; what actually happened?
            </p>
            <div className="mx-auto mt-6 flex max-w-lg flex-col gap-3">
              {[
                { id: 'a' as const, label: 'A vault of gold somewhere got fuller' },
                { id: 'b' as const, label: 'The prices of thousands of company shares moved higher, on average' },
                { id: 'c' as const, label: 'The government printed more money' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setQuizAnswer(opt.id)}
                  aria-pressed={quizAnswer === opt.id}
                  className={`rounded-2xl border-2 px-5 py-4 text-left text-lg font-semibold transition-all duration-200 ${
                    quizAnswer === opt.id
                      ? 'border-[#1a5fb4] bg-[#1a5fb4]/10 text-[#1a5fb4] shadow-md'
                      : 'border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-[#1a5fb4]/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {quizAnswer && (
              <div className="mt-8 animate-in fade-in slide-in-from-bottom-3 border-t border-border pt-8">
                <p className="mb-4 text-sm font-semibold text-[#26a269]">
                  {quizAnswer === 'b'
                    ? 'Exactly right.'
                    : "Close — here's what's actually going on."}
                </p>
                <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#1a5fb4] to-[#26a269] text-white">
                  <Building2 className="h-8 w-8" />
                </span>
                <h2 className="text-2xl font-bold text-foreground">A marketplace for tiny company pieces</h2>
                <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-muted-foreground">
                  The stock market isn&apos;t a place, a vault, or the government &mdash; it&apos;s a network of
                  exchanges where people buy and sell small ownership pieces of real companies, thousands of
                  times a second. &ldquo;The market went up&rdquo; just means the average price of those pieces
                  rose.
                </p>
              </div>
            )}
          </div>

          {quizAnswer && (
            <div className="animate-in fade-in slide-in-from-bottom-3">
              <JargonBuster term="Stock Market">
                A network of exchanges &mdash; like the NYSE or Nasdaq &mdash; where shares of public companies
                are bought and sold. It&apos;s the &ldquo;store&rdquo; where the things you put inside your
                investing basket actually come from.
              </JargonBuster>
            </div>
          )}
        </div>
      )}

      {/* ===================== SLIDE 2 — WHAT IS A SHARE ===================== */}
      {step === 1 && (
        <div>
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1a5fb4]/10 text-[#1a5fb4]">
              <Ticket className="h-7 w-7" />
            </span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">What is a share?</h2>
            <p className="mt-3 max-w-xl text-xl leading-relaxed text-muted-foreground">
              Imagine a pizza company sells 100 slices of itself. If you buy one slice, you now own{' '}
              <span className="font-semibold text-foreground">1% of that pizza company</span> &mdash; that
              slice is a share.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: <Handshake className="h-6 w-6" />,
                title: 'You own a real piece',
                body: 'A share isn\u2019t a coupon or a bet \u2014 it\u2019s actual partial ownership of the company that issued it.',
              },
              {
                icon: <TrendingUp className="h-6 w-6" />,
                title: 'You can profit two ways',
                body: 'If the company grows and more people want in, your slice becomes worth more. Some companies also pay owners a cut of profits, called a dividend.',
              },
              {
                icon: <TrendingDown className="h-6 w-6" />,
                title: 'You can lose money too',
                body: 'If the company struggles, your slice can be worth less than you paid. Owning a share is never a guarantee.',
              },
            ].map((c, i) => (
              <div key={c.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-3 flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1a5fb4]/10 text-[#1a5fb4]">
                    {c.icon}
                  </span>
                  <span className="text-sm font-bold text-muted-foreground">0{i + 1}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{c.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{c.body}</p>
              </div>
            ))}
          </div>

          <JargonBuster term="Share / Stock">
            One unit of ownership in a company. &ldquo;Buying stock&rdquo; in a company just means buying one or
            more of these ownership slices.
          </JargonBuster>
        </div>
      )}

      {/* ===================== SLIDE 3 — SUPPLY & DEMAND ===================== */}
      {step === 2 && (
        <div>
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground md:text-4xl">
            Why do prices move?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-xl leading-relaxed text-muted-foreground">
            No mystery here &mdash; it&apos;s the same tug-of-war as any marketplace. Tap a side and watch the
            price react.
          </p>

          <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDemandSide((d) => (d === 'buyers' ? null : 'buyers'))}
                aria-pressed={demandSide === 'buyers'}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all ${
                  demandSide === 'buyers'
                    ? 'border-[#26a269] bg-[#26a269]/10 shadow-md'
                    : 'border-border bg-background hover:border-[#26a269]/40'
                }`}
              >
                <TrendingUp className="h-6 w-6 text-[#26a269]" />
                <span className="font-bold text-foreground">More buyers</span>
                <span className="text-sm text-muted-foreground">Everyone wants in</span>
              </button>
              <button
                type="button"
                onClick={() => setDemandSide((d) => (d === 'sellers' ? null : 'sellers'))}
                aria-pressed={demandSide === 'sellers'}
                className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-5 text-center transition-all ${
                  demandSide === 'sellers'
                    ? 'border-[#e66100] bg-[#e66100]/10 shadow-md'
                    : 'border-border bg-background hover:border-[#e66100]/40'
                }`}
              >
                <TrendingDown className="h-6 w-6 text-[#e66100]" />
                <span className="font-bold text-foreground">More sellers</span>
                <span className="text-sm text-muted-foreground">Everyone wants out</span>
              </button>
            </div>

            <div className="mt-8">
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-muted-foreground">
                <span>Fewer buyers</span>
                <span>Fewer sellers</span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#e66100] via-muted-foreground/30 to-[#26a269] transition-all duration-500"
                  style={{ width: '100%', marginLeft: 0 }}
                />
              </div>
              <div
                className="relative -mt-4 h-4 w-3 rounded-full border-2 border-background bg-foreground shadow-md transition-all duration-500"
                style={{ marginLeft: `calc(${tiltPct}% - 6px)` }}
              />
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Share price</p>
              <p className="mt-1 font-mono text-4xl font-extrabold text-foreground">{fmtUSD(price)}</p>
              <p className="mt-2 text-base text-muted-foreground">
                {demandSide === 'buyers'
                  ? 'When more people want to buy than sell, buyers compete and bid the price up.'
                  : demandSide === 'sellers'
                    ? 'When more people want to sell than buy, sellers compete and drop the price to find a buyer.'
                    : 'With buyers and sellers roughly balanced, the price holds steady.'}
              </p>
            </div>
          </div>

          <JargonBuster term="Supply & Demand">
            The basic force behind every price on the market. More buyers than sellers pushes prices up; more
            sellers than buyers pushes prices down. Company news, earnings, and even rumors move prices because
            they change how many people want to buy or sell.
          </JargonBuster>
        </div>
      )}

      {/* ===================== SLIDE 4 — STOCKS VS BONDS VS FUNDS ===================== */}
      {step === 3 && (
        <div>
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground md:text-4xl">
            The three building blocks
          </h2>
          <p className="mx-auto mb-6 max-w-xl text-center text-xl leading-relaxed text-muted-foreground">
            Almost everything you can buy inside your basket boils down to one of these three. Tap one to focus
            its column.
          </p>

          <div className="mx-auto mb-6 grid max-w-2xl grid-cols-3 gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setAssetFocus((f) => (f === 'stock' ? null : 'stock'))}
              aria-pressed={assetFocus === 'stock'}
              className={`flex items-center justify-center gap-1.5 rounded-full border-2 px-3 py-2.5 text-xs font-bold transition-all md:text-sm ${
                assetFocus === 'stock'
                  ? 'border-transparent bg-[#1a5fb4] text-white shadow-md'
                  : 'border-border bg-card text-[#1a5fb4] hover:border-[#1a5fb4]/50'
              }`}
            >
              <Building2 className="h-4 w-4 flex-shrink-0" />
              Stock
            </button>
            <button
              type="button"
              onClick={() => setAssetFocus((f) => (f === 'bond' ? null : 'bond'))}
              aria-pressed={assetFocus === 'bond'}
              className={`flex items-center justify-center gap-1.5 rounded-full border-2 px-3 py-2.5 text-xs font-bold transition-all md:text-sm ${
                assetFocus === 'bond'
                  ? 'border-transparent bg-[#e66100] text-white shadow-md'
                  : 'border-border bg-card text-[#e66100] hover:border-[#e66100]/50'
              }`}
            >
              <Receipt className="h-4 w-4 flex-shrink-0" />
              Bond
            </button>
            <button
              type="button"
              onClick={() => setAssetFocus((f) => (f === 'fund' ? null : 'fund'))}
              aria-pressed={assetFocus === 'fund'}
              className={`flex items-center justify-center gap-1.5 rounded-full border-2 px-3 py-2.5 text-xs font-bold transition-all md:text-sm ${
                assetFocus === 'fund'
                  ? 'border-transparent bg-[#26a269] text-white shadow-md'
                  : 'border-border bg-card text-[#26a269] hover:border-[#26a269]/50'
              }`}
            >
              <Layers className="h-4 w-4 flex-shrink-0" />
              Fund
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid grid-cols-[1.1fr_1fr_1fr_1fr] border-b border-border bg-muted/40">
              <div className="p-3 text-xs font-bold uppercase tracking-wider text-muted-foreground md:p-4 md:text-sm">
                Feature
              </div>
              <div
                className={`flex flex-col items-center justify-center gap-1 border-x-2 p-3 text-center text-xs font-bold text-[#1a5fb4] transition-all duration-300 md:flex-row md:gap-1.5 md:p-4 md:text-sm ${matrixCol('stock')}`}
              >
                <Building2 className="h-4 w-4" />
                Stock
              </div>
              <div
                className={`flex flex-col items-center justify-center gap-1 border-x-2 p-3 text-center text-xs font-bold text-[#e66100] transition-all duration-300 md:flex-row md:gap-1.5 md:p-4 md:text-sm ${matrixCol('bond')}`}
              >
                <Receipt className="h-4 w-4" />
                Bond
              </div>
              <div
                className={`flex flex-col items-center justify-center gap-1 border-x-2 p-3 text-center text-xs font-bold text-[#26a269] transition-all duration-300 md:flex-row md:gap-1.5 md:p-4 md:text-sm ${matrixCol('fund')}`}
              >
                <Layers className="h-4 w-4" />
                Fund
              </div>
            </div>
            {[
              {
                label: 'What you actually own',
                stock: 'A piece of one company',
                bond: 'An IOU from a company or government',
                fund: 'A basket of many stocks/bonds at once',
              },
              {
                label: 'How you can profit',
                stock: 'Price growth + dividends',
                bond: 'Fixed interest payments',
                fund: 'Combined growth of everything inside it',
              },
              {
                label: 'Typical risk level',
                stock: 'Higher',
                bond: 'Lower',
                fund: 'Depends what\u2019s inside \u2014 often moderate',
              },
              {
                label: 'Best known for',
                stock: 'Bigger potential upside (and downside)',
                bond: 'Steadier, more predictable income',
                fund: 'Instant diversification in one purchase',
              },
            ].map((row, i, arr) => {
              const isLast = i === arr.length - 1
              return (
                <div
                  key={row.label}
                  className={`grid grid-cols-[1.1fr_1fr_1fr_1fr] ${i % 2 === 1 ? 'bg-muted/20' : ''} ${
                    !isLast ? 'border-b border-border' : ''
                  }`}
                >
                  <div className="flex items-center p-3 text-xs font-semibold text-foreground md:p-4 md:text-base">
                    {row.label}
                  </div>
                  <div
                    className={`flex items-center justify-center border-x-2 p-3 text-center text-xs text-muted-foreground transition-all duration-300 md:p-4 md:text-base ${matrixCol('stock', isLast)}`}
                  >
                    {row.stock}
                  </div>
                  <div
                    className={`flex items-center justify-center border-x-2 p-3 text-center text-xs font-medium text-foreground transition-all duration-300 md:p-4 md:text-base ${matrixCol('bond', isLast)}`}
                  >
                    {row.bond}
                  </div>
                  <div
                    className={`flex items-center justify-center border-x-2 p-3 text-center text-xs font-medium text-foreground transition-all duration-300 md:p-4 md:text-base ${matrixCol('fund', isLast)}`}
                  >
                    {row.fund}
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center text-base text-muted-foreground">
            Remember your basket from Lesson 4? Stocks, bonds, and funds are what you actually put inside a
            Brokerage, Roth IRA, or Traditional IRA.
          </p>
        </div>
      )}

      {/* ===================== SLIDE 5 — INDEX FUNDS ===================== */}
      {step === 4 && (
        <div>
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#26a269]/10 text-[#26a269]">
              <Layers className="h-7 w-7" />
            </span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">The &ldquo;buy the whole market&rdquo; trick</h2>
            <p className="mt-3 max-w-xl text-xl leading-relaxed text-muted-foreground">
              Picking one winning company is hard, even for professionals. Index funds sidestep the problem
              entirely.
            </p>
          </div>

          <div className="mx-auto grid max-w-3xl gap-5 md:grid-cols-2">
            <div className="flex flex-col rounded-3xl border-2 border-[#e66100]/40 bg-[#e66100]/5 p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e66100]/10 text-[#e66100]">
                  <Building2 className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-foreground">Betting on one horse</h3>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                Buying a single company&apos;s stock means your entire result depends on that one company. Get
                it right and you can do great &mdash; get it wrong and you can lose a lot.
              </p>
            </div>
            <div className="flex flex-col rounded-3xl border-2 border-[#26a269]/40 bg-[#26a269]/5 p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#26a269]/10 text-[#26a269]">
                  <Layers className="h-6 w-6" />
                </span>
                <h3 className="text-xl font-bold text-foreground">Owning the whole race</h3>
              </div>
              <p className="text-base leading-relaxed text-muted-foreground">
                An index fund automatically holds a slice of hundreds of companies at once. If a few struggle,
                others can offset it &mdash; you&apos;re not betting on any single one.
              </p>
            </div>
          </div>

          <JargonBuster term="Index Fund">
            A single fund that automatically holds hundreds of companies &mdash; often the largest companies in
            the U.S. economy. Buying one share of an index fund instantly spreads your money across all of
            them. This spreading-out is called <span className="font-semibold text-foreground">diversification</span>.
          </JargonBuster>
        </div>
      )}

      {/* ===================== SLIDE 6 — VOLATILITY SIMULATOR ===================== */}
      {step === 5 && (
        <div>
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground md:text-4xl">
            One company vs. the whole market
          </h2>
          <p className="mx-auto mb-2 max-w-xl text-center text-xl leading-relaxed text-muted-foreground">
            Same {fmtUSD(CONTRIB)}/month, invested in a single company&apos;s stock vs. a broad index fund.
          </p>
          <p className="mx-auto mb-8 max-w-xl text-center text-sm text-muted-foreground">
            This is a simplified, hypothetical illustration built around the rough ~10% long-run average
            annual return often cited for a broad U.S. stock index &mdash; not real historical data and not a
            prediction. Past performance never guarantees future results.
          </p>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="flex items-end gap-1" style={{ height: 160 }}>
              {stockPath.map((v, i) => (
                <div key={`s-${i}`} className="flex flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t-sm bg-[#e66100]/70 transition-all duration-300"
                    style={{ height: `${Math.max((v / maxVal) * 100, 1)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 flex items-end gap-1" style={{ height: 160 }}>
              {indexPath.map((v, i) => (
                <div key={`i-${i}`} className="flex flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full rounded-t-sm bg-gradient-to-t from-[#1a5fb4] to-[#26a269] transition-all duration-300"
                    style={{ height: `${Math.max((v / maxVal) * 100, 1)}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border-2 border-[#e66100]/30 bg-[#e66100]/5 p-4 text-center">
                <p className="flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-wider text-[#e66100]">
                  <Building2 className="h-4 w-4" />
                  Single stock
                </p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-foreground">{fmtUSD(stockFinal)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Bumpy ride &mdash; big ups, big downs</p>
              </div>
              <div className="rounded-2xl border-2 border-[#26a269]/40 bg-[#26a269]/5 p-4 text-center">
                <p className="flex items-center justify-center gap-1.5 text-sm font-bold uppercase tracking-wider text-[#26a269]">
                  <Layers className="h-4 w-4" />
                  Index fund
                </p>
                <p className="mt-1 font-mono text-2xl font-extrabold text-foreground">{fmtUSD(indexFinal)}</p>
                <p className="mt-1 text-xs text-muted-foreground">Smoother, steadier climb</p>
              </div>
            </div>

            <input
              type="range"
              min={5}
              max={30}
              value={volYears}
              onChange={(e) => setVolYears(Number(e.target.value))}
              className="mt-6 w-full accent-[#26a269]"
              aria-label="Years invested"
            />
            <p className="mt-1 text-center text-sm font-medium text-muted-foreground">
              Over {volYears} years &middot; {fmtUSD(contributed)} contributed
            </p>
          </div>

          <JargonBuster term="Volatility">
            How much a price swings up and down over time. Single stocks are typically far more volatile than a
            broad index fund, because one company&apos;s fortunes can change fast &mdash; while an index spreads
            that risk across hundreds of companies at once.
          </JargonBuster>
        </div>
      )}

      {/* ===================== SLIDE 7 — GLOSSARY GRID ===================== */}
      {step === 6 && (
        <div>
          <h2 className="mb-3 text-center text-3xl font-bold text-foreground md:text-4xl">
            Speak the language
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-center text-xl leading-relaxed text-muted-foreground">
            Six terms you&apos;ll see everywhere once you start investing. Skim them once &mdash; they&apos;ll
            click fast.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: <Ticket className="h-5 w-5" />,
                term: 'Ticker Symbol',
                body: 'The short code used to look up a company on an exchange, like AAPL for Apple.',
              },
              {
                icon: <Coins className="h-5 w-5" />,
                term: 'Dividend',
                body: 'A cash payment some companies share with owners out of their profits, usually paid quarterly.',
              },
              {
                icon: <TrendingUp className="h-5 w-5" />,
                term: 'Bull Market',
                body: 'A stretch of time when prices are broadly rising and confidence is high.',
              },
              {
                icon: <TrendingDown className="h-5 w-5" />,
                term: 'Bear Market',
                body: 'A stretch of time when prices are broadly falling, often 20%+ from a recent high.',
              },
              {
                icon: <Layers className="h-5 w-5" />,
                term: 'Diversification',
                body: 'Spreading your money across many investments so no single one can sink your results.',
              },
              {
                icon: <Scale className="h-5 w-5" />,
                term: 'Portfolio',
                body: 'The full collection of everything you own inside your investing accounts, all together.',
              },
            ].map((g) => (
              <div key={g.term} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <span className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#1a5fb4]/10 text-[#1a5fb4]">
                  {g.icon}
                </span>
                <div>
                  <p className="font-bold text-foreground">{g.term}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{g.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================== SLIDE 8 — MYTH BUSTING ===================== */}
      {step === 7 && (
        <div>
          <div className="mb-8 flex flex-col items-center text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#26a269]/10 text-[#26a269]">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Two myths, busted</h2>
            <p className="mt-3 max-w-xl text-xl leading-relaxed text-muted-foreground">
              These two beliefs stop more beginners from starting than almost anything else.
            </p>
          </div>

          <div className="mx-auto grid max-w-2xl gap-4">
            <div className="rounded-2xl border-2 border-[#e66100]/30 bg-[#e66100]/5 p-5">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#e66100]">
                <X className="h-4 w-4" />
                The Myth
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                &ldquo;You need a lot of money to start investing.&rdquo;
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#26a269]/40 bg-[#26a269]/5 p-5">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#26a269]">
                <Check className="h-4 w-4" />
                The Reality
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                Many platforms let you buy fractional shares for just a few dollars.
              </p>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                You don&apos;t need to buy a &ldquo;whole&rdquo; share of an expensive company. Fractional
                shares let you own a sliver of one with whatever amount you have.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-6 grid max-w-2xl gap-4">
            <div className="rounded-2xl border-2 border-[#e66100]/30 bg-[#e66100]/5 p-5">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#e66100]">
                <X className="h-4 w-4" />
                The Myth
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                &ldquo;You have to time the market perfectly to win.&rdquo;
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[#26a269]/40 bg-[#26a269]/5 p-5">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#26a269]">
                <Check className="h-4 w-4" />
                The Reality
              </p>
              <p className="mt-1 text-lg font-semibold text-foreground">
                Most long-term investors just buy consistently and hold, no matter what the news says.
              </p>
              <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                Even professionals struggle to reliably predict short-term price swings. Investing regularly
                over time &mdash; sometimes called dollar-cost averaging &mdash; smooths out the guesswork.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#e66100]" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              None of this is a guarantee. All investing carries risk, including the risk of loss. This lesson
              is educational, not personalized financial advice.
            </p>
          </div>
        </div>
      )}

      {/* ===================== SLIDE 9 — NATIVE AFFILIATE ===================== */}
      {step === 8 && (
        <div>
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">Ready to fill your basket?</h2>
            <p className="mt-3 max-w-xl text-xl leading-relaxed text-muted-foreground">
              You now know what stocks, bonds, and index funds actually are. The next step is putting a first
              small amount to work.
            </p>
          </div>

          <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border-2 border-[#1a5fb4]/30 bg-card shadow-xl">
            <div className="bg-gradient-to-r from-[#1a5fb4] to-[#26a269] p-6 text-center">
              <span className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                <Rocket className="h-7 w-7" />
              </span>
              <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Partner Spotlight</p>
              <h3 className="text-2xl font-extrabold text-white">Buy your first index fund with a TURNIT partner</h3>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { stat: '$0', label: 'Commission on trades' },
                  { stat: '$1', label: 'Fractional shares from' },
                  { stat: '5 min', label: 'To place your first order' },
                ].map((m) => (
                  <div key={m.label} className="rounded-2xl border border-border bg-background p-4 text-center">
                    <p className="text-2xl font-extrabold text-[#26a269]">{m.stat}</p>
                    <p className="mt-0.5 text-sm text-muted-foreground">{m.label}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-center text-base leading-relaxed text-muted-foreground">
                If you already opened a basket in Lesson 4, this is where you go to actually put something
                inside it.
              </p>

              <a href="https://turnit-fl.com" target="_blank" rel="noopener noreferrer" className="mt-6 block">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#1a5fb4] to-[#26a269] py-6 text-lg font-bold text-white hover:opacity-90"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Explore my first index fund
                </Button>
              </a>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="rounded-full bg-[#26a269]/10 px-3 py-1 text-xs font-bold text-[#26a269]">
                  $0 commission
                </span>
                <span className="rounded-full bg-[#26a269]/10 px-3 py-1 text-xs font-bold text-[#26a269]">
                  Fractional shares
                </span>
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                TURNIT may earn a commission from partners. This is educational content, not financial advice.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ===================== SLIDE 10 — RECAP & COMPLETE ===================== */}
      {step === 9 && (
        <div className="text-center">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2rem] border-4 border-double border-[#1a5fb4]/30 bg-card p-8 shadow-xl md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#1a5fb4]/20 to-[#26a269]/20 blur-3xl"
            />
            <span className="relative mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1a5fb4]/10 to-[#26a269]/10 px-4 py-1.5 text-sm font-bold text-[#1a5fb4]">
              <Trophy className="h-4 w-4" />
              Lesson Complete
            </span>
            <h2 className="relative mb-2 text-3xl font-extrabold text-foreground md:text-4xl">
              You speak market now
            </h2>
            <p className="relative mx-auto max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
              You now know what the market actually is and what goes inside your basket. Here&apos;s your
              checklist:
            </p>

            <div className="relative mx-auto my-8 flex max-w-md flex-col gap-3 text-left">
              {[
                'The stock market is a marketplace for buying and selling small ownership pieces of real companies.',
                'Stocks, bonds, and funds are the three basic building blocks you can put in your basket.',
                'Index funds spread your money across hundreds of companies at once, smoothing out the ride.',
              ].map((t) => (
                <div
                  key={t}
                  className="flex items-start gap-3 rounded-2xl border border-[#26a269]/30 bg-[#26a269]/5 p-4"
                >
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#26a269]" />
                  <p className="font-medium text-foreground">{t}</p>
                </div>
              ))}
            </div>

            {saved && (
              <div className="relative mx-auto mb-6 flex max-w-sm items-center gap-3 rounded-2xl border-2 border-[#e66100]/30 bg-[#e66100]/10 p-4 text-left">
                <Flame className="h-8 w-8 flex-shrink-0 text-[#e66100]" />
                <div>
                  <p className="font-bold text-foreground">Progress Saved</p>
                  <p className="text-sm text-muted-foreground">Your streak just grew. Keep the momentum.</p>
                </div>
              </div>
            )}

            {/* Lesson 6 teaser */}
            <div className="relative mx-auto mb-8 max-w-md rounded-2xl border border-[#1a5fb4]/30 bg-[#1a5fb4]/5 p-5 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-[#1a5fb4]">Up Next · Lesson 6</p>
              <p className="mt-1 text-lg font-bold text-foreground">Placing Your First Trade</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                You know what stocks and funds are. Next you&apos;ll walk through exactly what happens when you
                tap &ldquo;buy&rdquo; &mdash; order types, share counts, and what to expect on your first trade.
              </p>
            </div>

            <div className="relative flex flex-col gap-3 sm:flex-row sm:justify-center">
              {nextLesson ? (
                <Link href={`/learn/${nextLesson.id}`}>
                  <Button className="w-full bg-gradient-to-r from-[#1a5fb4] to-[#26a269] text-white hover:opacity-90 sm:w-auto">
                    Next Lesson
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/dashboard">
                  <Button className="w-full bg-gradient-to-r from-[#1a5fb4] to-[#26a269] text-white hover:opacity-90 sm:w-auto">
                    Back to Dashboard
                  </Button>
                </Link>
              )}
              <Button variant="outline" onClick={restart} className="w-full sm:w-auto">
                <RotateCcw className="mr-1 h-4 w-4" />
                Restart Lesson
              </Button>
            </div>
          </div>

          {/* Closing quote */}
          <figure className="mx-auto mt-16 max-w-2xl animate-in fade-in slide-in-from-bottom-3 duration-1000">
            <blockquote className="text-balance text-xl font-bold uppercase leading-snug tracking-wide text-foreground md:text-2xl">
              &ldquo;Know What You Own, And Know{' '}
              <span className="bg-gradient-to-r from-[#1a5fb4] to-[#26a269] bg-clip-text text-transparent">
                Why You Own It.
              </span>
              &rdquo;
            </blockquote>
            <figcaption className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
              — Peter Lynch
            </figcaption>
          </figure>
        </div>
      )}

      {/* ===================== NAV FOOTER ===================== */}
      {step <= TOTAL - 2 && (
        <div className="mt-10 flex items-center justify-between border-t pt-6">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={step === TOTAL - 2 ? finish : next}
            disabled={isSubmitting || !canAdvance}
            size="lg"
            className="bg-gradient-to-r from-[#1a5fb4] to-[#26a269] text-white hover:opacity-90 disabled:opacity-40"
          >
            {isSubmitting ? 'Saving...' : 'Next'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
