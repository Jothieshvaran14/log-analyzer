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

function SourceIPsChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/source-ips")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const formatted = res.data.map((entry) => ({
            ...entry,
            anomaly: entry.anomaly === true || entry.anomaly === "True"
          }));
          setData(formatted);
        } else {
          setError("Unexpected data format.");
        }
      })
      .catch((err) => {
        setError("Unable to load source IP data.");
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
      <h3 className="text-lg font-semibold mb-2">Suspicious Source IPs (Isolation Forest)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="ip" stroke="#ccc" angle={-20} textAnchor="end" height={60} />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            formatter={(value, name) => [value, name === "count" ? "Requests" : name]}
          />
          <Legend />
          <Bar
            dataKey="count"
            fill="#f59e0b"
            isAnimationActive={true}
            radius={[4, 4, 0, 0]}
          >
            <LabelList
              dataKey="anomaly"
              position="top"
              formatter={(v) => (v ? "🚨 Suspicious" : "")}
              style={{ fill: "#f87171", fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">
        Identified via <b>Isolation Forest</b>. IPs with outlier request volumes are flagged as suspicious.
      </p>
    </div>
  );
}

export default SourceIPsChart;

