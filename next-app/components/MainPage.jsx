import { useEffect, useState } from "react";
import { getRecords } from "@/utils/recordsFunctions";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MainPage() {
  const [records, setRecords] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetch = async () => {
      const data = await getRecords();
      const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
      const uniqueMonths = [...new Set(sorted.map(r => r.date.slice(0, 7)))];
      setMonths(uniqueMonths);
      setSelectedMonth(uniqueMonths[0] || "");
      setRecords(sorted);
    };
    fetch();
  }, []);

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split("-");
    const monthsRO = [
      "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
      "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"
    ];
    return `${monthsRO[parseInt(month, 10) - 1]} ${year}`;
  };

  const toggleDateSelection = (date) => {
    setSelectedDates(prev =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

  const handleCompare = () => {
    if (selectedDates.length < 2) {
      alert("Selectează cel puțin două date pentru comparație.");
      return;
    }
    router.push(`/compare?dates=${selectedDates.join(",")}`);
  };

  const filteredRecords = records.filter((r) => r.date.startsWith(selectedMonth));

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Curs Euro Zilnic</h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex gap-4">
            <Link href="/dashboard">
              <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer text-sm sm:text-base flex items-center gap-2">
                📈 <span>Vezi evoluția RON/EUR</span>
              </span>
            </Link>
            <button
              onClick={handleCompare}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm sm:text-base flex items-center gap-2"
            >
              🔍 <span>Compară</span>
            </button>
          </div>

          <div className="sm:ml-auto">
            <select
              className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-400 dark:border-gray-500 px-4 py-2 rounded text-sm sm:text-base"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {formatMonth(month)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center dark:text-white">
          {formatMonth(selectedMonth)}
        </h2>

        <div className="space-y-4">
          {filteredRecords.map((r) => (
            <div
              key={r._id}
              className="flex justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 px-6 py-3 rounded shadow-sm"
            >
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedDates.includes(r.date)}
                  onChange={() => toggleDateSelection(r.date)}
                  className="accent-purple-600"
                />
                <span className="text-lg text-gray-800 dark:text-gray-200 font-medium">{r.date}</span>
              </div>
              <span className="text-xl font-semibold text-green-600 dark:text-green-400">
                {r.eur_ron.toFixed(4)} RON
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
