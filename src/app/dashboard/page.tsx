import CesiumViewer from "../../components/CesiumViewer";
import StatsCards from "../../components/StatsCards";
import AlertsFeed from "../../components/AlertsFeed";

export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-slate-200">
      {/* Header Section */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-white">Orbit Dashboard</h1>
        <p className="mt-3 text-slate-400 max-w-3xl leading-relaxed">
          Monitor live satellite positions, track conjunction risks, and visualize avoidance maneuvers.
          CesiumJS powers a dynamic 3D Earth view, while real-time metrics summarize sustainability
          performance and debris collision probabilities.
        </p>
      </header>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cesium Viewer */}
        <div className="lg:col-span-2 rounded-xl overflow-hidden border border-slate-700 shadow-md">
          <CesiumViewer />
        </div>

        {/* Stats and Alerts */}
        <aside className="space-y-6">
          <StatsCards />
          <div id="alerts">
            <AlertsFeed />
          </div>
        </aside>
      </section>
    </main>
  );
}
