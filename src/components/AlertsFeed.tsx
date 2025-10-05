"use client";
import { useEffect, useState } from "react";

type AlertItem = { a: string; b: string; distance_km: number };

export default function AlertsFeed() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshMs] = useState(30000); // auto-refresh every 30s

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/alerts");
      const json = await res.json();
      setAlerts(json.alerts || []);
      setError(null);
    } catch (e) {
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    const id = setInterval(loadAlerts, refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);

  return (
    <div className="rounded-lg border border-slate-800/60 bg-[#0b0f14] p-6">
      <div className="text-lg font-semibold text-slate-100">Conjunction Alerts</div>
      <div className="mt-2 text-sm text-slate-400">Threshold: distance &lt; 10 km</div>
      {loading && <div className="mt-4 text-sm text-slate-300">Computing alerts…</div>}
      {error && <div className="mt-4 text-sm text-red-400">{error}</div>}
      {!loading && !error && (
        <div className="mt-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-sm text-slate-500">No close approaches detected in sample set.</div>
          ) : (
            alerts.slice(0, 10).map((al, idx) => (
              <div key={idx} className="flex items-center justify-between rounded border border-slate-800 px-3 py-2">
                <div className="text-sm text-slate-200">{al.a} ↔ {al.b}</div>
                <div className="text-xs text-slate-400">{al.distance_km} km</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}