export default function BusinessPage() {
  const offerings = [
    {
      title: "Orbit Monitoring",
      desc: "Realtime globe visualization, satellite tracking, and situational context for operations.",
    },
    {
      title: "Conjunction Intelligence",
      desc: "Proactive screening, thresholds, and action recommendations to reduce collision risk.",
    },
    {
      title: "Earth Observation Products",
      desc: "Curated imagery layers (NASA GIBS, VIIRS/MODIS) and AOI workflows for analytics.",
    },
    {
      title: "Integration & Support",
      desc: "API access, data pipelines, onboarding, and mission-tailored UX for your team.",
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Business</h1>
      <p className="mt-4 text-slate-300 max-w-3xl">
        AresMatrix LEO helps space operators visualize orbits, monitor conjunctions, and plan sustainable missions.
        Explore our offerings and get in touch to discuss a plan tailored to your operations.
      </p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offerings.map((o) => (
          <div key={o.title} className="rounded-lg border border-slate-800/60 glass-panel p-6">
            <div className="text-lg font-semibold text-slate-100">{o.title}</div>
            <div className="mt-2 text-sm text-slate-400">{o.desc}</div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Partner Ecosystem</h2>
        <p className="mt-2 text-slate-300 max-w-3xl">
          Examples of organizations operating in LEO you might consider partnering with, depending on mission fit and availability.
        </p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-lg border border-slate-800/60 glass-panel p-6">
            <div className="text-lg font-semibold text-slate-100">PNT / Navigation</div>
            <div className="mt-2 text-sm text-slate-400">Xona, Aerodome/VyomIC</div>
          </div>
          <div className="rounded-lg border border-slate-800/60 glass-panel p-6">
            <div className="text-lg font-semibold text-slate-100">Earth Observation</div>
            <div className="mt-2 text-sm text-slate-400">Planet, Pixxel, Satellogic, Umbra</div>
          </div>
          <div className="rounded-lg border border-slate-800/60 glass-panel p-6">
            <div className="text-lg font-semibold text-slate-100">Ground / Stations</div>
            <div className="mt-2 text-sm text-slate-400">KSAT, AWS Ground Station, Azure Space</div>
          </div>
          <div className="rounded-lg border border-slate-800/60 glass-panel p-6">
            <div className="text-lg font-semibold text-slate-100">Comms / Optical / RF</div>
            <div className="mt-2 text-sm text-slate-400">Mynaric, Viasat, Iridium</div>
          </div>
          <div className="rounded-lg border border-slate-800/60 glass-panel p-6">
            <div className="text-lg font-semibold text-slate-100">Launch / Rideshare</div>
            <div className="mt-2 text-sm text-slate-400">SpaceX Transporter, Rocket Lab</div>
          </div>
          <div className="rounded-lg border border-slate-800/60 glass-panel p-6">
            <div className="text-lg font-semibold text-slate-100">Analytics / Platforms</div>
            <div className="mt-2 text-sm text-slate-400">SkyServe, Orbital Insight</div>
          </div>
        </div>
        <p className="mt-4 text-xs text-slate-400">These are examples only; verify partnerships, regional constraints, and licensing for your mission.</p>
      </div>

      <div className="mt-10 rounded-xl border border-slate-800/60 bg-[#0b0f14] p-8 text-center">
        <h2 className="text-xl font-semibold">Work With Us</h2>
        <p className="mt-2 text-slate-300">
          Ready to explore AresMatrix LEO for your mission? We’d love to connect.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/dashboard" className="button-primary">View Dashboard</a>
          <a href="mailto:hello@example.com" className="button-secondary">Contact Us</a>
        </div>
      </div>
    </div>
  );
}