"use client";

import { useState } from "react";
import ResultCard from "@/components/result-card";
import UploadCard from "@/components/upload-card";

type AnalysisResult = {
  overallScore: number;
  hierarchy: string[];
  accessibility: string[];
  uxIssues: string[];
  suggestions: string[];
};

const emptyResult: AnalysisResult = {
  overallScore: 0,
  hierarchy: [],
  accessibility: [],
  uxIssues: [],
  suggestions: [],
};

export default function Home() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult>(emptyResult);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);
  const [platform, setPlatform] = useState("Web");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleFileSelected = (file: File) => {
    setError(null);
    setHasResult(false);
    setResult(emptyResult);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });

  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setError(null);
    setIsLoading(true);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ""));
        reader.onerror = () => reject(new Error("Failed to read file."));
        reader.readAsDataURL(selectedFile);
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          mimeType: selectedFile.type || "image/png",
          platform,
          prompt: customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the screenshot.");
      }

      const payload = await response.json();
      setResult(payload.data as AnalysisResult);
      setHasResult(true);
    } catch (err) {
      setError("Sorry, we could not analyze that screenshot.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-zinc-100">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-800">
          DesignSense AI
        </div>
        <button className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-700 transition hover:border-blue-300 hover:text-blue-600">
          MVP
        </button>
      </nav>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 pb-20">
        <section className="grid gap-6 rounded-3xl bg-white/80 p-8 shadow-sm backdrop-blur md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600">
              AI design review
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
              Instant usability & accessibility feedback for your UI.
            </h1>
            <p className="text-sm leading-6 text-zinc-600">
              Upload a screenshot and get structured feedback on hierarchy,
              spacing, accessibility, CTA clarity, and UX issues.
            </p>
          </div>
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Workflow
            </p>
            <ol className="text-sm text-zinc-600">
              <li>1. Upload your UI screenshot</li>
              <li>2. Select platform + focus</li>
              <li>3. AI analyzes the design</li>
              <li>4. Get structured insights</li>
            </ol>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1fr_1fr]">
          <div className="flex flex-col gap-4">
            <UploadCard
              onFileSelected={handleFileSelected}
              disabled={isLoading}
              helperText={
                isLoading ? "Analyzing your interface…" : undefined
              }
            />
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Setup
              </div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Select platform
              </label>
              <select
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
              >
                <option value="Web">Web</option>
                <option value="Mobile">Mobile</option>
                <option value="Dashboard">Dashboard</option>
              </select>
              <label className="mt-4 block text-sm font-semibold text-zinc-800">
                Optional prompt
              </label>
              <textarea
                value={customPrompt}
                onChange={(event) => setCustomPrompt(event.target.value)}
                placeholder='"What feedback do you want?"'
                className="mt-2 min-h-[90px] w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700"
              />
              <button
                onClick={handleAnalyze}
                disabled={!selectedFile || isLoading}
                className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Analyze screenshot
              </button>
            </div>
            {isLoading ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-4 text-sm text-blue-700">
                Analyzing your interface…
              </div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-4 text-sm text-rose-700">
                {error}
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Preview
            </div>
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Uploaded UI preview"
                className="h-[360px] w-full rounded-xl object-contain bg-zinc-50"
              />
            ) : (
              <div className="flex h-[360px] items-center justify-center rounded-xl bg-zinc-50 text-sm text-zinc-400">
                Upload a screenshot to see preview
              </div>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">
              Analysis Results
            </h2>
            {hasResult ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                AI Generated
              </span>
            ) : null}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              Overall Score
            </p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-semibold text-zinc-900">
                {result.overallScore || "—"}
              </span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ResultCard
              title="Visual Hierarchy"
              items={result.hierarchy}
              variant="check"
            />
            <ResultCard
              title="Accessibility"
              items={result.accessibility}
              variant="cross"
              emptyMessage="We will flag contrast and readability issues here."
            />
            <ResultCard
              title="UX Issues"
              items={result.uxIssues}
              variant="cross"
              emptyMessage="We will summarize usability blockers here."
            />
            <ResultCard
              title="Suggestions"
              items={result.suggestions}
              variant="bullet"
              emptyMessage="We will suggest improvements here."
            />
          </div>
        </section>
      </main>
    </div>
  );
}
