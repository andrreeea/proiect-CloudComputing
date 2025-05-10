import { useEffect, useState } from "react";
import { getRecords } from "@/utils/recordsFunctions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HistoryPage() {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getRecords();
      setRecords(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    };
    fetch();
  }, []);


const filtered = records.filter((r) => {
    const matchDate = selectedDate
      ? r.date === selectedDate.toLocaleDateString('en-CA') 
      : true;
  
    const matchSearch =
      r.date.includes(searchTerm) ||
      r.eur_ron.toString().includes(searchTerm);
  
    return matchDate && matchSearch;
  });
  

  const sorted = filtered.sort((a, b) => {
    return sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Istoric Complet EUR/RON</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Caută dată sau valoare..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-4 py-2 rounded w-full sm:w-1/2"
        />

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Filtrează după dată"
          className="border px-4 py-2 rounded"
          isClearable
        />

        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sortează {sortAsc ? "↓" : "↑"}
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border p-2">Data</th>
            <th className="border p-2">Curs EUR/RON</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr key={r._id} className="text-center">
              <td className="border p-2">{r.date}</td>
              <td className={`border p-2 ${r.eur_ron < 5 ? "text-red-500 font-bold" : ""}`}>
                {r.eur_ron.toFixed(4)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
