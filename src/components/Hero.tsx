"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const enter = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-3";

  return (
    <section className="mx-auto max-w-6xl px-4 pt-20 pb-12 text-center sm:text-left">
      <h1 className={`text-4xl sm:text-6xl font-extrabold tracking-tight transition-all duration-700 ${enter}`}>
        <span className="neon-text">Spacia</span> · AI-Powered Space Traffic Control
      </h1>
      <p className={`mt-4 text-slate-300 max-w-2xl transition-all duration-700 delay-150 ${enter}`}>
        Real-time orbit visualization, live conjunction alerts, and mission-focused UX crafted for space operations.
      </p>
      <div className={`mt-8 flex gap-4 justify-center sm:justify-start transition-all duration-700 delay-300 ${enter}`}>
        <Link href="/dashboard" className="button-primary">
          Open Dashboard
        </Link>
        <Link href="/business" className="button-secondary">
          Explore Business
        </Link>
      </div>
    </section>
  );
}