import AnimatedHero from "@/components/AnimatedHero";
import PillarsSection from "@/components/PillarsSection";
import CTASection from "@/components/CTASection";
import OrbitalGlobe from "@/components/OrbitalGlobe";
import WorldviewShowcase from "@/components/WorldviewShowcase";

export default function Home() {
  return (
    <div>
      <AnimatedHero />
      <PillarsSection />
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Live Orbit Visualization</h2>
            <p className="text-slate-300">
              Real-time globe showcasing satellite positions and dynamic context for conjunctions.
            </p>
          </div>
          <OrbitalGlobe />
        </div>
      </section>
      <WorldviewShowcase />
      <CTASection />
    </div>
  );
}
