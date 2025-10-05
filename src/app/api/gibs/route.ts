import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const layer = url.searchParams.get("layer");
    const time = url.searchParams.get("time") ?? new Date().toISOString().slice(0, 10);
    const wms = url.searchParams.get("wms");
    const tileMatrixSet = url.searchParams.get("tileMatrixSet") ?? "2km";
    const tileMatrix = url.searchParams.get("tileMatrix") ?? "0";
    const tileRow = url.searchParams.get("tileRow") ?? "0";
    const tileCol = url.searchParams.get("tileCol") ?? "0";
    if (!layer) return NextResponse.json({ error: "Missing layer" }, { status: 400 });
    let gibsUrl: string;
    if (wms) {
      // Generate a world snapshot using WMS for consistent previews
      const width = parseInt(url.searchParams.get("width") || "512", 10);
      const height = parseInt(url.searchParams.get("height") || "256", 10);
      const bbox = url.searchParams.get("bbox") || "-180,-90,180,90"; // world in EPSG:4326
      gibsUrl = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?service=WMS&version=1.1.1&request=GetMap&layers=${encodeURIComponent(layer)}&styles=&format=image/jpeg&bbox=${encodeURIComponent(bbox)}&width=${width}&height=${height}&time=${encodeURIComponent(time)}`;
    } else {
      gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${encodeURIComponent(layer)}&STYLE=default&FORMAT=image/jpeg&TILEMATRIXSET=${encodeURIComponent(tileMatrixSet)}&TILEMATRIX=${encodeURIComponent(tileMatrix)}&TILEROW=${encodeURIComponent(tileRow)}&TILECOL=${encodeURIComponent(tileCol)}&TIME=${encodeURIComponent(time)}`;
    }
    const res = await fetch(gibsUrl, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ error: `Upstream error ${res.status}` }, { status: 502 });
    const buf = await res.arrayBuffer();
    return new Response(buf, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to proxy GIBS tile" }, { status: 500 });
  }
}