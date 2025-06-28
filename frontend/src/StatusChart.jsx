import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
} from "recharts";
import axios from "axios";

function StatusChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/status-code-distribution")
      .then((res) => {
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setError("Unexpected response format.");
        }
      })
      .catch((err) => {
        setError("Could not load status chart.");
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
      <h3 className="text-lg font-semibold mb-2">HTTP Status Code Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="status" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            labelStyle={{ color: "#a3e635" }}
          />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="count" position="top" fill="#fff" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">
        Blue bars represent the number of times each HTTP status code appeared in the logs.
      </p>
    </div>
  );
}

export default StatusChart;

