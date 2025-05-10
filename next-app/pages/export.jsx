import { useEffect, useState } from "react";
import { getRecords } from "@/utils/recordsFunctions";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportPage() {
  const [records, setRecords] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const data = await getRecords();
      setRecords(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
    };
    fetch();
  }, []);

  const filtered = records.filter((r) => {
    if (startDate && new Date(r.date) < new Date(startDate)) return false;
    if (endDate && new Date(r.date) > new Date(endDate)) return false;
    return true;
  });

  const exportToCSV = () => {
    const headers = ["Date", "EUR/RON"];
    const rows = filtered.map((r) => [r.date, r.eur_ron.toFixed(4)]);
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "curs_euro.csv");
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered.map(r => ({ Data: r.date, Curs: r.eur_ron.toFixed(4) })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CursEuro");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "curs_euro.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Data", "Curs EUR"];
    const tableRows = filtered.map(r => [r.date, r.eur_ron.toFixed(4)]);

    doc.text("Curs Euro - Export PDF", 14, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save("curs_euro.pdf");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Exportă Datele EUR/RON</h1>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
        <div className="flex flex-col">
          <label className="text-sm mb-1">De la:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-4 py-2 rounded"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm mb-1">Până la:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-4 py-2 rounded"
          />
        </div>

        <div className="flex gap-2 mt-4 sm:mt-6">
          <button onClick={exportToCSV} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Export CSV
          </button>
          <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Export Excel
          </button>
          <button onClick={exportToPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Export PDF
          </button>
        </div>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border p-2">Data</th>
            <th className="border p-2">Curs EUR/RON</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((r) => (
            <tr key={r._id} className="text-center">
              <td className="border p-2">{r.date}</td>
              <td className="border p-2">{r.eur_ron.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
