"use client"

import { useState } from "react"
import { MessagesSquare } from "lucide-react"
import { WorkflowHeader } from "@/components/audit/workflow-header"
import { ConversationPanel, type Language, type Turn } from "@/components/audit/conversation-panel"
import { InitialDecision, type DecisionResult } from "@/components/audit/initial-decision"
import { TopCheck } from "@/components/audit/top-check"
import { FinalDecision } from "@/components/audit/final-decision"

const MAX_DIALOGUE_ROUNDS = 10
const MIN_ROUNDS_BEFORE_INITIAL_DECISION = 3

const initialCaseText: Record<Language, string> = {
  en: "Here is the case. Mr. Chan is 68 years old. He has had persistent fatigue for six months, mild insomnia, and controlled hypertension. A new home light-based treatment called Medilight-X claims to improve energy and sleep within four weeks. Please ask questions before making your decision.",
  zh: "这是案例。陈先生今年 68 岁，过去 6 个月一直感到疲劳，并有轻度失眠和控制稳定的高血压。现在有一种名为 Medilight-X 的居家光照治疗，声称可以在 4 周内改善精力和睡眠。请你先提问，再决定是否建议他接受这个治疗。",
}

const initialTurns: Turn[] = [
  { role: "assistant", time: "10:20 AM", text: initialCaseText.en, textByLanguage: initialCaseText },
]

const fixedAIReplies: Array<Record<Language, string>> = [
  {
    en: "Mr. Chan’s key features are older age, long-term fatigue, mild sleep difficulty, and controlled hypertension. Medilight-X claims to improve energy and sleep, but the claim needs to be checked against evidence and safety information.",
    zh: "陈先生的关键特征包括：年龄较大、长期疲劳、轻度睡眠困难，以及控制稳定的高血压。Medilight-X 声称可以改善精力和睡眠，但这个说法需要结合证据和安全性信息进一步核查。",
  },
  {
    en: "The current evidence appears to suggest possible short-term symptom improvement, but it is unclear whether the treatment improves long-term fatigue specifically or whether the studies were strong enough to guide a decision.",
    zh: "目前证据似乎提示短期症状可能有所改善，但还不清楚这种治疗是否能专门改善长期疲劳，也不清楚研究质量是否足以支持决策。",
  },
  {
    en: "It may be low risk for some people, but safety should not be assumed. For Mr. Chan, it would be important to check whether the treatment has been tested in older adults and whether hypertension or medications create any concerns.",
    zh: "它对部分人可能风险较低，但不能直接假设安全。对陈先生来说，需要核查这种治疗是否在长者中测试过，以及高血压或正在使用的药物是否会带来额外风险。",
  },
  {
    en: "The main evidence gap is whether the outcomes measured in the studies match Mr. Chan’s problem. Improvement in sleep or general well-being is not the same as clear improvement in persistent fatigue.",
    zh: "主要证据缺口是：研究测量的结果是否真正对应陈先生的问题。睡眠或整体感受改善，并不等同于长期疲劳得到了明确改善。",
  },
  {
    en: "A careful decision would compare Medilight-X with other options, such as medical evaluation for fatigue, sleep assessment, lifestyle support, and monitoring for underlying causes.",
    zh: "更谨慎的决策应该把 Medilight-X 和其他选择进行比较，例如疲劳的医学评估、睡眠评估、生活方式支持，以及对潜在原因的监测。",
  },
  {
    en: "If he considers using it, it should be framed as a supportive option rather than a replacement for medical evaluation. He should also monitor symptoms and stop if there are adverse effects.",
    zh: "如果他考虑使用，应把它视为辅助选项，而不是替代医学评估。同时应持续观察症状，如果出现不良反应应停止使用。",
  },
  {
    en: "The most useful source would be independent clinical evidence, especially randomized trials or systematic reviews, rather than testimonials, advertisements, or single-user reports.",
    zh: "最有用的信息来源应是独立的临床证据，尤其是随机对照试验或系统综述，而不是用户见证、广告或单个使用者报告。",
  },
  {
    en: "The claim would be more credible if it clearly reported who was studied, what outcome was measured, how long the follow-up lasted, and whether adverse effects were monitored.",
    zh: "如果这个说法清楚说明研究对象是谁、测量了什么结果、随访多久，以及是否监测不良反应，它会更可信。",
  },
  {
    en: "The decision should also consider uncertainty. If benefits are uncertain but risk and cost are acceptable, a cautious trial may be possible, but only with clear limits and medical advice when symptoms persist.",
    zh: "决策也需要考虑不确定性。如果收益不确定，但风险和成本可以接受，可以考虑谨慎尝试；但需要设定清楚边界，并在症状持续时寻求医学建议。",
  },
  {
    en: "You have reached the dialogue limit. Please use the information collected to make or revise your decision.",
    zh: "你已经达到对话轮数上限。请根据已经收集的信息做出或修正你的决策。",
  },
]

const finalLockCopy = {
  en: {
    title: "Continue the dialogue before the final decision",
    text: "The AI review is now available. Ask at least one follow-up question, using either the recommended probes on the right or the conversation box above. The final decision form will appear below the conversation after that follow-up dialogue.",
  },
  zh: {
    title: "请先继续对话，再进行最终决策",
    text: "AI 建议已经显示。请至少再追问一轮，可以使用右侧推荐问题，也可以在上方对话框自己输入。完成这轮追问后，最终决策界面会出现在左侧对话下方。",
  },
}

function formatTime(language: Language) {
  return new Intl.DateTimeFormat(language === "zh" ? "zh-CN" : "en-US", { hour: "numeric", minute: "2-digit" }).format(new Date())
}

export default function Page() {
  const [language, setLanguage] = useState<Language>("en")
  const [turns, setTurns] = useState<Turn[]>(initialTurns)
  const [decision, setDecision] = useState<DecisionResult | null>(null)
  const [finalDecision, setFinalDecision] = useState<DecisionResult | null>(null)
  const [reviewStartRounds, setReviewStartRounds] = useState<number | null>(null)

  const userRounds = turns.filter((turn) => turn.role === "user").length
  const canMakeInitialDecision = userRounds >= MIN_ROUNDS_BEFORE_INITIAL_DECISION
  const reviewReady = decision !== null && reviewStartRounds !== null
  const hasPostReviewDialogue = reviewReady && userRounds > reviewStartRounds
  const finalSubmitted = finalDecision !== null

  function sendToConversation(text: string) {
    const cleanText = text.trim()
    if (!cleanText || userRounds >= MAX_DIALOGUE_ROUNDS) return
    const replyIndex = Math.min(userRounds, fixedAIReplies.length - 1)
    const now = formatTime(language)
    const reply = fixedAIReplies[replyIndex]

    setTurns((currentTurns) => [
      ...currentTurns,
      { role: "user", time: now, text: cleanText },
      { role: "assistant", time: now, text: reply.en, textByLanguage: reply },
    ])

    if (finalDecision) setFinalDecision(null)
  }

  function handleInitialDecisionConfirm(result: DecisionResult) {
    setDecision(result)
    setReviewStartRounds(userRounds)
    setFinalDecision(null)
  }

  function handleInitialDecisionChange() {
    setDecision(null)
    setReviewStartRounds(null)
    setFinalDecision(null)
  }

  const finalLockText = finalLockCopy[language]

  return (
    <main className="min-h-screen bg-background">
      <WorkflowHeader
        language={language}
        onLanguageChange={setLanguage}
        reviewReady={reviewReady}
        finalUnlocked={hasPostReviewDialogue}
        finalSubmitted={finalSubmitted}
      />
      <div className={`mx-auto grid max-w-6xl items-stretch gap-5 px-4 py-5 lg:px-6 ${reviewReady ? "lg:grid-cols-2" : "justify-center lg:grid-cols-[minmax(0,760px)]"}`}>
        <div className="flex h-full flex-col gap-5">
          <ConversationPanel language={language} turns={turns} userRounds={userRounds} maxRounds={MAX_DIALOGUE_ROUNDS} onSend={sendToConversation} />
          {!reviewReady && (
            <InitialDecision
              language={language}
              disabled={!canMakeInitialDecision}
              minRounds={MIN_ROUNDS_BEFORE_INITIAL_DECISION}
              currentRounds={userRounds}
              onConfirm={handleInitialDecisionConfirm}
              onChange={handleInitialDecisionChange}
            />
          )}
          {reviewReady && !hasPostReviewDialogue && (
            <section className="rounded-2xl border border-dashed border-primary/30 bg-accent/30 p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
                <MessagesSquare className="size-4 text-primary" />
                {finalLockText.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{finalLockText.text}</p>
            </section>
          )}
          {reviewReady && hasPostReviewDialogue && <FinalDecision language={language} onConfirm={setFinalDecision} />}
        </div>
        {reviewReady && decision && (
          <div className="flex h-full flex-col">
            <TopCheck language={language} decision={decision} userRounds={userRounds} maxRounds={MAX_DIALOGUE_ROUNDS} onAskFollowUp={sendToConversation} />
          </div>
        )}
      </div>
    </main>
  )
}
