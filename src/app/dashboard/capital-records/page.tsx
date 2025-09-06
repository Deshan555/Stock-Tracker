
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Table, Button, Space, Card, Statistic, Popconfirm, message, Tooltip, Drawer } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import AddCapitalRecordPage from "./new/page";
import { ToastContainer, toast } from 'react-toastify';

interface CapitalRecord {
  _id: string;
  amountInvested: number;
  description?: string;
  createdAt: string;
  remainingBalance: number;
  totalItems?: number;
  remainingItems?: number;
  totalSell?: number;
  expectedIncome?: number;
}

export default function CapitalRecordsPage() {
  const [records, setRecords] = useState<CapitalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const currencyFormatter = (v: number) =>
    v != null ? v.toLocaleString('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 2 }) : '-';

  const columns: ColumnsType<CapitalRecord> = [
    { title: "Amount Invested", dataIndex: "amountInvested", key: "amountInvested", render: currencyFormatter },
    { title: "Remaining Balance", dataIndex: "remainingBalance", key: "remainingBalance", render: currencyFormatter },
    { title: "Total Items", dataIndex: "totalItems", key: "totalItems" },
    { title: "Remaining Items", dataIndex: "remainingItems", key: "remainingItems" },
    { title: "Total Sell", dataIndex: "totalSell", key: "totalSell", render: currencyFormatter },
    { title: "Expected Income", dataIndex: "expectedIncome", key: "expectedIncome", render: currencyFormatter },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt", render: v => v ? dayjs(v).format('YYYY-MM-DD') : '-' },
    { title: "Actions", key: "actions", render: (_, rec) => (
      <Space>
        <Tooltip title="Edit">
          <Link href={`/dashboard/capital-records/${rec._id}/edit`}>
            <Button type="text" icon={<EditOutlined />} />
          </Link>
        </Tooltip>
        <Tooltip title="View Clothes">
          <Link href={`/dashboard/clothes/by-capital?capitalRecordId=${rec._id}`}>
            <Button type="text" icon={<EyeOutlined />} />
          </Link>
        </Tooltip>
        <Popconfirm title="Delete this capital record?" onConfirm={() => handleDelete(rec._id)} okText="Yes" cancelText="No">
          <Tooltip title="Delete">
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Tooltip>
        </Popconfirm>
      </Space>
    ) },
  ];

  return (
    <Card>
      <ToastContainer />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className="text-xl font-bold">Capital Records</h2>
        <Button type="primary" 
        className="main-button"
        onClick={() => setShowAddModal(true)}>Add Capital</Button>
      </div>
      <Table
        columns={columns}
        dataSource={records}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
      {error && <div className="text-red-500">{error}</div>}

      <Drawer
        title="Add Capital Record"
        width={400}
        onClose={() => setShowAddModal(false)}
        open={showAddModal}
        bodyStyle={{ paddingBottom: 80 }}
        destroyOnClose
      >
        <AddCapitalRecordPage onClose={() => {
          setShowAddModal(false);
          fetchRecords();
          toast.success('Capital record added', { autoClose: 3000 });
        }} />
      </Drawer>
    </Card>
  );
}
