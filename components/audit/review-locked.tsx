import { ClipboardCheck, LockKeyhole, MessagesSquare, MousePointerClick, Sparkles } from "lucide-react"

const steps = [
  {
    icon: MessagesSquare,
    title: "1. Read the case and three-round dialogue",
    text: "The AI first presents Mr. Chan’s situation, then answers basic questions about the treatment claim, evidence, and safety.",
  },
  {
    icon: ClipboardCheck,
    title: "2. Make two initial judgments",
    text: "Choose whether to accept or decline the treatment, then report your confidence before seeing AI feedback.",
  },
  {
    icon: Sparkles,
    title: "3. Unlock AI reasoning review",
    text: "After confirmation, AI shows the top check question and a checklist based on the dialogue.",
  },
]

export function ReviewLocked() {
  return (
    <section className="flex flex-1 flex-col rounded-2xl border border-dashed border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
          <LockKeyhole className="size-5" />
        </span>
        <div>
          <p className="text-sm font-medium text-primary">AI Review is hidden first</p>
          <h2 className="mt-1 text-xl font-semibold leading-snug text-foreground">Confirm your initial decision to see the AI prompt and checklist.</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This separates unaided judgment from AI-supported reflection. After confirmation, the conversation and AI analysis will appear together.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {steps.map((step) => {
          const Icon = step.icon

          return (
            <div key={step.title} className="rounded-xl border border-border bg-secondary/30 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Icon className="size-4 text-primary" />
                {step.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </div>
          )
        })}
      </div>

      <div className="mt-auto pt-5">
        <p className="flex items-center gap-2 rounded-xl bg-accent/50 px-4 py-3 text-sm text-accent-foreground">
          <MousePointerClick className="size-4" />
          Click “Confirm and review with AI” on the left to enter the AI reasoning stage.
        </p>
      </div>
    </section>
  )
}
