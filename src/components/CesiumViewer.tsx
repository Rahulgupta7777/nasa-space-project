"use client";
import { useEffect, useRef, useState } from "react";

export default function CesiumViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [layer, setLayer] = useState<
    "MODIS_Terra_CorrectedReflectance_TrueColor" |
    "VIIRS_SNPP_CorrectedReflectance_TrueColor" |
    "MODIS_Terra_CorrectedReflectance_Bands367"
  >("MODIS_Terra_CorrectedReflectance_TrueColor");
  const viewerRef = useRef<any>(null);
  const cesiumRef = useRef<any>(null);
  const [satCount, setSatCount] = useState(5);

  // Render a few sample orbits and current positions
  const renderSampleOrbits = async (count: number) => {
    try {
      const v = viewerRef.current;
      const Cesium = cesiumRef.current;
      if (!v || !Cesium) return;
      const res = await fetch("/api/tle");
      const json = await res.json();
      const sats = (json.satellites || []).slice(0, count);
      const satellite = await import("satellite.js");
      const now = new Date();
      const positionsBySat: Array<{ name: string; positions: any[]; current?: any }> = [];
      for (const s of sats) {
        const satrec = satellite.twoline2satrec(s.line1, s.line2);
        const positions: any[] = [];
        for (let t = 0; t <= 60; t += 2) {
          const when = new Date(now.getTime() + t * 60 * 1000);
          const pv = satellite.propagate(satrec, when);
          if (!pv || !pv.position) continue;
          const gmst = satellite.gstime(when);
          const geo = satellite.eciToGeodetic(pv.position, gmst);
          const lon = satellite.degreesLong(geo.longitude);
          const lat = satellite.degreesLat(geo.latitude);
          const alt = geo.height * 1000; // meters
          positions.push(Cesium.Cartesian3.fromDegrees(lon, lat, alt));
          if (t === 0) {
            positionsBySat.push({ name: s.name, positions, current: { lon, lat, alt } });
          }
        }
        // Create polyline entity
        v.entities.add({
          name: s.name,
          polyline: {
            positions,
            width: 1.5,
            material: Cesium.Color.CYAN.withAlpha(0.7),
          },
        });
      }
      // Current position billboards
      for (const item of positionsBySat) {
        const p = item.current!;
        v.entities.add({
          position: Cesium.Cartesian3.fromDegrees(p.lon, p.lat, p.alt),
          point: { pixelSize: 6, color: Cesium.Color.WHITE },
          label: { text: item.name, font: "12px sans-serif", fillColor: Cesium.Color.SLATEGRAY, pixelOffset: new Cesium.Cartesian2(0, -18) },
        });
      }
      v.scene.requestRender?.();
    } catch (e) {
      console.warn("Failed to render sample orbits:", e);
    }
  };

  useEffect(() => {
    let viewer: any;
    let destroyed = false;
    (async () => {
      const Cesium = await import("cesium");
      // Point Cesium to static assets served from public/cesium
      (window as any).CESIUM_BASE_URL = "/cesium";
      // Configure Cesium Ion token if available (NEXT_PUBLIC_CESIUM_ION_TOKEN)
      try {
        const token = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN as string | undefined;
        if (token && token.length > 0) {
          (Cesium as any).Ion.defaultAccessToken = token;
        } else {
          // Explicitly clear default token to suppress Cesium Ion warning overlay
          (Cesium as any).Ion.defaultAccessToken = "";
        }
      } catch {}
      cesiumRef.current = Cesium;

      if (!containerRef.current) return;
      viewer = new Cesium.Viewer(containerRef.current, {
        baseLayerPicker: false,
        animation: false,
        timeline: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        fullscreenButton: false,
      });
      viewerRef.current = viewer;

      // Tune camera controls for smoother zoom/pan experience
      try {
        const ctrl = viewer.scene.screenSpaceCameraController;
        ctrl.inertiaSpin = 0.6;
        ctrl.inertiaTranslate = 0.6;
        ctrl.inertiaZoom = 0.6;
        ctrl.minimumZoomDistance = 100000; // ~100 km
        ctrl.maximumZoomDistance = 30000000; // ~30,000 km
        // Enable FXAA for better visual quality
        if (viewer.scene?.postProcessStages?.fxaa) {
          viewer.scene.postProcessStages.fxaa.enabled = true;
        }
      } catch {}

      // Replace base imagery with Cesium World Imagery (neutral, data-centric)
      try {
        let baseProvider: any = null;
        const envToken = process.env.NEXT_PUBLIC_CESIUM_ION_TOKEN as string | undefined;
        if (envToken && envToken.length > 0) {
          baseProvider = await Cesium.createWorldImageryAsync({
            style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,
          });
        } else {
          // Fallback to OpenStreetMap if Ion token is missing
          baseProvider = new Cesium.OpenStreetMapImageryProvider({ url: "https://a.tile.openstreetmap.org/" });
        }
        if (baseProvider) {
          viewer.imageryLayers.removeAll();
          viewer.imageryLayers.addImageryProvider(baseProvider);
        }
      } catch (e) {
        console.warn("World imagery failed to load:", e);
        // Final fallback: keep any existing base and proceed
      }

      // NASA GIBS overlay using WMS world snapshot (reliable preview)
      const addGibs = (layerName: string) => {
        try {
          const dateStr = new Date().toISOString().slice(0, 10);
          const src = `/api/gibs?wms=1&layer=${encodeURIComponent(layerName)}&time=${encodeURIComponent(dateStr)}&width=2048&height=1024`;
          const provider = new Cesium.SingleTileImageryProvider({
            url: src,
            rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
          });
          viewer.imageryLayers.addImageryProvider(provider);
          viewer.scene.requestRender?.();
        } catch (e) {
          console.warn("GIBS WMS overlay failed to load:", e);
        }
      };
      addGibs(layer);

      await renderSampleOrbits(satCount);
      setLoading(false);
    })();

    return () => {
      destroyed = true;
      try {
        viewer && viewer.destroy && viewer.destroy();
      } catch {}
    };
  }, []);

  // Re-render sample orbits when count changes
  useEffect(() => {
    const v = viewerRef.current;
    if (!v) return;
    try {
      v.entities.removeAll();
    } catch {}
    (async () => {
      await renderSampleOrbits(satCount);
    })();
  }, [satCount]);

  // Keyboard toggle for full-screen: 'f' to toggle, 'Escape' to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        setExpanded((prev) => !prev);
        try { window.dispatchEvent(new Event("resize")); } catch {}
      } else if (e.key === "Escape") {
        setExpanded(false);
        try { window.dispatchEvent(new Event("resize")); } catch {}
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className={`${expanded ? "fixed inset-0 z-50" : "relative"} w-full ${expanded ? "h-screen" : "h-[70vh] min-h-[480px]"} rounded-lg border border-slate-800/60 bg-black`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
          <div className="rounded-md border border-slate-800 bg-[#0b0f14] px-4 py-3 text-sm text-slate-300">
            Initializing Cesium and imagery layers…
          </div>
        </div>
      )}
      <div className="absolute right-3 top-3 z-20 rounded-md border border-slate-800 bg-[#0b0f14] px-3 py-2 text-xs text-slate-300">
        <div className="mb-2 flex justify-end">
          <button
            onClick={() => { setExpanded((e) => !e); try { window.dispatchEvent(new Event("resize")); } catch {} }}
            className="rounded border border-slate-700 px-2 py-1 hover:bg-slate-800"
          >
            {expanded ? "Close" : "Expand"}
          </button>
        </div>
        <div className="mb-1">NASA GIBS layer</div>
        <div className="flex flex-wrap gap-2">
          {[
            { name: "MODIS TrueColor", id: "MODIS_Terra_CorrectedReflectance_TrueColor" },
            { name: "VIIRS TrueColor", id: "VIIRS_SNPP_CorrectedReflectance_TrueColor" },
            { name: "MODIS Bands 3-6-7", id: "MODIS_Terra_CorrectedReflectance_Bands367" },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => {
                setLayer(opt.id as any);
                try {
                  const v = viewerRef.current;
                  if (!v) return;
                  const Cesium = cesiumRef.current;
                  if (!Cesium) return;
                  // Remove overlays (keep base at index 0)
                  while (v.imageryLayers.length > 1) {
                    v.imageryLayers.remove(v.imageryLayers.get(v.imageryLayers.length - 1), true);
                  }
                  const dateStr = new Date().toISOString().slice(0, 10);
                  const src = `/api/gibs?wms=1&layer=${encodeURIComponent(opt.id)}&time=${encodeURIComponent(dateStr)}&width=2048&height=1024`;
                  const provider = new Cesium.SingleTileImageryProvider({
                    url: src,
                    rectangle: Cesium.Rectangle.fromDegrees(-180, -90, 180, 90),
                  });
                  v.imageryLayers.addImageryProvider(provider);
                  v.scene.requestRender?.();
                } catch (e) {
                  console.warn("Failed to switch GIBS layer:", e);
                }
              }}
              className={`rounded px-2 py-1 border ${layer === opt.id ? "bg-slate-700 text-white" : "border-slate-700 hover:bg-slate-800"}`}
            >
              {opt.name}
            </button>
          ))}
        </div>
        <div className="mt-2">Sample satellites</div>
        <div className="flex gap-2 mt-1">
          {[3,5,8].map((n) => (
            <button key={n} onClick={() => setSatCount(n)} className={`rounded px-2 py-1 border ${satCount===n?"bg-slate-700 text-white":"border-slate-700 hover:bg-slate-800"}`}>{n}</button>
          ))}
        </div>
      </div>
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}