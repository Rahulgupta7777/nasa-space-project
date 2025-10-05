"use client";
import { useMemo, useState } from "react";

export default function EarthObservationPage() {
  const [centerLat, setCenterLat] = useState(0);
  const [centerLon, setCenterLon] = useState(0);
  const [radiusKm, setRadiusKm] = useState(50);
  const geojson = useMemo(() => {
    const kmToDeg = radiusKm / 111; // approx
    const minLat = centerLat - kmToDeg;
    const maxLat = centerLat + kmToDeg;
    const minLon = centerLon - kmToDeg;
    const maxLon = centerLon + kmToDeg;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "AOI" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [minLon, minLat],
              [maxLon, minLat],
              [maxLon, maxLat],
              [minLon, maxLat],
              [minLon, minLat],
            ]],
          },
        },
      ],
    };
  }, [centerLat, centerLon, radiusKm]);

  const downloadGeoJSON = () => {
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "aoi.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">Earth Observation & USGS</h1>
      <p className="mt-4 text-slate-300 max-w-3xl">
        Build an Area of Interest (AOI) and deep-link to USGS EarthExplorer to search imagery.
        Export your AOI as GeoJSON for upload in EarthExplorer or GIS tools.
      </p>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border border-slate-800/60 bg-[#0b0f14] p-6 lg:col-span-2">
          <div className="text-lg font-semibold text-slate-100">Define AOI (approximate)</div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="text-sm text-slate-400">
              Center Latitude
              <input type="number" value={centerLat} onChange={(e) => setCenterLat(parseFloat(e.target.value))} className="mt-1 w-full rounded border border-slate-700 bg-transparent px-3 py-2 text-slate-200" />
            </label>
            <label className="text-sm text-slate-400">
              Center Longitude
              <input type="number" value={centerLon} onChange={(e) => setCenterLon(parseFloat(e.target.value))} className="mt-1 w-full rounded border border-slate-700 bg-transparent px-3 py-2 text-slate-200" />
            </label>
            <label className="text-sm text-slate-400">
              Radius (km)
              <input type="number" value={radiusKm} onChange={(e) => setRadiusKm(parseFloat(e.target.value))} className="mt-1 w-full rounded border border-slate-700 bg-transparent px-3 py-2 text-slate-200" />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={downloadGeoJSON} className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Download AOI GeoJSON</button>
            <a href="https://earthexplorer.usgs.gov/" target="_blank" className="rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Open EarthExplorer</a>
          </div>
          <div className="mt-3 text-xs text-slate-500">Tip: In EarthExplorer, use the “Upload” tool to import your AOI GeoJSON or draw the polygon directly.</div>
        </div>
        <div className="rounded-lg border border-slate-800/60 bg-[#0b0f14] p-6">
          <div className="text-lg font-semibold text-slate-100">Canadian EO Industry</div>
          <p className="mt-2 text-sm text-slate-400">
            Earth observation provides strategic benefits across maritime surveillance, disaster management, and ecosystem monitoring.
            Explore RADARSAT, RCM, and international collaborations supporting operational imagery and scientific research in Canada.
          </p>
          <a href="https://ised-isde.canada.ca/site/canadian-space-industry/en/earth-observation" target="_blank" className="mt-3 inline-block rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Learn more</a>
        </div>
      </div>
      <div className="mt-10 rounded-lg border border-slate-800/60 bg-[#0b0f14] p-6">
        <div className="text-lg font-semibold text-slate-100">NASA Worldview</div>
        <p className="mt-2 text-sm text-slate-400">
          Use NASA Worldview for interactive browsing of global, full-resolution satellite imagery layers.
          In Spacia, toggle GIBS layers on the dashboard globe to mirror Worldview content.
        </p>
        <a href="https://worldview.earthdata.nasa.gov/" target="_blank" className="mt-3 inline-block rounded border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800">Open Worldview</a>
      </div>
    </div>
  );
}