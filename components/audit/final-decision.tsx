"use client"

import { useState } from "react"
import { Check, ClipboardCheck, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Language } from "@/components/audit/conversation-panel"
import type { Choice, DecisionResult } from "@/components/audit/initial-decision"

type FinalDecisionProps = { language: Language; onConfirm: (result: DecisionResult) => void }

const copy = {
  en: {
    title: "Final Decision",
    description: "Answer the same decision questions after reviewing the AI prompt and checklist.",
    submitted: "Submitted",
    q1: "1. Would you advise Mr. Chan to try Medilight-X?",
    accept: "Accept",
    decline: "Decline",
    q2: "2. How confident are you?",
    q3: "3. Please describe in as much detail as possible the basis for your current judgment. (Required)",
    rationalePlaceholder: "Explain whether and how the AI review changed your reasoning, what evidence or risks mattered most, and why you made your final decision...",
    confidence: "Final confidence",
    submit: "Make final decision",
  },
  zh: {
    title: "最终决策",
    description: "查看 AI 提示和检查清单后，请再次回答决策问题。",
    submitted: "已提交",
    q1: "1. 你是否建议陈先生尝试 Medilight-X？",
    accept: "接受",
    decline: "不接受",
    q2: "2. 你有多大信心？",
    q3: "3. 请尽可能地详细回答您做出当前判断的依据。（必答）",
    rationalePlaceholder: "请说明 AI 建议是否以及如何改变了你的想法、哪些证据或风险最重要，以及你为什么做出最终判断……",
    confidence: "最终信心程度",
    submit: "提交最终决策",
  },
}

export function FinalDecision({ language, onConfirm }: FinalDecisionProps) {
  const [choice, setChoice] = useState<Choice | null>("accept")
  const [confidence, setConfidence] = useState(70)
  const [rationale, setRationale] = useState("")
  const [confirmed, setConfirmed] = useState(false)
  const t = copy[language]

  function confirmDecision() {
    const cleanRationale = rationale.trim()
    if (!choice || !cleanRationale) return
    setConfirmed(true)
    onConfirm({ choice, confidence, rationale: cleanRationale })
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground"><ClipboardCheck className="size-4 text-primary" />{t.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
        </div>
        {confirmed && <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">{t.submitted}</span>}
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">{t.q1}</p>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { setChoice("accept"); setConfirmed(false) }} className={cn("flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors", choice === "accept" ? "border-success bg-success/10 text-success" : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary")} aria-pressed={choice === "accept"}><Check className="size-4" />{t.accept}</button>
            <button type="button" onClick={() => { setChoice("decline"); setConfirmed(false) }} className={cn("flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors", choice === "decline" ? "border-destructive bg-destructive/10 text-destructive" : "border-border bg-secondary/40 text-muted-foreground hover:bg-secondary")} aria-pressed={choice === "decline"}><X className="size-4" />{t.decline}</button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between"><p className="text-sm font-medium text-foreground">{t.q2}</p><span className="text-sm font-semibold tabular-nums text-primary">{confidence}%</span></div>
          <input type="range" min={0} max={100} value={confidence} onChange={(e) => { setConfidence(Number(e.target.value)); setConfirmed(false) }} className="confidence-slider w-full" aria-label={t.confidence} />
          <div className="flex justify-between text-xs text-muted-foreground"><span>0</span><span>100</span></div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">{t.q3}</p>
          <textarea
            value={rationale}
            onChange={(e) => { setRationale(e.target.value); setConfirmed(false) }}
            rows={4}
            placeholder={t.rationalePlaceholder}
            className="resize-none rounded-xl border border-border bg-secondary/30 px-3.5 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </div>
        <button type="button" onClick={confirmDecision} disabled={!choice || !rationale.trim()} className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50">{t.submit}</button>
      </div>
    </section>
  )
}
