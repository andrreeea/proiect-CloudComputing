import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [viewMode, setViewMode] = useState("monthly");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetch("/api/records")
      .then(res => res.json())
      .then(data => {
        const sorted = data.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setRecords(sorted);
        if (!selectedMonth) {
          const firstMonth = sorted[0]?.date.slice(0, 7);
          setSelectedMonth(firstMonth);
        }
      });
  }, []);

  const groupBy = (data, keyFn) => {
    const result = {};
    for (const d of data) {
      const key = keyFn(d);
      if (!result[key]) result[key] = [];
      result[key].push(d.eur_ron);
    }
    return result;
  };

  const calculateAvg = (grouped) => {
    return Object.entries(grouped).map(([key, values]) => ({
      label: key,
      avg: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(4),
    }));
  };

  const getData = () => {
    if (viewMode === "monthly") {
      const grouped = groupBy(records, r => r.date.slice(0, 7));
      return calculateAvg(grouped);
    }
    if (viewMode === "weekly") {
      const grouped = groupBy(records, r => {
        const d = new Date(r.date);
        const week = Math.ceil((d.getDate() - d.getDay() + 1) / 7);
        return `${r.date.slice(0, 7)}-W${week}`;
      });
      return calculateAvg(grouped);
    }
    if (viewMode === "daily" && selectedMonth) {
      return records
        .filter(r => r.date.startsWith(selectedMonth))
        .map(r => ({
          label: r.date,
          avg: r.eur_ron.toFixed(4)
        }));
    }
    return [];
  };

  const chartData = getData();
  const allMonths = [...new Set(records.map(r => r.date.slice(0, 7)))];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard - Evoluția EUR/RON în anul 2025</h1>
        <Link href="/">
          <span className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition cursor-pointer text-sm">
            Înapoi la pagina principală
          </span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-4 py-2 rounded font-medium transition ${
            viewMode === 'monthly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Lunar
        </button>

        <button
          onClick={() => setViewMode("weekly")}
          className={`px-4 py-2 rounded font-medium transition ${
            viewMode === 'weekly'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Săptămânal
        </button>

        <button
          onClick={() => setViewMode("daily")}
          className={`px-4 py-2 rounded font-medium transition ${
            viewMode === 'daily'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
          }`}
        >
          Zilnic
        </button>

        {viewMode === "daily" && (
          <select
            className="bg-gray-700 text-white border border-gray-500 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {allMonths.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        )}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="avg" stroke="#8884d8" name="Curs mediu" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
