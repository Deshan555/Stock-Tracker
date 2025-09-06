"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddCapitalRecordPage() {
  const router = useRouter();
  const [amountInvested, setAmountInvested] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/capital-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInvested, remainingBalance, description }),
      });
      if (!res.ok) throw new Error("Failed to add capital record");
      router.push("/dashboard/capital-records");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Capital Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Amount Invested</label>
          <input
            type="number"
            value={amountInvested}
            onChange={e => setAmountInvested(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
            min={0}
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Remaining Balance</label>
          <input
            type="number"
            value={remainingBalance}
            onChange={e => setRemainingBalance(Number(e.target.value))}
            className="w-full border rounded px-3 py-2"
            required
            min={0}
            step="0.01"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            maxLength={200}
          />
        </div>
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? "Adding..." : "Add Capital"}
          </button>
          <button type="button" className="px-4 py-2 rounded border" onClick={() => router.back()} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
