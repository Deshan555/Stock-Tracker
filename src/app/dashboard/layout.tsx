import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-gray-100 p-4 flex-shrink-0">
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard/capital-records" className="font-semibold hover:underline">Capital Records</Link>
          <Link href="/dashboard/clothes" className="font-semibold hover:underline">Clothes Inventory</Link>
          <Link href="/dashboard/transactions" className="font-semibold hover:underline">Transactions</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
