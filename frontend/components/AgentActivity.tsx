"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Activity, CheckCheck } from "lucide-react";


interface Log {
  event: string;
  timestamp: string;
}

export default function AgentActivity() {

  const [logs, setLogs] = useState<Log[]>([]);

  const fetchLogs = async () => {

    try {

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/logs`
      );

      setLogs(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {

    fetchLogs();

    const interval = setInterval(
      fetchLogs,
      3000
    );

    return () => clearInterval(interval);

  }, []);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-amber-300/70">
            Live Pipeline
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Agent Activity
          </h2>
        </div>

        <Activity className="text-amber-300/80" size={20} />
      </div>

      <div className="space-y-3">
        {logs.map((log, index) => (
          <div key={index} className="relative pl-8">
            <span className="absolute left-0 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
              <CheckCheck size={12} />
            </span>
            {index !== logs.length - 1 && (
              <span className="absolute left-[9px] top-6 h-full w-px bg-gradient-to-b from-emerald-400/40 to-transparent" />
            )}

            <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-950/70">
              <p className="text-sm font-medium text-white">{log.event}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}