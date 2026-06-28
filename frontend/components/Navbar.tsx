import { ShieldCheck, Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 px-5 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
          <ShieldCheck size={22} />
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">
            DocuTrust AI
          </p>
          <h1 className="text-2xl font-semibold text-white">
            Enterprise document assistant
          </h1>
        </div>
      </div>

      <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-300 sm:self-auto">
        <Sparkles size={14} className="text-emerald-300" />
        RAG Powered Workspace
      </div>
    </nav>
  );
}