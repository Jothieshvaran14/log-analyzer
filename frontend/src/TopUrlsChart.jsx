import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
  Legend,
} from "recharts";
import axios from "axios";

function TopUrlsChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/top-urls")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const formatted = res.data.map((entry) => ({
            ...entry,
            url: entry.url.length > 25 ? entry.url.slice(0, 25) + "..." : entry.url,
            anomaly: entry.anomaly === true || entry.anomaly === "True"
          }));
          setData(formatted);
        } else {
          setError("Unexpected data format.");
        }
      })
      .catch((err) => {
        setError("Unable to load top URLs.");
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

  return (
    <div className="text-white">
      <h3 className="text-lg font-semibold mb-2">Top Accessed URLs (with Anomaly Markers)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="url" stroke="#ccc" angle={-20} textAnchor="end" height={60} />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            formatter={(value, name) => [value, name === "count" ? "Hits" : name]}
          />
          <Legend />
          <Bar
            dataKey="count"
            fill="#818cf8"
            isAnimationActive={true}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="anomaly"
              position="top"
              formatter={(v) => (v ? "🚨 Anomaly" : "")}
              style={{ fill: "#facc15", fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">
        Anomalies are detected using <b>KMeans</b> clustering and flagged above the bars.
      </p>
    </div>
  );
}

export default TopUrlsChart;

