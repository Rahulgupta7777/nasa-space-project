export default function DataResourcesPage() {
  const items = [
    {
      title: "NASA Open Data Portal",
      href: "https://data.nasa.gov/",
      desc: "Browse thousands of public datasets spanning Earth science, space exploration, aeronautics, and more.",
    },
    {
      title: "Featured: Earth Science Collections",
      href: "https://data.nasa.gov/browse?category=Earth+Science",
      desc: "Climate, atmosphere, cryosphere, and geospatial datasets suitable for analytics and visualization.",
    },
    {
      title: "Publishing Service",
      href: "https://data.nasa.gov/",
      desc: "NASA’s cloud-backed publishing service for open datasets, governance, and DOI minting.",
    },
  ];
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">NASA Open Data</h1>
      <p className="mt-4 text-slate-300 max-w-3xl">
        NASA’s public data catalog hosts diverse datasets and metadata. Use these datasets for research,
        analytics, and educational uses. Most dataset pages provide metadata and external links to actual data hosts.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <a key={it.href} href={it.href} target="_blank" className="rounded-lg border border-slate-800/60 bg-[#0b0f14] p-6 hover:border-slate-700">
            <div className="text-lg font-semibold text-slate-100">{it.title}</div>
            <div className="mt-2 text-sm text-slate-400">{it.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}