export default function ResourcesPage() {
  const cards = [
    {
      href: "/resources/data",
      title: "NASA Open Data",
      desc: "Explore NASA’s public datasets: Earth science, aeronautics, missions, and more.",
    },
    {
      href: "/resources/debris",
      title: "Orbital Debris (ODPO)",
      desc: "Learn about ORDEM, LEGEND, and DAS models for debris environment and assessments.",
    },
    {
      href: "/resources/earth-observation",
      title: "Earth Observation / USGS",
      desc: "Discover EO capabilities and build AOIs to search imagery via EarthExplorer.",
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Resources</h1>
      <p className="mt-4 text-slate-300 max-w-3xl">
        Curated links and tools to help you access NASA datasets, understand orbital debris models,
        and search Earth observation imagery from USGS and partners.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c) => (
          <a key={c.href} href={c.href} className="rounded-lg border border-slate-800/60 bg-[#0b0f14] p-6 hover:border-slate-700">
            <div className="text-lg font-semibold text-slate-100">{c.title}</div>
            <div className="mt-2 text-sm text-slate-400">{c.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}