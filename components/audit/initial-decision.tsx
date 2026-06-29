"use client"

import { useState } from "react"
import { Check, LockKeyhole, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Language } from "@/components/audit/conversation-panel"

export type Choice = "accept" | "decline"
export type DecisionResult = { choice: Choice; confidence: number; rationale: string }

type InitialDecisionProps = {
  language: Language
  onConfirm: (result: DecisionResult) => void
  onChange?: () => void
  disabled?: boolean
  minRounds?: number
  currentRounds?: number
}

const copy = {
  en: {
    title: "Initial Decision",
    description: "Answer three questions before AI reviews your reasoning.",
    confirmed: "Confirmed",
    lockedTitle: "Initial decision is locked for now.",
    lockedText: (minRounds: number, currentRounds: number) => `Please complete at least ${minRounds} dialogue rounds first. Current progress: ${Math.min(currentRounds, minRounds)}/${minRounds}.`,
    q1: "1. Would you advise Mr. Chan to try Medilight-X?",
    accept: "Accept",
    decline: "Decline",
    q2: "2. How confident are you?",
    q3: "3. Please describe in as much detail as possible the basis for your current judgment. (Required)",
    rationalePlaceholder: "Explain what information you relied on, what uncertainties you considered, and why you chose this decision...",
    confidence: "Confidence",
    confirm: "Confirm and review with AI",
  },
  zh: {
    title: "初始决策",
    description: "在看到 AI 分析之前，请先回答三个问题。",
    confirmed: "已确认",
    lockedTitle: "当前还不能进行初始决策。",
    lockedText: (minRounds: number, currentRounds: number) => `请先完成至少 ${minRounds} 轮对话。当前进度：${Math.min(currentRounds, minRounds)}/${minRounds}。`,
    q1: "1. 你是否建议陈先生尝试 Medilight-X？",
    accept: "接受",
    decline: "不接受",
    q2: "2. 你有多大信心？",
    q3: "3. 请尽可能地详细回答您做出当前判断的依据。（必答）",
    rationalePlaceholder: "请说明你主要依据了哪些信息、考虑了哪些不确定性，以及为什么做出这个判断……",
    confidence: "信心程度",
    confirm: "确认并查看 AI 分析",
  },
}

export function InitialDecision({ language, onConfirm, onChange, disabled = false, minRounds = 3, currentRounds = 0 }: InitialDecisionProps) {
  const [choice, setChoice] = useState<Choice | null>("accept")
  const [confidence, setConfidence] = useState(70)
  const [rationale, setRationale] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const t = copy[language]

  function updateChoice(nextChoice: Choice) {
    if (disabled) return
    setChoice(nextChoice)
    setConfirmed(false)
    onChange?.()
  }

  function updateConfidence(nextConfidence: number) {
    if (disabled) return
    setConfidence(nextConfidence)
    setConfirmed(false)
    onChange?.()
  }

  function updateRationale(nextRationale: string) {
    if (disabled) return
    setRationale(nextRationale)
    setConfirmed(false)
    onChange?.()
  }

  function confirmDecision() {
    const cleanRationale = rationale.trim()
    if (!choice || disabled || !cleanRationale) return
    setConfirmed(true)
    onConfirm({ choice, confidence, rationale: cleanRationale })
  }

  return (
    <section className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", disabled && "opacity-80")}>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">{t.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
        </div>
        {confirmed && <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">{t.confirmed}</span>}
      </div>
      {disabled && (
        <div className="mb-4 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-3">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground"><LockKeyhole className="size-4 text-muted-foreground" />{t.lockedTitle}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t.lockedText(minRounds, currentRounds)}</p>
        </div>
      )}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">{t.q1}</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => updateChoice("accept")} disabled={disabled} className={cn("flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed", choice === "accept" ? "border-success bg-success/10 text-success" : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary")} aria-pressed={choice === "accept"}><Check className="size-4" />{t.accept}</button>
            <button type="button" onClick={() => updateChoice("decline")} disabled={disabled} className={cn("flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed", choice === "decline" ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary")} aria-pressed={choice === "decline"}><X className="size-4" />{t.decline}</button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground">{t.q2}</p><span className="text-sm font-semibold tabular-nums text-primary">{confidence}%</span></div>
          <input type="range" min={0} max={100} value={confidence} disabled={disabled} onChange={(e) => updateConfidence(Number(e.target.value))} className="confidence-slider w-full disabled:cursor-not-allowed disabled:opacity-60" aria-label={t.confidence} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>100</span></div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">{t.q3}</p>
          <textarea
            value={rationale}
            onChange={(e) => updateRationale(e.target.value)}
            disabled={disabled}
            rows={4}
            placeholder={t.rationalePlaceholder}
            className="resize-none rounded-xl border border-border bg-secondary/30 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>
        <button type="button" onClick={confirmDecision} disabled={!choice || disabled || !rationale.trim()} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{t.confirm}</button>
      </div>
    </section>
  )
}
