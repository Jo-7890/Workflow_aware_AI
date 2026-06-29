import { Activity, CheckCircle2, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Language } from "@/components/audit/conversation-panel"

type WorkflowHeaderProps = {
  language: Language
  onLanguageChange: (language: Language) => void
  reviewReady?: boolean
  finalUnlocked?: boolean
  finalSubmitted?: boolean
}

const copy = {
  en: { title: "Audit Workflow AI", steps: ["Case dialogue", "Initial decision", "AI review", "Final decision"], help: "Help", exit: "Exit", switchToZh: "中文", switchToEn: "EN" },
  zh: { title: "AI 审核流程助手", steps: ["案例对话", "初始决策", "AI 建议", "最终决策"], help: "帮助", exit: "退出", switchToZh: "中文", switchToEn: "EN" },
}

export function WorkflowHeader({ language, onLanguageChange, reviewReady = false, finalUnlocked = false, finalSubmitted = false }: WorkflowHeaderProps) {
  const t = copy[language]
  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 lg:px-6">
      <div className="flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Activity className="size-5" /></span>
        <span className="text-lg font-semibold tracking-tight text-foreground">{t.title}</span>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <HeaderStep label={t.steps[0]} active={!reviewReady} done={reviewReady} />
        <HeaderStep label={t.steps[1]} active={!reviewReady} done={reviewReady} />
        <HeaderStep label={t.steps[2]} active={reviewReady && !finalUnlocked} done={finalUnlocked} />
        <HeaderStep label={t.steps[3]} active={finalUnlocked && !finalSubmitted} done={finalSubmitted} />
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden overflow-hidden rounded-xl border border-border sm:flex">
          <button type="button" onClick={() => onLanguageChange("zh")} className={cn("px-3 py-2 text-xs font-semibold transition-colors", language === "zh" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary")} aria-pressed={language === "zh"}>{t.switchToZh}</button>
          <button type="button" onClick={() => onLanguageChange("en")} className={cn("border-l border-border px-3 py-2 text-xs font-semibold transition-colors", language === "en" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary")} aria-pressed={language === "en"}>{t.switchToEn}</button>
        </div>
        <Button variant="ghost" size="icon" aria-label={t.help} className="text-muted-foreground"><HelpCircle className="size-5" /></Button>
        <Button variant="outline">{t.exit}</Button>
      </div>
    </header>
  )
}

function HeaderStep({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", active ? "bg-primary text-primary-foreground" : done ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground")}>
      {done ? <CheckCircle2 className="size-3.5" /> : <span className="size-1.5 rounded-full bg-current" />}
      {label}
    </span>
  )
}
