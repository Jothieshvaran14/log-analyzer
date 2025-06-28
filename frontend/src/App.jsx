import "./App.css";
import StatusChart from "./StatusChart";
import TimeSeriesChart from "./TimeSeriesChart";
import TopUrlsChart from "./TopUrlsChart";
import SourceIPsChart from "./SourceIPsChart";
import SlowResponsesChart from "./SlowResponsesChart";
import AnomalySummaryChart from "./AnomalySummaryChart";

function App() {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-6 hidden md:block">
        <h1 className="text-2xl font-bold mb-6">🔍 Log Analyzer</h1>
        <nav className="space-y-4 text-gray-300">
          <a href="#" className="block hover:text-white">Status Codes</a>
          <a href="#" className="block hover:text-white">Requests Over Time</a>
          <a href="#" className="block hover:text-white">Top URLs</a>
          <a href="#" className="block hover:text-white">Source IPs</a>
          <a href="#" className="block hover:text-white">Slow Responses</a>
          <a href="#" className="block hover:text-white">Anomalies Summary</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <h2 className="text-3xl font-semibold mb-6">📊 Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Each chart card */}
          <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Status Code Distribution</h3>
            <StatusChart />
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Requests Over Time</h3>
            <TimeSeriesChart />
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Top Accessed URLs (Anomalies)</h3>
            <TopUrlsChart />
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Suspicious Source IPs</h3>
            <SourceIPsChart />
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Slow Response Endpoints</h3>
            <SlowResponsesChart />
          </div>

          <div className="bg-gray-800 p-4 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-2">Anomaly Summary Panel</h3>
            <AnomalySummaryChart />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

