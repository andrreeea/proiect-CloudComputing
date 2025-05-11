import { useState } from "react";
import { useRouter } from "next/router";

export default function AddPage() {
  const router = useRouter();
  const [form, setForm] = useState({ date: "", eur_ron: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.date || !form.eur_ron) {
      alert("Completează toate câmpurile!");
      return;
    }

    const response = await fetch("/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: form.date,
        eur_ron: parseFloat(form.eur_ron),
      }),
    });

    if (response.ok) {
      alert("Curs adăugat!");
      router.push("/");
    } else {
      alert("Eroare la adăugare!");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Adaugă curs nou</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="date">Data:</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1" htmlFor="eur_ron">Curs EUR:</label>
          <input
            type="number"
            step="0.0001"
            name="eur_ron"
            value={form.eur_ron}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Adaugă
        </button>
      </form>
    </div>
  );
}
