import { useEffect, useState } from "react";
import { getRecords } from "@/utils/recordsFunctions";
import Link from "next/link";

export default function MainPage() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getRecords();
      setRecords(data);
    };
    fetch();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Curs Euro Zilnic</h1>
      <Link href="/Dashboard" className="text-blue-600 underline mb-4 block">
        Vezi Dashboard
      </Link>
      <div className="grid md:grid-cols-2 gap-4">
        {records.map((r) => (
          <div key={r._id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{r.date}</h3>
            <p className="text-lg text-green-600">{r.eur_ron.toFixed(4)} RON</p>
          </div>
        ))}
      </div>
    </div>
  );
}
