import React, { useEffect, useState } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import axios from "axios";

function SlowResponsesChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/slow-responses")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const formatted = res.data.map((entry) => ({
            timestamp: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            response_time: Number(entry.response_time),
            slow: entry.slow === true || entry.slow === "True"
          }));
          setData(formatted);
        } else {
          setError("Unexpected data format.");
        }
      })
      .catch((err) => {
        setError("Unable to load response time data.");
        console.error(err);
      });
  }, []);

  if (error) {
    return (
      <div className="bg-red-800 p-4 rounded-md text-white">
        <p>{error}</p>
      </div>
    );
  }

  // Split data based on slow vs normal
  const slowData = data.filter(d => d.slow);
  const normalData = data.filter(d => !d.slow);

  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-2">Slow Response Endpoints (Z-Score)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="timestamp" stroke="#ccc" angle={-20} textAnchor="end" height={60} />
          <YAxis dataKey="response_time" stroke="#ccc" unit=" ms" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            formatter={(val, name) => [val, name === "response_time" ? "Response Time (ms)" : name]}
          />
          <Legend />
          <Scatter name="Normal" data={normalData} fill="#4ade80" />
          <Scatter name="Slow" data={slowData} fill="#f87171" />
        </ScatterChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">
        Flagged using <strong>Z-Score &gt; 2.0</strong>. Points in red are significantly slower than average.
      </p>
    </div>
  );
}

export default SlowResponsesChart;

