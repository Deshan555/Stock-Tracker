
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface CapitalRecord {
  _id: string;
  amountInvested: number;
  description?: string;
  createdAt: string;
  remainingBalance: number;
}

export default function CapitalRecordsPage() {
  const [records, setRecords] = useState<CapitalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/capital-records");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setRecords(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this capital record?")) return;
    const res = await fetch(`/api/capital-records/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRecords(records.filter((r) => r._id !== id));
    } else {
      alert("Failed to delete");
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Capital Records</h2>
        <Link href="/dashboard/capital-records/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Capital</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : records.length === 0 ? (
        <div className="text-gray-500">No capital records found.</div>
      ) : (
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Amount Invested</th>
              <th className="p-2 border">Remaining Balance</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec._id}>
                <td className="p-2 border">${rec.amountInvested.toFixed(2)}</td>
                <td className="p-2 border">${rec.remainingBalance.toFixed(2)}</td>
                <td className="p-2 border">{rec.description || "-"}</td>
                <td className="p-2 border">{new Date(rec.createdAt).toLocaleDateString()}</td>
                <td className="p-2 border flex gap-2">
                  <Link href={`/dashboard/capital-records/${rec._id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(rec._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
