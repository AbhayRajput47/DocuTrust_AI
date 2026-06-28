"use client";

import { useEffect, useState } from "react";
import { Clock3, MessageSquareText } from "lucide-react";

type ChatConversation = {
  question: string;
  answer: string;
  confidence: number;
  timestamp?: string;
  sources?: Array<{ id?: number; text?: string } | string>;
};

interface ChatHistoryProps {
  selectedConversation: ChatConversation | null;
  onSelectConversation: (conversation: ChatConversation) => void;
}

export default function ChatHistory({
  selectedConversation,
  onSelectConversation,
}: ChatHistoryProps) {
  const [history, setHistory] = useState<ChatConversation[]>([]);

useEffect(() => {

  const fetchHistory = () => {

    fetch("http://127.0.0.1:8000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data));

  };

  fetchHistory(); // Initial load

  const interval = setInterval(
    fetchHistory,
    2000
  );

  return () => clearInterval(interval);

}, []);

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "Recent";

    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) return "Recent";

    const diff = Date.now() - parsed.getTime();
    const minutes = Math.max(1, Math.floor(diff / 60000));
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-400">
            <MessageSquareText size={12} />
            Session log
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            Chat History
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Click any question to restore that conversation.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {history.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/40 p-5 text-sm leading-6 text-slate-400">
            No chat history yet. Ask a question to create your first conversation.
          </div>
        )}

        {history.map((chat, index) => {
          const isActive =
            selectedConversation?.timestamp === chat.timestamp &&
            selectedConversation?.question === chat.question;

          return (
            <button
              key={`${chat.question}-${index}`}
              onClick={() => onSelectConversation(chat)}
              className={`group w-full rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/10 focus:outline-none focus:ring-4 focus:ring-emerald-400/15 ${
                isActive
                  ? "border-emerald-400/30 bg-emerald-400/10 shadow-lg shadow-emerald-500/10"
                  : "border-white/10 bg-slate-950/50"
              }`}
              aria-label={`Restore conversation for ${chat.question}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors duration-200 group-hover:text-white">
                  <MessageSquareText size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {chat.question}
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <Clock3 size={12} />
                    <span>{formatTimestamp(chat.timestamp)}</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}