export default function DebrisResourcesPage() {
  const items = [
    {
      title: "ODPO — Orbital Debris Program Office",
      href: "https://orbitaldebris.jsc.nasa.gov/",
      desc: "NASA’s lead office for measuring and modeling the orbital debris environment.",
    },
    {
      title: "ORDEM 3.2",
      href: "https://orbitaldebris.jsc.nasa.gov/",
      desc: "Engineering model for debris environment estimates used in design and risk analysis.",
    },
    {
      title: "LEGEND",
      href: "https://orbitaldebris.jsc.nasa.gov/",
      desc: "Debris evolutionary model for long-term environment projection and mitigation studies.",
    },
    {
      title: "DAS 3.2",
      href: "https://orbitaldebris.jsc.nasa.gov/",
      desc: "Debris Assessment Software to evaluate mission compliance and risk impacts.",
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Orbital Debris Models</h1>
      <p className="mt-4 text-slate-300 max-w-3xl">
        The NASA Orbital Debris Program Office develops models and tools that quantify debris environments
        and support mitigation strategies. Use these resources to inform collision risk, design choices,
        and sustainability practices.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <a key={it.title} href={it.href} target="_blank" className="rounded-lg border border-slate-800/60 bg-[#0b0f14] p-6 hover:border-slate-700">
            <div className="text-lg font-semibold text-slate-100">{it.title}</div>
            <div className="mt-2 text-sm text-slate-400">{it.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}