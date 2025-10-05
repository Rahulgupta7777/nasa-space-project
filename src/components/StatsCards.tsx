export default function StatsCards() {
  const cards = [
    { title: "Debris Risk Index", value: "0.84", desc: "Scaled 0–1 risk score from tracked conjunctions" },
    { title: "Sustainability Metric", value: "72", desc: "LEO sustainability score based on avoidance efficiency" },
    { title: "Active Avoidance Maneuvers", value: "12", desc: "Past 24h maneuvers executed across fleet" },
    { title: "Predicted Conjunctions (7d)", value: "58", desc: "Forecasted close approaches in next 7 days" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.title} className="rounded-lg border border-slate-800/60 bg-[#0b0f14] p-5">
          <div className="text-sm text-slate-400">{c.title}</div>
          <div className="mt-2 text-2xl font-bold text-slate-100">{c.value}</div>
          <div className="mt-1 text-xs text-slate-500">{c.desc}</div>
        </div>
      ))}
    </div>
  );
}