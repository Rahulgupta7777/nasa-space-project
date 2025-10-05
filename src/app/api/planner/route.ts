import { NextResponse } from "next/server";

type PlannerRequest = {
  siteLat: number;
  siteLon: number;
  altitudeKm: number;
  inclinationDeg: number;
  massKg: number;
  areaM2: number;
};

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }

function pickSite(inclinationDeg: number) {
  // Simple mapping of recommended launch sites by inclination
  if (inclinationDeg >= 95 && inclinationDeg <= 100) {
    return { name: "Vandenberg (SSO)", lat: 34.732, lon: -120.572 };
  }
  if (inclinationDeg <= 20) {
    return { name: "Kourou (Low inc)", lat: 5.236, lon: -52.768 };
  }
  if (inclinationDeg <= 40) {
    return { name: "Cape Canaveral (Low–Mid inc)", lat: 28.572, lon: -80.649 };
  }
  if (inclinationDeg <= 65) {
    return { name: "Cape/Wallops (Mid inc)", lat: 37.940, lon: -75.466 };
  }
  return { name: "Vandenberg (High inc)", lat: 34.732, lon: -120.572 };
}

function debrisRisk(altitudeKm: number, inclinationDeg: number) {
  // Heuristic risk: busiest bands ~550–900 km and SSO ~98°
  let score = 0;
  if (altitudeKm < 400) score += 2; else if (altitudeKm < 550) score += 4; else if (altitudeKm < 700) score += 7; else if (altitudeKm < 900) score += 8; else score += 6;
  if (inclinationDeg > 95 && inclinationDeg < 100) score += 2; // SSO congestion
  if (inclinationDeg > 45 && inclinationDeg < 60) score += 1; // mid-inc traffic
  score = clamp(score, 1, 10);
  const level = score <= 3 ? "low" : score <= 6 ? "moderate" : "high";
  const notes: string[] = [];
  if (level === "high") notes.push("Crowded altitude band; consider lower altitude or alternative plane.");
  if (inclinationDeg > 95 && inclinationDeg < 100) notes.push("Sun-synchronous planes are heavily utilized.");
  if (altitudeKm < 400) notes.push("Lower altitudes reduce debris density but increase atmospheric drag.");
  return { score, level: level as "low" | "moderate" | "high", notes };
}

function estimateLifetimeYears(altitudeKm: number, areaToMass: number) {
  // Empirical piecewise baseline lifetime vs altitude (assuming avg solar activity)
  // Baseline for A/M = 0.02 m^2/kg, scale inversely with area-to-mass.
  const baseline = altitudeKm < 350 ? 0.2 : altitudeKm < 400 ? 0.6 : altitudeKm < 500 ? 2.5 : altitudeKm < 600 ? 8 : altitudeKm < 700 ? 18 : altitudeKm < 800 ? 40 : 70;
  const scale = clamp(0.02 / areaToMass, 0.05, 20); // avoid extremes
  const nominal = baseline * scale;
  // Reflect solar cycle uncertainty roughly (±60%)
  const min = nominal * 0.4;
  const max = nominal * 1.6;
  const complies25yrRule = max <= 25; // conservative
  return { min, max, complies25yrRule };
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as PlannerRequest;
    const { siteLat, siteLon, altitudeKm, inclinationDeg, massKg, areaM2 } = body;
    if ([siteLat, siteLon, altitudeKm, inclinationDeg, massKg, areaM2].some((v) => typeof v !== "number" || Number.isNaN(v))) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const site = pickSite(inclinationDeg);
    const risk = debrisRisk(altitudeKm, inclinationDeg);
    const lifetime = estimateLifetimeYears(altitudeKm, areaM2 / massKg);

    const recommendations: string[] = [];
    if (risk.level !== "low") recommendations.push("Select a lower congestion altitude band (e.g., <550 km) if mission permits.");
    if (!lifetime.complies25yrRule) recommendations.push("Increase drag (deploy sail) or target lower altitude to meet 25-year rule.");
    if (inclinationDeg > 95 && inclinationDeg < 100) recommendations.push("Consider non-SSO planes or off-peak RAANs to reduce conjunctions.");
    recommendations.push("Integrate authoritative catalogs (CelesTrak/Space-Track) for pre-launch conjunction screening.");
    recommendations.push("Publish a disposal plan (deorbit or graveyard transfer) aligned with mitigation guidelines.");

    return NextResponse.json({
      recommendedSite: site,
      debrisRisk: risk,
      lifetimeYears: lifetime,
      recommendations,
    });
  } catch (err) {
    return NextResponse.json({ error: "Planner error" }, { status: 500 });
  }
}