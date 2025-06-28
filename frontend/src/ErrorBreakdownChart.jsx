import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ErrorBreakdownChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/error-breakdown")
      .then((res) => {
        console.log("Fetched error data:", res.data);
        setData(res.data);
      })
      .catch((err) => console.error("Error fetching error breakdown:", err));
  }, []);

  const COLORS = ["#EF4444", "#F97316", "#EAB308", "#22C55E", "#3B82F6"];

  return (
    <div className="bg-white p-4 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-black">Error Status Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ErrorBreakdownChart;

