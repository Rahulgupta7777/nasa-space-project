"use client";
import { useState } from "react";
import { ClipboardList, DollarSign, Mountain, Package, Calendar, Shield, Cpu, Send, Bot, LoaderCircle } from "lucide-react";

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
          <label className="text-sm">
            <span className="flex items-center gap-2"><ClipboardList size={16} /> Mission Purpose</span>
            <div className="mt-1 flex items-center gap-2 rounded bg-slate-900/40 border border-slate-700 p-2">
              <input className="w-full bg-transparent outline-none" placeholder="Earth observation startup" value={form.purpose} onChange={(e)=>update("purpose", e.target.value)} />
            </div>
          </label>
          <label className="text-sm">
            <span className="flex items-center gap-2"><DollarSign size={16} /> Budget ($M)</span>
            <div className="mt-1 flex items-center gap-2 rounded bg-slate-900/40 border border-slate-700 p-2">
              <input className="w-full bg-transparent outline-none" placeholder="25" value={form.budget} onChange={(e)=>update("budget", e.target.value)} />
            </div>
          </label>
          <label className="text-sm">
            <span className="flex items-center gap-2"><Mountain size={16} /> Orbit Altitude (km)</span>
            <div className="mt-1 flex items-center gap-2 rounded bg-slate-900/40 border border-slate-700 p-2">
              <input className="w-full bg-transparent outline-none" placeholder="550" value={form.altitude} onChange={(e)=>update("altitude", e.target.value)} />
            </div>
          </label>
          <label className="text-sm">
            <span className="flex items-center gap-2"><Package size={16} /> Payload Mass (kg)</span>
            <div className="mt-1 flex items-center gap-2 rounded bg-slate-900/40 border border-slate-700 p-2">
              <input className="w-full bg-transparent outline-none" placeholder="60" value={form.payload} onChange={(e)=>update("payload", e.target.value)} />
            </div>
          </label>
          <label className="text-sm">
            <span className="flex items-center gap-2"><Calendar size={16} /> Timeline (months)</span>
            <div className="mt-1 flex items-center gap-2 rounded bg-slate-900/40 border border-slate-700 p-2">
              <input className="w-full bg-transparent outline-none" placeholder="18" value={form.timeline} onChange={(e)=>update("timeline", e.target.value)} />
            </div>
          </label>
          <label className="text-sm">
            <span className="flex items-center gap-2"><Shield size={16} /> Risk Tolerance</span>
            <select className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.riskTolerance} onChange={(e)=>update("riskTolerance", e.target.value)}>
              <option value="">Select</option>
              <option>Low</option>
              <option>Moderate</option>
              <option>High</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="flex items-center gap-2"><Cpu size={16} /> Model (optional)</span>
            <div className="mt-1 flex items-center gap-2 rounded bg-slate-900/40 border border-slate-700 p-2">
              <input className="w-full bg-transparent outline-none" placeholder="llama3" value={form.model} onChange={(e)=>update("model", e.target.value)} />
            </div>
          </label>
          <div className="sm:col-span-2 mt-2">
            <button type="submit" className="button-primary inline-flex items-center gap-2" disabled={loading}>
              {loading ? (<><LoaderCircle size={16} className="animate-spin" /> Analyzing…</>) : (<><Send size={16} /> Analyze</>)}
            </button>
          </div>
        </form>
        {error && <div className="mt-4 rounded border border-red-700 bg-red-900/30 p-3 text-sm">{error}</div>}
        {result && (
          <div className="mt-6">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-slate-800/60 p-2">
                <Bot size={18} className="text-slate-200" />
              </div>
              <div className="rounded-2xl border border-slate-800/60 bg-black p-4 text-sm whitespace-pre-wrap max-w-[42rem]">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 text-xs text-slate-400">
        Tip: Run a local model via Ollama. Default model is `llama3` — override above if desired. Examples of partners to consider include private PNT initiatives and GNSS augmentation.
      </div>
    </section>
  );
}