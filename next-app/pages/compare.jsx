import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ComparePage() {
  const router = useRouter();
  const [comparedData, setComparedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompare = async () => {
      const query = router.query.dates;
      if (!query) return;

      const dates = query.split(",");
      const promises = dates.map(date =>
        fetch(`/api/records?id=${encodeURIComponent(date)}`).then(res => res.json())
      );
      const results = await Promise.all(promises);
      const data = results
        .map(r => r.data)
        .filter(Boolean)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setComparedData(data);
      setLoading(false);
    };

    if (router.isReady) {
      fetchCompare();
    }
  }, [router.isReady, router.query.dates]);

  const calculateDifferences = () => {
    if (comparedData.length < 2) return [];

    const diffs = [];
    for (let i = 1; i < comparedData.length; i++) {
      const prev = comparedData[i - 1];
      const curr = comparedData[i];
      const diff = curr.eur_ron - prev.eur_ron;
      const percent = ((diff / prev.eur_ron) * 100).toFixed(2);
      diffs.push({
        from: prev.date,
        to: curr.date,
        valueFrom: prev.eur_ron,
        valueTo: curr.eur_ron,
        diff: diff.toFixed(4),
        percent,
        trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral",
      });
    }
    return diffs;
  };

  const differences = calculateDifferences();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Comparație Curs EUR/RON</h1>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm"
        >
          Înapoi la pagina principală
        </button>
      </div>

      {loading ? (
        <p className="text-center">Se încarcă datele...</p>
      ) : (
        <>
          <ul className="space-y-2 mb-6">
            {comparedData.map((d) => (
              <li key={d.date} className="flex justify-between border-b py-2 dark:border-gray-600">
                <span className="font-medium text-gray-700 dark:text-gray-300">{d.date}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold">{d.eur_ron.toFixed(4)} RON</span>
              </li>
            ))}
          </ul>

          <div className="space-y-4">
            {differences.map((diff, idx) => (
              <div
                key={idx}
                className={`p-4 rounded shadow border-l-4 ${
                  diff.trend === "up"
                    ? "border-green-500 bg-green-50 dark:bg-green-900/10"
                    : diff.trend === "down"
                    ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                    : "border-gray-500 bg-gray-100 dark:bg-gray-800/50"
                }`}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                  De la <strong>{diff.from}</strong> la <strong>{diff.to}</strong>
                </p>
                <p className="text-lg font-bold">
                  {diff.valueFrom.toFixed(4)} ➜ {diff.valueTo.toFixed(4)} RON{" "}
                  {diff.trend === "up" && <span className="text-green-600">🔺</span>}
                  {diff.trend === "down" && <span className="text-red-600">🔻</span>}
                  {diff.trend === "neutral" && <span>➖</span>}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Diferență: <strong>{diff.diff} RON</strong> ({diff.percent}%)
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
