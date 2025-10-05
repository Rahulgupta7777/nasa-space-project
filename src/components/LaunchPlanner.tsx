"use client";
import { useState } from "react";

type PlannerRequest = {
  siteLat: number;
  siteLon: number;
  altitudeKm: number;
  inclinationDeg: number;
  massKg: number;
  areaM2: number;
};

type PlannerResponse = {
  recommendedSite: { name: string; lat: number; lon: number };
  debrisRisk: { score: number; level: "low" | "moderate" | "high"; notes: string[] };
  lifetimeYears: { min: number; max: number; complies25yrRule: boolean };
  recommendations: string[];
};

export default function LaunchPlanner() {
  const [form, setForm] = useState<PlannerRequest>({
    siteLat: 28.573255, // KSC default
    siteLon: -80.646895,
    altitudeKm: 500,
    inclinationDeg: 53,
    massKg: 200,
    areaM2: 0.5,
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlannerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof PlannerRequest, value: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as PlannerResponse;
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold">Launch Planner</h1>
      <p className="mt-2 text-slate-300">Plan a responsible LEO mission: estimate lifetime, assess debris risk, and get site suggestions.</p>

      <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-lg border border-slate-800/60 p-5">
          <div className="text-lg font-semibold mb-4">Launch Site</div>
          <label className="block text-sm mb-2">Latitude (deg)
            <input type="number" step="0.0001" className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.siteLat} onChange={(e) => update("siteLat", parseFloat(e.target.value))} />
          </label>
          <label className="block text-sm mb-2">Longitude (deg)
            <input type="number" step="0.0001" className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.siteLon} onChange={(e) => update("siteLon", parseFloat(e.target.value))} />
          </label>
        </div>

        <div className="glass-panel rounded-lg border border-slate-800/60 p-5">
          <div className="text-lg font-semibold mb-4">Orbit</div>
          <label className="block text-sm mb-2">Altitude (km)
            <input type="number" min={160} max={1200} className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.altitudeKm} onChange={(e) => update("altitudeKm", parseFloat(e.target.value))} />
          </label>
          <label className="block text-sm mb-2">Inclination (deg)
            <input type="number" min={0} max={180} className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.inclinationDeg} onChange={(e) => update("inclinationDeg", parseFloat(e.target.value))} />
          </label>
        </div>

        <div className="glass-panel rounded-lg border border-slate-800/60 p-5">
          <div className="text-lg font-semibold mb-4">Spacecraft</div>
          <label className="block text-sm mb-2">Mass (kg)
            <input type="number" min={1} className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.massKg} onChange={(e) => update("massKg", parseFloat(e.target.value))} />
          </label>
          <label className="block text-sm mb-2">Cross-section Area (m²)
            <input type="number" step="0.01" min={0.01} className="mt-1 w-full rounded bg-slate-900/40 border border-slate-700 p-2" value={form.areaM2} onChange={(e) => update("areaM2", parseFloat(e.target.value))} />
          </label>
        </div>

        <div className="rounded-lg border border-slate-800/60 p-5 flex items-end justify-start">
          <button type="submit" disabled={loading} className="button-primary">
            {loading ? "Calculating…" : "Calculate Plan"}
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-6 text-red-400">{error}</div>
      )}

      {result && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg border border-slate-800/60 p-5">
            <div className="text-lg font-semibold">Recommended Site</div>
            <div className="mt-2 text-slate-300">{result.recommendedSite.name}</div>
            <div className="text-sm text-slate-400">Lat {result.recommendedSite.lat.toFixed(4)}, Lon {result.recommendedSite.lon.toFixed(4)}</div>
          </div>
          <div className="rounded-lg border border-slate-800/60 p-5">
            <div className="text-lg font-semibold">Debris Risk</div>
            <div className="mt-2 text-slate-300 capitalize">{result.debrisRisk.level} ({result.debrisRisk.score.toFixed(1)}/10)</div>
            <ul className="mt-2 text-sm text-slate-400 list-disc list-inside">
              {result.debrisRisk.notes.map((n) => (<li key={n}>{n}</li>))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-800/60 p-5">
            <div className="text-lg font-semibold">Estimated Lifetime</div>
            <div className="mt-2 text-slate-300">{result.lifetimeYears.min.toFixed(1)}–{result.lifetimeYears.max.toFixed(1)} years</div>
            <div className="text-sm text-slate-400">25-year rule: {result.lifetimeYears.complies25yrRule ? "Compliant" : "Non-compliant"}</div>
          </div>

          <div className="md:col-span-3 rounded-lg border border-slate-800/60 p-5">
            <div className="text-lg font-semibold">Recommendations</div>
            <ul className="mt-2 text-sm text-slate-300 list-disc list-inside">
              {result.recommendations.map((r) => (<li key={r}>{r}</li>))}
            </ul>
            <div className="mt-4 text-xs text-slate-500">Note: Estimates are approximate and depend on solar activity, atmospheric models, and updated debris catalogs. Integrate authoritative catalogs (e.g., CelesTrak/Space-Track) for operational use.</div>
          </div>
        </div>
      )}
    </section>
  );
}