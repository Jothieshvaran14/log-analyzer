import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

const ActiveHoursChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/most-active-hours")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Error fetching active hours:", err));
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4 text-black">Most Active Time Slots</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActiveHoursChart;

