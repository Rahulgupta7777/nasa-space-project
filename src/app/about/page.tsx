export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold">About AresMatrix LEO</h1>
      <p className="mt-4 text-slate-300 max-w-3xl">
        AresMatrix LEO is a SaaS platform that acts as a guard dog for space traffic
        in Low Earth Orbit. It tracks satellites, predicts potential collisions, and
        suggests avoidance maneuvers in real time to safeguard the growing space economy.
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Mission</h2>
          <p className="mt-2 text-slate-300">
            Prevent cascade effects like Kessler Syndrome by minimizing collision risks,
            promoting sustainable orbital operations.
          </p>
        </div>
        <div className="glass-panel p-6 rounded-lg">
          <h2 className="text-xl font-semibold">Technology</h2>
          <p className="mt-2 text-slate-300">
            AI-driven predictions combined with real-time visualization and UX crafted for
            dark environments using modern web technologies.
          </p>
        </div>
      </div>
    </div>
  );
}