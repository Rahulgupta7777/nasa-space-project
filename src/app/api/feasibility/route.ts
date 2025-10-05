import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      purpose = "",
      budget = "",
      altitude = "",
      payload = "",
      timeline = "",
      riskTolerance = "",
      model: modelOverride,
    } = body || {};

    const originContext = `Consider navigation/PNT constellations (e.g., Xona), GNSS augmentation (e.g., GLONASS interoperability), and private PNT initiatives (e.g., AeroDome's VyomIC).`;

    const partnerLibrary = `Partner ecosystem examples (non-exhaustive; choose relevant and available):
Categories:
- PNT / Navigation: Xona, Aerodome/VyomIC
- Earth Observation (EO): Planet, Pixxel, Satellogic, Umbra
- Ground / Stations / Ops: KSAT, AWS Ground Station, Azure Space
- Comms / Optical / RF: Mynaric, Viasat, Iridium
- Launch / Rideshare: SpaceX Transporter, Rocket Lab
- Analytics / Platforms: SkyServe, Orbital Insight
Notes:
- Use these as examples; verify availability, region, licensing, and mission fit.
- Prioritize near-term partners and conservative ROI.`;

    const prompt = `You are a space commercialization strategist.
Given the following mission parameters, suggest the most feasible Low Earth Orbit (LEO) business plan.

Input:
- Mission Purpose: ${purpose}
- Budget: ${budget}
- Orbit Altitude: ${altitude} km
- Payload Mass: ${payload} kg
- Deployment Timeline: ${timeline}
- Risk Tolerance: ${riskTolerance}

Constraints and context:
- ${originContext}
- ${partnerLibrary}
- Provide practical, near-term options (0–36 months), realistic partner examples, and conservative ROI.

Return:
1) Recommended orbit strategy
2) Potential ROI range
3) Key technical partners
4) Suggested timeline and launch type
5) One-paragraph reasoning`;

    const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434";
    const model = (modelOverride && String(modelOverride)) || process.env.OLLAMA_MODEL || "llama3";

    const resp = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model, prompt, stream: false }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: "LLM request failed", details: text },
        { status: 502 }
      );
    }

    const data = await resp.json();
    const result: string = data.response ?? data.output ?? "";
    return NextResponse.json({ result });
  } catch (e: unknown) {
    const details = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Bad request or LLM error", details },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}