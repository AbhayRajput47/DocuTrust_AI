"use client";

import { useState } from "react";
import UploadBox from "@/components/UploadBox";
import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";
import AgentActivity from "@/components/AgentActivity";
import DocumentInfo from "@/components/DocumentInfo";
import ChatHistory from "@/components/ChatHistory";
import DashboardStats from "@/components/DashboardStats";
import { BrainCircuit, FileSearch, ShieldCheck, Sparkles } from "lucide-react";

export type ChatConversation = {
  question: string;
  answer: string;
  confidence: number;
  timestamp?: string;
  sources?: Array<{ id?: number; text?: string } | string>;
};
export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversation | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),transparent_35%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.16),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(3,7,18,1))]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1680px] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <div className="mb-6 rounded-[28px] border border-white/10 bg-white/5 px-5 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-6">
          <Navbar />

          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <Sparkles size={14} />
                Enterprise RAG Workspace
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  DocuTrust AI
                </h1>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  A premium document assistant for secure upload, grounded answers,
                  source validation, and live agent visibility.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30">
                <FileSearch className="text-cyan-300" size={20} />
                <p className="mt-3 text-sm font-medium text-white">Smart retrieval</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Semantic lookup across uploaded document chunks.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30">
                <BrainCircuit className="text-emerald-300" size={20} />
                <p className="mt-3 text-sm font-medium text-white">CRAG pipeline</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Retrieval, validation, and grounded generation in one flow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition-transform duration-300 hover:-translate-y-0.5 hover:border-sky-400/30">
                <ShieldCheck className="text-sky-300" size={20} />
                <p className="mt-3 text-sm font-medium text-white">Source traceability</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Citations, confidence, and agent logs stay visible.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DashboardStats refreshKey={refreshKey} />
        
        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)_300px]">
          <aside className="xl:sticky xl:top-6 xl:h-fit">
            <ChatHistory
             refreshKey={refreshKey}
              selectedConversation={selectedConversation}
              onSelectConversation={setSelectedConversation}
            />
          </aside>

          <section className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
              <div className="grid gap-6">
                <UploadBox onRefresh={() => setRefreshKey(prev => prev + 1)} />
                <DocumentInfo refreshKey={refreshKey} />
              </div>
            </div>

            <ChatBox restoredConversation={selectedConversation}
                      onRefresh={() => setRefreshKey(prev => prev + 1)} />
          </section>

          <aside className="xl:sticky xl:top-6 xl:h-fit">
            <AgentActivity refreshKey={refreshKey} />
          </aside>
        </div>
      </div>
    </main>
  );
}
