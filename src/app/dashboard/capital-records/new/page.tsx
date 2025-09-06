"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, InputNumber, Button, Card, message, Space } from "antd";
import { ToastContainer, toast } from 'react-toastify';

export default function AddCapitalRecordPage({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFinish = async (values: { amountInvested: number; description?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/capital-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountInvested: values.amountInvested, description: values.description, remainingBalance: 0 })
      });
      if (!res.ok) throw new Error("Failed to add capital record");
      onClose?.();
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to add capital record', { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form layout="vertical" onFinish={onFinish} autoComplete="off">
        <Form.Item name="amountInvested" label="Amount Invested (LKR)" rules={[{ required: true, message: "Required" }]}>
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 100000" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea maxLength={200} placeholder="Optional description" autoSize={{ minRows: 2, maxRows: 4 }} />
        </Form.Item>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Form.Item style={{ marginTop: 20 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} className="main-button">Add Capital</Button>
            <Button onClick={() => router.back()} disabled={loading} className="cancel-button">Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
