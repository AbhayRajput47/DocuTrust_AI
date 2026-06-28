"use client";

import { useState } from "react";
import { Bot, ChevronDown, ChevronUp, Copy, FileText, ShieldCheck } from "lucide-react";

interface Source {
  id: number;
  text: string;
  page?: number;
}

interface AnswerCardProps {
  answer: string;
  sources: Array<string | Source>;
  confidence: number;
  isLoading?: boolean;
}

export default function AnswerCard({
  answer,
  sources,
  confidence,
  isLoading,
}: AnswerCardProps) {
  const [expandedSources, setExpandedSources] = useState<number[]>([]);

  const copyAnswer = () => {
    if (!answer) return;

    navigator.clipboard.writeText(answer);
    alert("Answer copied!");
  };

  const copySource = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Source copied!");
  };

  const normalizedSources = sources.map((source, index) => {
    if (typeof source === "string") {
      return { id: index + 1, text: source, page: undefined };
    }

    return {
      id: source.id ?? index + 1,
      text: source.text,
      page: source.page,
    };
  });

  return (
    <div className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
            <Bot size={22} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-emerald-300/70">
              AI Answer
            </p>
            <h2 className="mt-1 text-xl font-semibold text-white">
              AI Answer
            </h2>
            <p className="text-sm text-slate-400">Generated from your document</p>
          </div>
        </div>

        <button
          onClick={copyAnswer}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:bg-cyan-400/10"
        >
          <Copy size={16} />
          Copy Answer
        </button>
      </div>

      {isLoading && !answer ? (
        <div className="space-y-4">
          <div className="h-28 rounded-2xl bg-slate-950/60 p-4">
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/10" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/10" />
              <div className="h-3 w-4/6 animate-pulse rounded-full bg-white/10" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="h-20 animate-pulse rounded-2xl bg-slate-950/60" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-950/60" />
            <div className="h-20 animate-pulse rounded-2xl bg-slate-950/60" />
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-5">
            <p className="whitespace-pre-line text-sm leading-7 text-slate-100 sm:text-base">
              {answer}
            </p>
          </div>

          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-emerald-300" />
                <span className="font-semibold text-white">Confidence Score</span>
              </div>

              <span className="font-bold text-emerald-300">{confidence}%</span>
            </div>

            <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400 transition-all duration-700"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {normalizedSources.length > 0 && (
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-white">
                <FileText size={18} className="text-cyan-300" />
                Sources
              </h3>

              <div className="space-y-3">
                {normalizedSources.map((source, index) => {
                  const isExpanded = expandedSources.includes(index);

                  return (
                    <div
                      key={source.id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/50"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedSources((current) =>
                            current.includes(index)
                              ? current.filter((item) => item !== index)
                              : [...current, index]
                          )
                        }
                        className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-white/5"
                      >
                        <div>
                          {/* <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300"> */}
                            {/* Source {source.id} */}
                            {/* Source {source.id} • Page {source.page} */}
                            <div className="flex items-center justify-between gap-2">

                            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                              Source {source.id}
                            </span>

                            {source.page && (
                              <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs text-cyan-300">
                                📄 Page {source.page}
                              </span>
                            )}

                          </div>
                          {/* </p> */}
                          <p className="mt-1 text-sm text-slate-300 line-clamp-2">
                            {source.text}
                          </p>
                        </div>

                        {isExpanded ? (
                          <ChevronUp size={15} className="text-slate-400" />
                        ) : (
                          <ChevronDown size={15} className="text-slate-400" />
                        )}
                      </button>

                      {isExpanded && (
                      <div className="border-t border-white/10 bg-slate-950/60 px-4 py-4">

                        <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                          {source.text}
                        </p>

                        <div className="mt-1 flex justify-end">
                          <button
                            onClick={() => copySource(source.text)}
                            className="flex items-center gap-2  rounded-lg bg-cyan-100/10 px-3 py-2 text-cyan-300 hover:bg-cyan-500/20"
                          >
                            <Copy size={12} />
                            Copy Chunk
                          </button>
                        </div>

                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
