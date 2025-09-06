import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="list-disc ml-6 space-y-2">
        <li><Link href="/dashboard/capital-records" className="text-blue-600 hover:underline">Manage Capital Records</Link></li>
        <li><Link href="/dashboard/clothes" className="text-blue-600 hover:underline">Manage Clothes Inventory</Link></li>
        <li><Link href="/dashboard/transactions" className="text-blue-600 hover:underline">Manage Transactions</Link></li>
      </ul>
    </div>
  );
}
