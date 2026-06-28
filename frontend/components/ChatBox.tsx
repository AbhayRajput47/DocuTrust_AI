"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AnswerCard from "./AnswerCard";
import { MessageSquare, Send, Sparkles, WandSparkles } from "lucide-react";

type ChatConversation = {
  question: string;
  answer: string;
  confidence: number;
  timestamp?: string;
  sources?: Array<{ id?: number; text?: string } | string>;
};

interface ChatBoxProps {
  restoredConversation?: ChatConversation | null;
}

export default function ChatBox({ restoredConversation }: ChatBoxProps) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [confidence, setConfidence] = useState<number>(0);

  useEffect(() => {
    if (!restoredConversation) return;

    setQuestion(restoredConversation.question);
    setAnswer(restoredConversation.answer);
    setSources(restoredConversation.sources ?? []);
    setConfidence(restoredConversation.confidence ?? 0);
    setLoading(false);
  }, [restoredConversation]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setSources([]);
    setConfidence(0);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/chat`,
        {
          question,
        }
      );

      setAnswer(response.data.answer);
      setSources(response.data.sources);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.log(error);
      alert("Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 shadow-lg shadow-emerald-500/10">
              <MessageSquare size={22} />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
                <WandSparkles size={12} />
                Main Workspace
              </div>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Ask Your Document
              </h2>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">
                Ask questions and get AI-powered answers grounded in your uploaded PDF.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
          <input
            type="text"
            placeholder="Ask anything about your document..."
            className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-base text-white shadow-inner shadow-black/20 transition-all duration-200 placeholder:text-slate-500 focus:border-emerald-400/40 focus:bg-slate-950/80 focus:outline-none focus:ring-4 focus:ring-emerald-400/10"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                askQuestion();
              }
            }}
            aria-label="Ask a question about the uploaded document"
          />

          <button
            onClick={askQuestion}
            disabled={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-4 font-medium text-white shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-emerald-500/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 ${
              loading
                ? "bg-emerald-700"
                : "bg-emerald-600 hover:bg-emerald-500"
            }`}
            aria-label="Submit question"
          >
            {loading ? (
              <>
                <Sparkles size={18} className="animate-pulse" />
                Thinking...
              </>
            ) : (
              <>
                <Send size={18} />
                Ask
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            "What is my CPI?",
            "What is my branch?",
            "Which projects have I built?",
            "Where do I study?",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => setQuestion(prompt)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-white"
            >
              {prompt}
            </button>
          ))}
        </div>

        {(loading || answer) && (
        <AnswerCard
          answer={answer}
          sources={sources}
          confidence={confidence}
          isLoading={loading}
        />
      )}
      </div>
    </section>
  );
}
