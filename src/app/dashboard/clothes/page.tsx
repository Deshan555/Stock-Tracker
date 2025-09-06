
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, Button, Space, Tag, Input, Select, DatePicker, Statistic, Card, Popconfirm, message, Drawer } from "antd";
import { useMemo } from "react";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import AddClothesPage from "./new/page";

interface Clothes {
  _id: string;
  patternCode?: string;
  name: string;
  category: string;
  wholesalePrice: number;
  prisedPrice?: number;
  salePrice?: number;
  discountedPrice?: number;
  quantity: number;
  capitalRecordId: string;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
  stockStatus?: 'IN_STOCK' | 'SOLD_OUT' | 'LOW_STOCK';
}

export default function ClothesPage() {
  const [clothes, setClothes] = useState<Clothes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [stockStatus, setStockStatus] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchClothes();
  }, []);

  async function fetchClothes() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/clothes");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClothes(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/clothes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setClothes(clothes.filter((c) => c._id !== id));
    } else {
      alert("Failed to delete");
    }
  }

  // Filtering logic
  const filteredClothes = useMemo(() => {
    return clothes.filter(item => {
      const matchesSearch = search === "" || item.name.toLowerCase().includes(search.toLowerCase()) || (item.patternCode?.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = !category || item.category === category;
      const matchesStock = !stockStatus || item.stockStatus === stockStatus;
      const matchesDate = !dateRange || (item.createdAt && dayjs(item.createdAt).isAfter(dateRange[0]) && dayjs(item.createdAt).isBefore(dateRange[1]));
      return matchesSearch && matchesCategory && matchesStock && matchesDate;
    });
  }, [clothes, search, category, stockStatus, dateRange]);

  // Table columns
  const columns: ColumnsType<Clothes> = [
    { title: "Pattern Code", dataIndex: "patternCode", key: "patternCode" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category", filters: [
      { text: "Men", value: "men" },
      { text: "Women", value: "women" },
      { text: "Kids", value: "kids" },
      { text: "Accessories", value: "accessories" },
      { text: "Others", value: "others" },
    ],
      onFilter: (value, record) => record.category === value
    },
    { title: "Color", dataIndex: "color", key: "color" },
    { title: "Wholesale", dataIndex: "wholesalePrice", key: "wholesalePrice", render: v => `$${v?.toFixed(2)}` },
    { title: "Prised", dataIndex: "prisedPrice", key: "prisedPrice", render: v => v ? `$${v?.toFixed(2)}` : '-' },
    { title: "Sale", dataIndex: "salePrice", key: "salePrice", render: v => v ? `$${v?.toFixed(2)}` : '-' },
    { title: "Discounted", dataIndex: "discountedPrice", key: "discountedPrice", render: v => v ? `$${v?.toFixed(2)}` : '-' },
    { title: "Qty", dataIndex: "quantity", key: "quantity" },
    { title: "Stock Status", dataIndex: "stockStatus", key: "stockStatus", render: (status) => {
      if (!status) return '-';
      let color = status === 'IN_STOCK' ? 'green' : status === 'LOW_STOCK' ? 'orange' : 'red';
      return <Tag color={color}>{status.replace('_', ' ')}</Tag>;
    } },
    { title: "Capital", dataIndex: "capitalRecordId", key: "capitalRecordId" },
    { title: "Created", dataIndex: "createdAt", key: "createdAt", render: v => v ? dayjs(v).format('YYYY-MM-DD') : '-' },
    { title: "Actions", key: "actions", render: (_, item) => (
      <Space>
        <Link href={`/dashboard/clothes/${item._id}/edit`} className="text-blue-600">Edit</Link>
        <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(item._id)} okText="Yes" cancelText="No">
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      </Space>
    ) },
  ];

  // Summary
  const totalQty = filteredClothes.reduce((sum, c) => sum + (c.quantity || 0), 0);
  const totalWholesale = filteredClothes.reduce((sum, c) => sum + (c.wholesalePrice || 0), 0);
  const totalSale = filteredClothes.reduce((sum, c) => sum + (c.salePrice || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="text-xl font-bold">Clothes Inventory</h2>
        {/* <Link href="/dashboard/clothes/new">

        </Link> */}
                  <Button 
          onClick={() => setShowAddModal(true)}
          type="primary">Add Item(s)</Button>
      </div>
      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input.Search allowClear placeholder="Search by name or pattern code" value={search} onChange={e => setSearch(e.target.value)} style={{ width: 200 }} />
          <Select allowClear placeholder="Category" value={category} onChange={setCategory} style={{ width: 140 }}
            options={[
              { label: "Men", value: "men" },
              { label: "Women", value: "women" },
              { label: "Kids", value: "kids" },
              { label: "Accessories", value: "accessories" },
              { label: "Others", value: "others" },
            ]}
          />
          <Select allowClear placeholder="Stock Status" value={stockStatus} onChange={setStockStatus} style={{ width: 140 }}
            options={[
              { label: "In Stock", value: "IN_STOCK" },
              { label: "Low Stock", value: "LOW_STOCK" },
              { label: "Sold Out", value: "SOLD_OUT" },
            ]}
          />
          <DatePicker.RangePicker allowClear value={dateRange} onChange={setDateRange} />
        </Space>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <Space>
          <Statistic title="Total Items" value={filteredClothes.length} />
          <Statistic title="Total Quantity" value={totalQty} />
          <Statistic title="Total Wholesale" value={totalWholesale} precision={2} prefix="$" />
          <Statistic title="Total Sale" value={totalSale} precision={2} prefix="$" />
        </Space>
      </Card>
      <Table
        columns={columns}
        dataSource={filteredClothes}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        scroll={{ x: 'max-content' }}
      />

      <Drawer open={showAddModal} onClose={() => setShowAddModal(false)} width={720} title="Add Clothes">
        <AddClothesPage data={{ onAdded: () => { setShowAddModal(false); fetchClothes(); } }} />
      </Drawer>

      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
}
