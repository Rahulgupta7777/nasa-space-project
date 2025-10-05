"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const messages = [
  "Sequencing orbital debris models…",
  "Calibrating GIBS imagery layers…",
  "Propagating TLEs with SGP4…",
  "Computing conjunction probabilities…",
  "Evaluating sustainability metrics…",
];

export default function RouteLoader() {
  const pathname = usePathname();
  const [show, setShow] = useState(true); // show on initial mount
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    // Brief loader on route change
    setShow(true);
    const hide = setTimeout(() => setShow(false), 900);
    return () => clearTimeout(hide);
  }, [pathname]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((i) => (i + 1) % messages.length);
    }, 800);
    return () => clearInterval(timer);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="rounded-xl border border-slate-800 bg-[#0b0f14] px-6 py-5 shadow-lg">
        <div className="text-sm text-slate-400">{messages[msgIndex]}</div>
        <div className="mt-3 h-1 w-48 overflow-hidden rounded bg-slate-800">
          <div className="h-full w-1/3 animate-[loader_1.2s_ease_infinite] bg-slate-300" />
        </div>
      </div>
      <style jsx>{`
        @keyframes loader {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(120%); }
        }
      `}</style>
    </div>
  );
}