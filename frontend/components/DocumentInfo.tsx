"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Hash, Layers3, BadgeCheck } from "lucide-react";

export default function DocumentInfo({ refreshDoc }: { refreshDoc: boolean }) {

  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {

        const fetchDocument = () => {

            axios
            .get("http://127.0.0.1:8000/documents")
            .then((res) => {

                if (res.data.length > 0) {
                setDoc(res.data[0]);
                }

            })
            .catch(console.error);

        };

        fetchDocument();

        const interval = setInterval(
            fetchDocument,
            2000
        );

        return () => clearInterval(interval);

        }, [refreshDoc]);

  if (!doc) return null;

  const stats = [
    { label: "Filename", value: doc.filename, icon: FileText },
    { label: "Characters", value: doc.characters, icon: Hash },
    { label: "Chunks", value: doc.chunks, icon: Layers3 },
    { label: "Status", value: "Indexed", icon: BadgeCheck },
  ];

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-violet-300/70">Data Profile</p>
          <h2 className="mt-1 text-lg font-semibold text-white">Document Information</h2>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 transition duration-200 hover:-translate-y-0.5 hover:bg-slate-950/70"
          >
            <div className="flex items-center justify-between gap-3 text-slate-300">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <stat.icon size={15} className="text-violet-300" />
            </div>
            <p className="mt-3 break-words text-sm font-semibold text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}