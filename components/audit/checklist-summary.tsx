import { Scale, ShieldAlert, Users, type LucideIcon, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Language } from "@/components/audit/conversation-panel"

type Status = "covered" | "partial" | "none"
type Item = { label: string; icon: LucideIcon; status: Status; statusLabel: string; note: string }

const itemsByLanguage: Record<Language, Item[]> = {
  en: [
    { label: "Evidence Check", icon: Search, status: "partial", statusLabel: "Partial", note: "Benefit was discussed, but outcome type and study quality remain unclear." },
    { label: "Risk & Safety", icon: ShieldAlert, status: "partial", statusLabel: "Partial", note: "The dialogue assumed low risk, but did not check safety for older adults with hypertension." },
    { label: "Applicability", icon: Users, status: "partial", statusLabel: "Partial", note: "Mr. Chan’s age and long-term symptoms were mentioned, but not fully matched to the evidence." },
    { label: "Alternative Options", icon: Scale, status: "none", statusLabel: "Not discussed", note: "No comparison with medical evaluation, sleep assessment, or other fatigue management options." },
  ],
  zh: [
    { label: "证据检查", icon: Search, status: "partial", statusLabel: "部分完成", note: "对话提到了可能收益，但结果类型和研究质量仍不清楚。" },
    { label: "风险与安全", icon: ShieldAlert, status: "partial", statusLabel: "部分完成", note: "对话中假设风险较低，但没有检查有高血压长者的安全性。" },
    { label: "适用性", icon: Users, status: "partial", statusLabel: "部分完成", note: "提到了陈先生的年龄和长期症状，但还没有完全匹配到证据人群。" },
    { label: "替代方案", icon: Scale, status: "none", statusLabel: "未讨论", note: "还没有和医学评估、睡眠评估或其他疲劳管理方式进行比较。" },
  ],
}

const copy = {
  en: { title: "Checklist Summary", description: "Generated from the case dialogue and your initial decision.", viewFull: "View full checklist" },
  zh: { title: "检查清单总结", description: "根据案例对话和你的初始决策生成。", viewFull: "查看完整清单" },
}

const statusStyles: Record<Status, string> = { covered: "bg-success/10 text-success", partial: "bg-warning/15 text-warning-foreground", none: "bg-muted text-muted-foreground" }
const dotStyles: Record<Status, string> = { covered: "bg-success", partial: "bg-warning", none: "bg-muted-foreground/50" }

export function ChecklistSummary({ language }: { language: Language }) {
  const t = copy[language]
  const items = itemsByLanguage[language]
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div><h2 className="text-base font-semibold text-foreground">{t.title}</h2><p className="mt-1 text-sm text-muted-foreground">{t.description}</p></div>
        <button type="button" className="text-sm font-medium text-primary transition-colors hover:text-primary/80">{t.viewFull}</button>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <li key={item.label} className="rounded-xl border border-border bg-secondary/30 px-4 py-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2.5 text-sm font-medium text-foreground"><Icon className="size-4 text-primary" />{item.label}</span>
                <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", statusStyles[item.status])}><span className={cn("size-1.5 rounded-full", dotStyles[item.status])} />{item.statusLabel}</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{item.note}</p>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
