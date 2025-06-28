import React, { useEffect, useState } from "react";
import axios from "axios";

function AnomalySummaryChart() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/anomaly-summary")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSummary(res.data[0]);
        } else {
          setError("No anomaly summary available.");
        }
      })
      .catch((err) => {
        setError("Unable to load anomaly summary.");
        console.error(err);
      });
  }, []);

  if (error) return <p className="text-red-500 text-lg">{error}</p>;
  if (!summary) return <p className="text-gray-400 text-lg">Loading summary...</p>;

  const items = [
    {
      label: "Anomalous URLs",
      value: summary.url_anomalies,
      icon: "🌐",
      bg: "bg-yellow-500/10",
      text: "text-yellow-300",
    },
    {
      label: "Suspicious IPs",
      value: summary.ip_anomalies,
      icon: "🛑",
      bg: "bg-red-500/10",
      text: "text-red-300",
    },
    {
      label: "Slow Endpoints",
      value: summary.slow_responses,
      icon: "🐢",
      bg: "bg-blue-500/10",
      text: "text-blue-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {items.map((item, index) => (
        <div
          key={index}
          className={`rounded-xl p-6 shadow-2xl border-2 border-gray-700 transition transform hover:scale-[1.02] hover:shadow-yellow-500/20 ${
            item.value > 0 ? "animate-pulse border-yellow-600" : ""
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`text-5xl rounded-full p-3 ${item.bg} ${item.text} shadow-inner`}
            >
              {item.icon}
            </div>
            <div>
              <h3 className="text-sm uppercase text-gray-400 tracking-wide">
                {item.label}
              </h3>
              <p className="text-4xl font-extrabold text-white">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnomalySummaryChart;

