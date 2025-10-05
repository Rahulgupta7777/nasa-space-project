"use client";
import { useEffect, useRef } from "react";
import { animate, stagger, cubicBezier } from "animejs";

const pillars = [
  { title: "Satellite Services", desc: "Earth observation, comms, and precision navigation with sustainability at core." },
  { title: "In‑Space Manufacturing", desc: "Materials, pharma, and components enabling next‑gen exploration." },
  { title: "Research & Innovation", desc: "Microgravity R&D with responsible operations and debris mitigation." },
];

export default function PillarsSection() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cards = ref.current.querySelectorAll(".pillar-card");
    animate(cards as NodeListOf<Element>, { opacity: [0, 1], translateY: [12, 0], delay: stagger(120), duration: 600, ease: cubicBezier(0.25, 0.46, 0.45, 0.94) });
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-12" ref={ref}>
      <h2 className="text-xl font-semibold">Commercialization Pillars</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p) => (
          <div key={p.title} className="pillar-card rounded-lg border border-slate-800/60 glass-panel p-5">
            <div className="text-lg font-semibold text-slate-100">{p.title}</div>
            <div className="mt-2 text-sm text-slate-300">{p.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}