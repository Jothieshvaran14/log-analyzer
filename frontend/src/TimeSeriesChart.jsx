import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Label,
} from "recharts";
import axios from "axios";

function TimeSeriesChart() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/requests-over-time")
      .then((res) => {
        if (Array.isArray(res.data)) {
          const formatted = res.data.map((entry) => ({
            ...entry,
            time: new Date(entry.time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setData(formatted);
        } else {
          setError("Unexpected data format.");
        }
      })
      .catch((err) => {
        setError("Unable to load time series data.");
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
      <h3 className="text-lg font-semibold mb-2">Requests Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#ccc">
            <Label value="Time (HH:MM)" offset={-5} position="insideBottom" fill="#ccc" />
          </XAxis>
          <YAxis stroke="#ccc">
            <Label
              value="Request Count"
              angle={-90}
              position="insideLeft"
              style={{ textAnchor: 'middle', fill: '#ccc' }}
            />
          </YAxis>
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", color: "#fff" }}
            labelStyle={{ color: "#a3e635" }}
          />
          <Legend verticalAlign="top" height={36} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#22c55e"
            strokeWidth={2.5}
            dot={{ r: 3, stroke: "#22c55e", strokeWidth: 2, fill: "#000" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-2">
        This line chart displays traffic volume over time. Use it to detect activity bursts or patterns.
      </p>
    </div>
  );
}

export default TimeSeriesChart;

