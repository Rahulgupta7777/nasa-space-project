"use client";
import { useState } from "react";

export default function FeasibilityForm() {
  const [form, setForm] = useState({
    purpose: "",
    budget: "",
    altitude: "",
    payload: "",
    timeline: "",
    riskTolerance: "",
    model: "llama3",
  });
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult("");
    try {
      const res = await fetch("/api/feasibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.details || data?.error || "Request failed");
      setResult(data.result || "No response");
    } catch (err: any) {
      setError(String(err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800/60 bg-[#0b0f14] p-6">
        <h2 className="text-2xl font-bold">LEO Feasibility Advisor</h2>
        <p className="mt-2 text-slate-300 text-sm">Private analysis using your local model. Press Submit to generate a plan.</p>
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="text-sm">Mission Purpose
            <input className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" placeholder="Earth observation startup" value={form.purpose} onChange={(e)=>update("purpose", e.target.value)} />
          </label>
          <label className="text-sm">Budget ($M)
            <input className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" placeholder="25" value={form.budget} onChange={(e)=>update("budget", e.target.value)} />
          </label>
          <label className="text-sm">Orbit Altitude (km)
            <input className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" placeholder="550" value={form.altitude} onChange={(e)=>update("altitude", e.target.value)} />
          </label>
          <label className="text-sm">Payload Mass (kg)
            <input className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" placeholder="60" value={form.payload} onChange={(e)=>update("payload", e.target.value)} />
          </label>
          <label className="text-sm">Timeline (months)
            <input className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" placeholder="18" value={form.timeline} onChange={(e)=>update("timeline", e.target.value)} />
          </label>
          <label className="text-sm">Risk Tolerance
            <select className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.riskTolerance} onChange={(e)=>update("riskTolerance", e.target.value)}>
              <option value="">Select</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </label>
          <label className="text-sm">Model (optional)
            <input className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" placeholder="llama3" value={form.model} onChange={(e)=>update("model", e.target.value)} />
          </label>
          <div className="sm:col-span-2 mt-2">
            <button type="submit" className="button-primary" disabled={loading}>{loading ? "Analyzing…" : "Analyze"}</button>
          </div>
        </form>
        {error && <div className="mt-4 rounded border border-red-700 bg-red-900/30 p-3 text-sm">{error}</div>}
        {result && (
          <div className="mt-6 rounded-xl border border-slate-800/60 bg-black p-4 text-sm whitespace-pre-wrap">{result}</div>
        )}
      </div>
      <div className="mt-6 text-xs text-slate-400">
        Tip: Run a local model via Ollama. Default model is `llama3` — override above if desired. Examples of partners to consider include private PNT initiatives and GNSS augmentation.
      </div>
    </section>
  );
}