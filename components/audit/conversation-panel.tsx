"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, ClipboardList, MessagesSquare, Send, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type Language = "en" | "zh"

export type Turn = {
  role: "user" | "assistant"
  time: string
  text: string
  textByLanguage?: Record<Language, string>
}

type ConversationPanelProps = {
  language: Language
  turns: Turn[]
  userRounds: number
  maxRounds: number
  onSend: (text: string) => void
}

const copy = {
  en: {
    title: "Conversation",
    rounds: "rounds",
    caseBrief: "Case brief",
    caseTitle: "Should Mr. Chan accept Medilight-X for persistent fatigue?",
    caseDescription: "Mr. Chan is 68 years old. He has long-term fatigue, mild insomnia, and controlled hypertension. A new treatment claims to improve energy and sleep, but the evidence may be incomplete.",
    imageAlt: "Illustration of an older adult considering a health treatment",
    assistant: "AI Assistant",
    you: "You",
    limitReached: "Dialogue limit reached.",
    placeholder: "Ask the AI about the case, evidence, safety, or alternatives...",
    helper: "Complete at least 3 rounds before making the initial decision. The current demo uses fixed AI replies and stops at 10 user turns.",
    send: "Send message",
  },
  zh: {
    title: "对话",
    rounds: "轮对话",
    caseBrief: "案例简介",
    caseTitle: "陈先生是否应该接受 Medilight-X 来改善长期疲劳？",
    caseDescription: "陈先生今年 68 岁，已有长期疲劳、轻度失眠，并且有控制稳定的高血压。一种新的治疗方式声称可以改善精力和睡眠，但相关证据可能并不完整。",
    imageAlt: "一位长者正在考虑健康治疗的插图",
    assistant: "AI 助手",
    you: "你",
    limitReached: "已达到对话轮数上限。",
    placeholder: "向 AI 询问案例、证据、安全性或替代方案……",
    helper: "请先完成至少 3 轮对话，再进行初始决策。当前 demo 使用固定 AI 回复，并限制最多 10 轮用户提问。",
    send: "发送消息",
  },
}

export function ConversationPanel({ language, turns, userRounds, maxRounds, onSend }: ConversationPanelProps) {
  const [value, setValue] = useState("")
  const listRef = useRef<HTMLUListElement | null>(null)
  const reachedLimit = userRounds >= maxRounds
  const t = copy[language]

  useEffect(() => {
    listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [turns])

  function handleSend() {
    const cleanValue = value.trim()
    if (!cleanValue || reachedLimit) return
    onSend(cleanValue)
    setValue("")
  }

  return (
    <section className="flex flex-1 flex-col rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <MessagesSquare className="size-4 text-primary" />
          {t.title}
        </h2>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {userRounds}/{maxRounds} {t.rounds}
        </span>
      </div>

      <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-secondary/30">
        <div className="grid gap-0 sm:grid-cols-[140px_1fr]">
          <div className="flex items-center justify-center bg-accent/60 p-4">
            <img src="/case-medilight.svg" alt={t.imageAlt} className="h-28 w-28" />
          </div>
          <div className="p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <ClipboardList className="size-3.5" />
              {t.caseBrief}
            </p>
            <h3 className="text-base font-semibold leading-snug text-foreground">{t.caseTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.caseDescription}</p>
          </div>
        </div>
      </div>

      <ul ref={listRef} className="max-h-[520px] flex-1 overflow-y-auto pr-1 flex flex-col gap-4">
        {turns.map((turn, i) => {
          const displayText = turn.textByLanguage?.[language] ?? turn.text
          return (
            <li key={`${turn.time}-${i}`} className={cn("flex flex-col gap-1", turn.role === "user" && "items-end")}>
              {turn.role === "assistant" && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground"><Bot className="size-3" /></span>
                  <span className="font-medium text-foreground">{t.assistant}</span>
                  <span className="text-muted-foreground">{turn.time}</span>
                </div>
              )}
              {turn.role === "user" && (
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent text-primary"><UserRound className="size-3" /></span>
                  <span className="font-medium text-foreground">{t.you}</span>
                  <span className="text-muted-foreground">{turn.time}</span>
                </div>
              )}
              <p className={cn("max-w-[88%] text-pretty whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed", turn.role === "user" ? "rounded-tr-sm bg-accent text-foreground" : "rounded-tl-sm bg-muted text-foreground")}>{displayText}</p>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-3">
        <div className="flex gap-2">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                handleSend()
              }
            }}
            disabled={reachedLimit}
            rows={2}
            placeholder={reachedLimit ? t.limitReached : t.placeholder}
            className="min-h-12 flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />
          <Button type="button" size="icon" onClick={handleSend} disabled={!value.trim() || reachedLimit} aria-label={t.send} className="mt-auto size-10">
            <Send className="size-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t.helper}</p>
      </div>
    </section>
  )
}
