import Link from "next/link";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="rounded-xl border border-slate-800/60 bg-[#0b0f14] p-8 text-center">
        <h3 className="text-2xl font-bold">Build a Responsible LEO Business</h3>
        <p className="mt-2 text-slate-300">Visualize orbits, monitor conjunctions, and plan sustainable operations.</p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/dashboard" className="button-primary">Launch Dashboard</Link>
          <Link href="/business" className="button-secondary">Explore Business</Link>
        </div>
      </div>
    </section>
  );
}