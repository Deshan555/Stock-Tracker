import Link from 'next/link';

export default function TransactionsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Transactions</h2>
        <Link href="/dashboard/transactions/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Transaction</Link>
      </div>
      {/* TODO: List transactions here */}
      <div className="text-gray-500">Transactions list coming soon...</div>
    </div>
  );
}
