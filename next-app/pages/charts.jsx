import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";
import { getRecords } from "@/utils/recordsFunctions";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c", "#d0ed57"];
const MONTHS = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];

export default function ChartsPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getRecords();
      setRecords(data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    };
    fetch();
  }, []);

  const groupedByMonth = {};
  records.forEach((r) => {
    const monthKey = r.date.slice(0, 7);
    if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
    groupedByMonth[monthKey].push(r);
  });

  const monthlyAverages = Object.entries(groupedByMonth).map(([monthKey, values]) => {
    const minValue = Math.min(...values.map(v => v.eur_ron));
    const maxValue = Math.max(...values.map(v => v.eur_ron));
    const minDate = values.find(v => v.eur_ron === minValue)?.date || "-";
    const maxDate = values.find(v => v.eur_ron === maxValue)?.date || "-";

    const [year, month] = monthKey.split("-");
    const label = `${MONTHS[parseInt(month) - 1]} ${year}`;

    return {
      month: label,
      avg: parseFloat((values.reduce((a, b) => a + b.eur_ron, 0) / values.length).toFixed(4)),
      min: minValue,
      max: maxValue,
      minDate,
      maxDate
    };
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow text-sm">
          <p><strong>Luna:</strong> {label}</p>
          <p><strong>Minim:</strong> {data.min} ({data.minDate})</p>
          <p><strong>Maxim:</strong> {data.max} ({data.maxDate})</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Grafic Interactiv EUR/RON</h1>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📈 Trendul mediei lunare</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyAverages} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avg" stroke="#4f46e5" strokeWidth={2} name="Medie EUR" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">📊 Interval minim-maxim lunar</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyAverages} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={["auto", "auto"]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="min" fill="#f87171" name="Minim" barSize={30} />
            <Bar dataKey="max" fill="#34d399" name="Maxim" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
