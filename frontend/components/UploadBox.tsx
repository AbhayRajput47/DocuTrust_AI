"use client";

import { useState } from "react";
import axios from "axios";
import { FileUp, FileText, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

export default function UploadBox() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
    if (!file) return;

    setLoading(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        formData,
        {
          onUploadProgress: (event) => {
            if (!event.total) return;
            setProgress(Math.round((event.loaded * 100) / event.total));
          },
        }
      );

      setUploaded(true);
      setProgress(100);
    } catch (error) {
      console.log(error);
      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

const shortenFilename = (filename: string) => {

  if (!filename) return "";

  if (filename.length <= 35) return filename;

  const dot = filename.lastIndexOf(".");
  const extension = dot !== -1 ? filename.substring(dot) : "";

  return filename.substring(0, 25) + "..." + extension;
};

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 shadow-[0_24px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/20">
            <FileText size={20} />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-300/70">Upload</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Add your PDF</h2>
            <p className="mt-1 text-sm text-slate-300/80">Drag, drop, and ask questions in seconds.</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <label className="group flex min-h-[190px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-white/15 bg-slate-950/50 px-6 py-8 text-center transition duration-200 hover:-translate-y-0.5 hover:border-sky-400/40 hover:bg-slate-950/70">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/20 transition duration-200 group-hover:scale-105">
            <FileUp size={30} />
          </div>

          <p className="mt-4 text-lg font-semibold text-white">Drag & drop your PDF here</p>
          <p className="mt-1 text-sm text-slate-400">or click to browse your files</p>

          {file ? (
            <div className="mt-5 flex flex-col items-center gap-2">
              <p className="max-w-full truncate rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm font-medium text-emerald-200">
                {shortenFilename(file.name)}
              </p>

              {uploaded && (
                <div className="flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 size={16} />
                  Uploaded successfully
                </div>
              )}
            </div>
          ) : (
            <p className="mt-5 text-xs uppercase tracking-[0.28em] text-slate-500">PDF only</p>
          )}

          <input
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setUploaded(false);
              setProgress(0);
            }}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-200 hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ShieldCheck size={18} />
              Upload PDF
            </>
          )}
        </button>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
