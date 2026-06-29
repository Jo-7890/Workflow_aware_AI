"use client"

import { useState } from "react"
import {
  AlertTriangle,
  ChevronUp,
  HelpCircle,
  Lightbulb,
  Scale,
  Search,
  Send,
  ShieldAlert,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Language } from "@/components/audit/conversation-panel"
import type { DecisionResult } from "@/components/audit/initial-decision"

type Status = "covered" | "partial" | "none"
type ChecklistItem = {
  label: string
  icon: LucideIcon
  status: Status
  statusLabel: string
  note: string
}

const checklistItems: Record<Language, ChecklistItem[]> = {
  en: [
    {
      label: "Evidence Check",
      icon: Search,
      status: "partial",
      statusLabel: "Partial",
      note: "Benefit was discussed, but outcome type and study quality remain unclear.",
    },
    {
      label: "Risk & Safety",
      icon: ShieldAlert,
      status: "partial",
      statusLabel: "Partial",
      note: "The dialogue assumed low risk, but did not check safety for older adults with hypertension.",
    },
    {
      label: "Applicability",
      icon: Users,
      status: "partial",
      statusLabel: "Partial",
      note: "Mr. Chan’s age and long-term symptoms were mentioned, but not fully matched to the evidence.",
    },
    {
      label: "Alternative Options",
      icon: Scale,
      status: "none",
      statusLabel: "Not discussed",
      note: "No comparison with medical evaluation, sleep assessment, or other fatigue management options.",
    },
  ],
  zh: [
    {
      label: "证据检查",
      icon: Search,
      status: "partial",
      statusLabel: "部分完成",
      note: "对话提到了可能收益，但结果类型和研究质量仍不清楚。",
    },
    {
      label: "风险与安全",
      icon: ShieldAlert,
      status: "partial",
      statusLabel: "部分完成",
      note: "对话中假设风险较低，但没有检查有高血压长者的安全性。",
    },
    {
      label: "适用性",
      icon: Users,
      status: "partial",
      statusLabel: "部分完成",
      note: "提到了陈先生的年龄和长期症状，但还没有完全匹配到证据人群。",
    },
    {
      label: "替代方案",
      icon: Scale,
      status: "none",
      statusLabel: "未讨论",
      note: "还没有和医学评估、睡眠评估或其他疲劳管理方式进行比较。",
    },
  ],
}

const copy = {
  en: {
    unlocked: "AI review unlocked",
    decisionLabel: { accept: "accept", decline: "decline" },
    summary: (choice: string, confidence: number) => (
      <>
        {"You initially chose to "}
        <span className="font-medium text-foreground">{choice}</span>
        {" with "}
        <span className="font-medium text-foreground">{confidence}% confidence</span>
        {
          ". Based on your dialogue, AI will now point out the most important gap before your final decision."
        }
      </>
    ),
    caution:
      "AI caution: your reasoning currently gives more weight to “low risk” than to whether the evidence matches Mr. Chan’s symptom duration and health background.",
    topCheck: "Top Check",
    question: "Does the evidence directly support long-term fatigue improvement for Mr. Chan?",
    explanation:
      "The conversation discussed possible benefits, but did not fully connect the evidence to the patient’s long-term fatigue problem.",
    collapse: "Collapse",
    expand: "Expand",
    tryProbes: "Try these probes",
    probes: [
      "Does the current evidence directly support long-term fatigue improvement for Mr. Chan?",
      "What outcomes were measured: fatigue, sleep, or quality of life?",
      "Are there safety concerns for older adults with hypertension?",
    ],
    followUpTitle: "Ask a follow-up",
    followUpDescription:
      "Select a recommended probe or type your own question. After sending, it will be added to the conversation on the left.",
    limitReached: "Dialogue limit reached.",
    placeholder: "Type your question or notes...",
    send: "Send follow-up",
    revision:
      "Suggested revision: consider Medilight-X only as a supportive option, and first check whether persistent fatigue needs medical evaluation.",
    checklistTitle: "Checklist Summary",
    checklistDescription: "Generated from the case dialogue and your initial decision.",
    viewFull: "View full checklist",
  },
  zh: {
    unlocked: "AI 分析已解锁",
    decisionLabel: { accept: "接受", decline: "不接受" },
    summary: (choice: string, confidence: number) => (
      <>
        你的初始判断是<span className="font-medium text-foreground">{choice}</span>，信心为{" "}
        <span className="font-medium text-foreground">{confidence}%</span>。
        基于前面的对话，AI 将指出你在最终决策前最需要检查的关键缺口。
      </>
    ),
    caution: "AI 提醒：你目前的推理较多依赖“风险较低”，但还没有充分检查证据是否匹配陈先生的症状持续时间和健康背景。",
    topCheck: "最需要检查的问题",
    question: "现有证据是否能直接支持陈先生的长期疲劳改善？",
    explanation: "前面的对话提到了可能的好处，但还没有充分说明这些证据是否真正对应陈先生的长期疲劳问题。",
    collapse: "收起",
    expand: "展开",
    tryProbes: "推荐追问",
    probes: ["现有证据是否能直接支持陈先生的长期疲劳改善？", "研究测量的结果是什么：疲劳、睡眠，还是生活质量？", "对有高血压的长者是否存在安全风险？"],
    followUpTitle: "继续追问",
    followUpDescription: "你可以选择推荐问题，也可以自己输入问题。发送后，问题会追加到左侧对话中。",
    limitReached: "已达到对话轮数上限。",
    placeholder: "输入你的问题或备注……",
    send: "发送追问",
    revision: "建议修正：可以只把 Medilight-X 视为辅助选项，并先确认长期疲劳是否需要医学评估。",
    checklistTitle: "检查清单总结",
    checklistDescription: "根据案例对话和你的初始决策生成。",
    viewFull: "查看完整清单",
  },
}

const statusStyles: Record<Status, string> = {
  covered: "bg-success/10 text-success",
  partial: "bg-warning/15 text-warning-foreground",
  none: "bg-muted text-muted-foreground",
}
const dotStyles: Record<Status, string> = {
  covered: "bg-success",
  partial: "bg-warning",
  none: "bg-muted-foreground/50",
}

type TopCheckProps = {
  language: Language
  decision: DecisionResult
  userRounds: number
  maxRounds: number
  onAskFollowUp: (question: string) => void
}

export function TopCheck({ language, decision, userRounds, maxRounds, onAskFollowUp }: TopCheckProps) {
  const [open, setOpen] = useState(true)
  const [value, setValue] = useState("")
  const t = copy[language]
  const decisionLabel = t.decisionLabel[decision.choice]
  const reachedLimit = userRounds >= maxRounds
  const items = checklistItems[language]

  function sendFollowUp() {
    const cleanValue = value.trim()
    if (!cleanValue || reachedLimit) return
    onAskFollowUp(cleanValue)
    setValue("")
  }

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 rounded-xl border border-primary/20 bg-accent/40 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="size-4" />
          {t.unlocked}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.summary(decisionLabel, decision.confidence)}</p>
        <div className="mt-3 flex gap-2 rounded-lg border border-warning/25 bg-warning/10 px-3 py-2 text-sm leading-relaxed text-muted-foreground">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
          <p>{t.caution}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
          <Target className="size-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-primary">{t.topCheck}</p>
          <h2 className="mt-1 text-pretty text-xl font-semibold leading-snug text-foreground">{t.question}</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">{t.explanation}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t.collapse : t.expand}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronUp className={`size-5 transition-transform ${open ? "" : "rotate-180"}`} />
        </button>
      </div>

      {open && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="grid gap-4 rounded-xl border border-border bg-secondary/40 p-4 md:grid-cols-[1fr_1fr]">
            <div>
              <p className="mb-3 text-sm font-semibold text-foreground">{t.tryProbes}</p>
              <ul className="flex flex-col gap-2.5">
                {t.probes.map((probe) => (
                  <li key={probe}>
                    <button
                      type="button"
                      onClick={() => setValue(probe)}
                      disabled={reachedLimit}
                      className="flex w-full items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <HelpCircle className="size-4 shrink-0 text-primary" />
                      {probe}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-1 text-sm font-semibold text-foreground">{t.followUpTitle}</p>
              <p className="mb-3 text-sm text-muted-foreground">{t.followUpDescription}</p>
              <div className="rounded-lg border border-border bg-card p-2.5">
                <textarea
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault()
                      sendFollowUp()
                    }
                  }}
                  rows={3}
                  disabled={reachedLimit}
                  placeholder={reachedLimit ? t.limitReached : t.placeholder}
                  className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
                />
                <div className="flex justify-end">
                  <Button
                    type="button"
                    size="icon"
                    aria-label={t.send}
                    onClick={sendFollowUp}
                    disabled={!value.trim() || reachedLimit}
                    className="size-9"
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lightbulb className="size-3.5 text-primary" />
                {t.revision}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-secondary/30 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{t.checklistTitle}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.checklistDescription}</p>
              </div>
              <button type="button" className="shrink-0 text-xs font-medium text-primary transition-colors hover:text-primary/80">
                {t.viewFull}
              </button>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label} className="rounded-lg border border-border bg-card px-3 py-2.5">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <Icon className="size-4 shrink-0 text-primary" />
                        {item.label}
                      </span>
                      <span className={cn("flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium", statusStyles[item.status])}>
                        <span className={cn("size-1.5 rounded-full", dotStyles[item.status])} />
                        {item.statusLabel}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{item.note}</p>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </section>
  )
}
