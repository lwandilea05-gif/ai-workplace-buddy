import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BriefcaseBusiness, Check, Clipboard, FlaskConical, Mail, Menu, MessageCircle, PanelLeftClose, Send, X } from "lucide-react";
import type { ChatStatus } from "ai";

import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type View = "email" | "chat" | "research";
type Tone = "Formal" | "Friendly" | "Persuasive";
type ChatMessage = { id: number; role: "user" | "assistant"; content: string };

const navItems = [
  { id: "email" as const, label: "Email Generator", icon: Mail },
  { id: "chat" as const, label: "Workplace Chat", icon: MessageCircle },
  { id: "research" as const, label: "Research Assistant", icon: FlaskConical },
];

const viewCopy: Record<View, { title: string; subtitle: string }> = {
  email: { title: "Email Generator", subtitle: "Draft, tone, and refine workplace email in one place" },
  chat: { title: "Workplace Chat", subtitle: "Get practical guidance for everyday work situations" },
  research: { title: "Research Assistant", subtitle: "Turn long topics and articles into useful next steps" },
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      { name: "description", content: "Generate professional emails, ask workplace questions, and summarize research with a private, frontend-only AI assistant demo." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Professional email, workplace chat, and research tools in one focused workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkplaceApp,
});

function WorkplaceApp() {
  const [view, setView] = useState<View>("email");
  const [mobileNav, setMobileNav] = useState(false);

  const selectView = (next: View) => {
    setView(next);
    setMobileNav(false);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-ink">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_8%_8%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_32%),radial-gradient(circle_at_92%_55%,color-mix(in_oklab,var(--accent-deep)_9%,transparent),transparent_36%)]" />
      <div className="relative z-10 flex min-h-screen">
        <aside className={cn("fixed inset-y-0 left-0 z-40 flex w-[240px] flex-col border-r border-border/70 bg-glass-strong p-4 backdrop-blur-2xl transition-transform md:static md:translate-x-0", mobileNav ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center gap-2.5 px-1 py-3">
            <div className="grid size-9 place-items-center rounded-lg bg-accent-deep text-primary-foreground shadow-sm"><BriefcaseBusiness className="size-4" /></div>
            <div className="leading-tight"><div className="text-sm font-bold">AI Workplace</div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-mist">Productivity Assistant</div></div>
            <Button aria-label="Close menu" className="ml-auto md:hidden" onClick={() => setMobileNav(false)} size="icon-sm" variant="ghost"><X /></Button>
          </div>
          <nav aria-label="Main navigation" className="mt-4 flex flex-col gap-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <Button key={id} className={cn("h-10 justify-start gap-3 px-3 text-[13px] shadow-none", view === id ? "bg-glass-strong text-ink ring-1 ring-border" : "text-mist hover:bg-glass hover:text-ink")} onClick={() => selectView(id)} variant="ghost">
                <Icon className={cn("size-4", view === id && "text-primary")} />{label}
              </Button>
            ))}
          </nav>
          <div className="mt-auto rounded-lg border border-border/70 bg-glass p-3">
            <div className="flex items-center gap-2 text-xs font-semibold"><span className="size-2 rounded-full bg-success" />Ready to use</div>
            <p className="mt-1 text-[11px] leading-relaxed text-mist">No account or personal information required.</p>
          </div>
        </aside>
        {mobileNav && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-ink/20 md:hidden" onClick={() => setMobileNav(false)} />}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex min-h-16 items-center gap-3 border-b border-border/70 bg-glass px-4 backdrop-blur-xl sm:px-6">
            <Button aria-label="Open menu" className="md:hidden" onClick={() => setMobileNav(true)} size="icon-sm" variant="ghost"><Menu /></Button>
            <div className="min-w-0"><h1 className="truncate text-[15px] font-bold">{viewCopy[view].title}</h1><p className="truncate text-[11px] text-mist">{viewCopy[view].subtitle}</p></div>
            <span className="ml-auto hidden items-center gap-1.5 rounded-full bg-glass-strong px-3 py-1 text-[11px] font-semibold text-mist ring-1 ring-border sm:inline-flex"><span className="size-1.5 rounded-full bg-success" />Demo ready</span>
          </header>
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-7">
            <div className="mx-auto w-full max-w-[1080px] soft-rise" key={view}>
              {view === "email" && <EmailGenerator />}
              {view === "chat" && <WorkplaceChat />}
              {view === "research" && <ResearchAssistant />}
              <ResponsibleAI />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function EmailGenerator() {
  const [prompt, setPrompt] = useState("Write a short email to Priya and the Northwind Ops team confirming that the Q4 vendor review has moved to Thursday, 2:00 PM, and ask everyone to bring their shortlist notes.");
  const [tone, setTone] = useState<Tone>("Formal");
  const [status, setStatus] = useState<"idle" | "loading" | "ready">("ready");
  const [copied, setCopied] = useState(false);
  const [draft, setDraft] = useState("Subject: Q4 vendor review moved to Thursday, 2:00 PM\n\nHi Priya and team,\n\nThe Q4 vendor review has been moved to Thursday at 2:00 PM in the Riverside room. Please treat Thursday as the confirmed time.\n\nCould everyone bring their shortlist notes and the pricing sheet for their assigned vendors? I’ll share the consolidated agenda before the meeting.\n\nThanks,\nRachel");

  const generate = () => {
    if (!prompt.trim()) return;
    setStatus("loading");
    window.setTimeout(() => {
      const intro = tone === "Friendly" ? "Hi Priya and team,\n\nHope you’re all doing well." : tone === "Persuasive" ? "Hi Priya and team,\n\nTo keep our Q4 vendor decision on track," : "Hi Priya and team,";
      setDraft(`Subject: Q4 vendor review — Thursday at 2:00 PM\n\n${intro}\n\nThe Q4 vendor review has moved to Thursday at 2:00 PM. Please bring your shortlist notes and any relevant pricing details so we can make the session as productive as possible.\n\nI’ll circulate the consolidated agenda before the meeting.\n\nBest,\nRachel`);
      setStatus("ready");
    }, 900);
  };

  const copyDraft = async () => {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,350px)_minmax(0,1fr)]">
      <section className="glass-panel rounded-lg p-4 sm:p-5">
        <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-mist" htmlFor="email-prompt">What should the email say?</label>
        <Textarea id="email-prompt" className="mt-2 min-h-36 resize-none border-border bg-glass-strong text-[13px] leading-relaxed" onChange={(event) => setPrompt(event.target.value)} value={prompt} />
        <fieldset className="mt-4"><legend className="text-[11px] font-bold uppercase tracking-[0.12em] text-mist">Tone</legend><div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-glass p-1 ring-1 ring-border">
          {(["Formal", "Friendly", "Persuasive"] as Tone[]).map((item) => <Button key={item} className="rounded-full text-xs shadow-none" onClick={() => setTone(item)} size="sm" variant={tone === item ? "default" : "ghost"}>{item}</Button>)}
        </div></fieldset>
        <Button className="mt-5 w-full" disabled={!prompt.trim() || status === "loading"} onClick={generate}>{status === "loading" ? <Shimmer className="text-primary-foreground">Drafting your email…</Shimmer> : <><Mail />Generate email</>}</Button>
        <div className="mt-3 flex items-center gap-2 rounded-md bg-glass px-3 py-2 text-[11px] text-mist ring-1 ring-border"><span className={cn("size-1.5 rounded-full", status === "loading" ? "bg-warning" : "bg-success")} />{status === "loading" ? "Creating a polished draft" : "Draft ready · editable output"}</div>
      </section>
      <section className="glass-panel flex min-h-[430px] flex-col rounded-lg p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2"><div><div className="text-[11px] font-bold uppercase tracking-[0.12em] text-mist">Generated email</div><div className="mt-1 text-[13px] font-semibold">Review and edit before sending</div></div><Button aria-label="Copy email" onClick={copyDraft} size="icon-sm" variant="outline">{copied ? <Check /> : <Clipboard />}</Button></div>
        {status === "loading" ? <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-lg border border-border bg-glass-strong"><Shimmer className="font-medium">Writing a clear, professional draft…</Shimmer></div> : <Textarea aria-label="Editable generated email" className="mt-4 min-h-[310px] flex-1 resize-none border-border bg-glass-strong p-4 text-[13px] leading-6" onChange={(event) => setDraft(event.target.value)} value={draft} />}
        <div className="mt-3 grid gap-2 sm:grid-cols-3">{[["Tone check", `${tone} · clear`], ["Clarity", "Purpose stated early"], ["Reading time", "~30 seconds"]].map(([label, value]) => <div className="rounded-md bg-glass p-3 ring-1 ring-border" key={label}><div className="text-[11px] font-semibold">{label}</div><div className="mt-0.5 text-[11px] text-mist">{value}</div></div>)}</div>
      </section>
    </div>
  );
}

function WorkplaceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<ChatStatus>("ready");

  const submit = (text: string) => {
    if (!text.trim() || status !== "ready") return;
    const question = text.trim();
    setMessages((current) => [...current, { id: Date.now(), role: "user", content: question }]);
    setInput("");
    setStatus("submitted");
    window.setTimeout(() => {
      setMessages((current) => [...current, { id: Date.now() + 1, role: "assistant", content: mockChatReply(question) }]);
      setStatus("ready");
    }, 850);
  };

  return (
    <section className="glass-panel mx-auto flex min-h-[650px] max-w-4xl flex-col overflow-hidden rounded-lg">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4"><div className="grid size-9 place-items-center rounded-lg bg-accent-deep text-primary-foreground"><BriefcaseBusiness className="size-4" /></div><div><h2 className="text-sm font-bold">Workmate advisor</h2><p className="text-[11px] text-mist">Practical guidance with your judgment in the loop</p></div><Button className="ml-auto" disabled={!messages.length} onClick={() => setMessages([])} size="sm" variant="ghost">Clear</Button></div>
      <Conversation className="min-h-0 flex-1"><ConversationContent className="gap-5 p-5">
        {messages.length === 0 ? <ConversationEmptyState icon={<MessageCircle className="size-8" />} title="What can I help you work through?" description="Ask about communication, meetings, feedback, priorities, or team collaboration."><div className="grid max-w-lg gap-2 sm:grid-cols-2">{["How can I give constructive feedback?", "Help me prepare for a difficult meeting"].map((suggestion) => <Button key={suggestion} className="h-auto whitespace-normal py-3 text-left text-xs" onClick={() => submit(suggestion)} variant="outline">{suggestion}</Button>)}</div></ConversationEmptyState> : messages.map((message) => <Message from={message.role} key={message.id}><MessageContent className={message.role === "user" ? "bg-primary text-primary-foreground" : "max-w-2xl"}><MessageResponse>{message.content}</MessageResponse></MessageContent></Message>)}
        {status === "submitted" && <Message from="assistant"><MessageContent><Shimmer>Thinking through a practical response…</Shimmer></MessageContent></Message>}
      </ConversationContent><ConversationScrollButton /></Conversation>
      <div className="border-t border-border p-4"><PromptInput className="bg-glass-strong" onSubmit={(message) => submit(message.text)}><PromptInputTextarea className="min-h-20" onChange={(event) => setInput(event.target.value)} placeholder="Ask a workplace question…" value={input} /><PromptInputFooter className="justify-between"><span className="text-[10px] text-mist">Enter to send · Shift + Enter for a new line</span><PromptInputSubmit disabled={!input.trim()} status={status} /></PromptInputFooter></PromptInput></div>
    </section>
  );
}

function mockChatReply(question: string) {
  if (question.toLowerCase().includes("feedback")) return "Use a **specific, balanced structure**:\n\n1. Describe the situation without judgment.\n2. Explain the impact on the work or team.\n3. Ask for their perspective.\n4. Agree on one clear next step.\n\nTry: *“In yesterday’s client review, two key figures were missing from the deck. That made it harder to answer the client’s questions. What got in the way, and how can we make the next review smoother?”*";
  if (question.toLowerCase().includes("meeting")) return "Prepare around three points: **the outcome you need, the facts you can verify, and the compromise you can accept**. Open calmly, name the shared goal, and keep the conversation focused on options rather than blame.";
  return "A useful way to approach this is to separate the **shared goal**, the **constraint**, and the **next action**. State each one plainly, invite the other person’s view, then confirm who will do what and by when.";
}

function ResearchAssistant() {
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(false);
  const canAnalyze = source.trim().length > 10;
  const words = useMemo(() => source.trim() ? source.trim().split(/\s+/).length : 0, [source]);
  const analyze = () => { if (!canAnalyze) return; setLoading(true); setResult(false); window.setTimeout(() => { setLoading(false); setResult(true); }, 950); };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,390px)_minmax(0,1fr)]">
      <section className="glass-panel rounded-lg p-5"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-accent-deep text-primary-foreground"><FlaskConical className="size-4" /></div><div><h2 className="text-sm font-bold">Add your research</h2><p className="text-[11px] text-mist">Paste a topic, notes, or article text</p></div></div><Textarea className="mt-5 min-h-[330px] resize-none border-border bg-glass-strong text-[13px] leading-6" onChange={(event) => setSource(event.target.value)} placeholder="Example: Summarize the effects of asynchronous communication on hybrid teams, with practical recommendations for managers…" value={source} /><div className="mt-2 flex justify-between text-[10px] text-mist"><span>Use public, non-confidential information</span><span>{words} words</span></div><Button className="mt-4 w-full" disabled={!canAnalyze || loading} onClick={analyze}>{loading ? <Shimmer className="text-primary-foreground">Analyzing source…</Shimmer> : <><FlaskConical />Analyze research</>}</Button></section>
      <section className="glass-panel min-h-[520px] rounded-lg p-5">{loading ? <div className="flex h-full min-h-[450px] flex-col items-center justify-center"><Shimmer className="text-sm font-semibold">Finding the signal in your source…</Shimmer><p className="mt-2 text-xs text-mist">Preparing summary, insights, and recommendations</p></div> : !result ? <div className="flex h-full min-h-[450px] flex-col items-center justify-center text-center"><div className="grid size-12 place-items-center rounded-lg bg-glass-strong text-primary ring-1 ring-border"><PanelLeftClose /></div><h3 className="mt-4 font-serif text-2xl font-semibold">Your analysis will appear here</h3><p className="mt-2 max-w-sm text-xs leading-relaxed text-mist">Add a topic or article to receive a concise summary, key insights, and practical recommendations.</p></div> : <ResearchResult />}</section>
    </div>
  );
}

function ResearchResult() {
  return <div className="soft-rise"><div className="flex items-center justify-between"><div><div className="text-[11px] font-bold uppercase tracking-[0.12em] text-mist">Research brief</div><h2 className="mt-1 font-serif text-2xl font-semibold">A practical synthesis</h2></div><span className="rounded-full bg-glass-strong px-3 py-1 text-[10px] font-semibold text-success ring-1 ring-border">Analysis ready</span></div><div className="mt-5 space-y-3"><ResultBlock title="Summary">The source argues that effective hybrid work depends less on location and more on deliberate communication norms. Teams perform best when information is documented, decisions are easy to find, and synchronous meetings are reserved for discussion rather than status updates.</ResultBlock><ResultBlock title="Key insights"><ul className="list-disc space-y-1.5 pl-4"><li>Clear response-time expectations reduce unnecessary urgency.</li><li>Written decision records improve continuity across time zones.</li><li>Managers should measure outcomes instead of visible activity.</li></ul></ResultBlock><ResultBlock title="Recommendations"><ol className="list-decimal space-y-1.5 pl-4"><li>Create one searchable home for decisions and project context.</li><li>Replace one weekly status meeting with an async update.</li><li>Review communication norms with the team after 30 days.</li></ol></ResultBlock></div></div>;
}

function ResultBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-lg bg-glass-strong p-4 ring-1 ring-border"><h3 className="text-xs font-bold">{title}</h3><div className="mt-2 text-[13px] leading-6 text-mist">{children}</div></div>;
}

function ResponsibleAI() {
  return <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-border bg-glass px-4 py-3 backdrop-blur-xl"><span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-warning/15 text-[10px] font-bold text-warning">i</span><p className="text-[11px] leading-relaxed text-mist"><strong className="text-ink">Responsible AI:</strong> Workmate provides mock suggestions and may be inaccurate. Review facts, tone, and decisions yourself. Do not enter personal, sensitive, or confidential information.</p></div>;
}