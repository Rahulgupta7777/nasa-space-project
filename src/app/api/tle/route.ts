import { NextResponse } from "next/server";

// Proxy a subset of CelesTrak TLEs and return as JSON
// Note: For hackathon use; consider caching and rate limits for production.
export async function GET() {
  const url = "https://celestrak.org/NORAD/elements/gp.php?group=active&format=tle";
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/);
    const out: { name: string; line1: string; line2: string }[] = [];
    for (let i = 0; i < lines.length; i += 3) {
      const name = (lines[i] || "").trim();
      const line1 = (lines[i + 1] || "").trim();
      const line2 = (lines[i + 2] || "").trim();
      if (name && line1.startsWith("1 ") && line2.startsWith("2 ")) {
        out.push({ name, line1, line2 });
      }
    }
    return NextResponse.json({ count: out.length, satellites: out });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch TLEs" }, { status: 500 });
  }
}