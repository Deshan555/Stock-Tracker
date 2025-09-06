"use client";
import { useState } from "react";
import { Form, InputNumber, Select, Button, message, Space, Drawer } from "antd";

interface UpdateClothesProps {
  id: string;
  initialStockStatus?: string;
  initialSalePrice?: number;
  initialDiscountedPrice?: number;
  initialPrisedPrice?: number;
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const stockStatusOptions = [
  { label: "In Stock", value: "IN_STOCK" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Sold Out", value: "SOLD_OUT" },
];

export default function UpdateClothesDrawer({ id, initialStockStatus, initialSalePrice, initialDiscountedPrice, initialPrisedPrice, open, onClose, onUpdated }: UpdateClothesProps) {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { stockStatus: string; salePrice: number; discountedPrice: number; prisedPrice: number }) => {
    let jsonInput = {
        "stockStatus": values.stockStatus,
        "salePrice": values.prisedPrice - values.discountedPrice,
        "discountedPrice": values.discountedPrice,
        "prisedPrice": values.prisedPrice
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/clothes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonInput),
      });
      if (!res.ok) throw new Error("Failed to update");
      message.success("Clothes updated");
      onClose();
      onUpdated?.();
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer title="Update Clothes" open={open} onClose={onClose} width={400} destroyOnClose>
      <Form
        layout="vertical"
        initialValues={{
          stockStatus: initialStockStatus,
          salePrice: (initialPrisedPrice ?? 0) - (initialDiscountedPrice ?? 0),
          discountedPrice: initialDiscountedPrice,
            prisedPrice: initialPrisedPrice,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item name="stockStatus" label="Stock Status" rules={[{ required: true, message: "Required" }]}> 
          <Select 
          className="selectField-custom"
          bordered={false}
          options={stockStatusOptions} />
        </Form.Item>
        <Form.Item name="prisedPrice" label="Prised Price (LKR)">
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} disabled/>
        </Form.Item>
                <Form.Item name="discountedPrice" label="Discounted Price (LKR)" rules={[{ required: true, message: "Required" }]}>
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="salePrice" label="Sale Price (LKR)" rules={[{ required: true, message: "Required" }]}> 
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} disabled/>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>Update</Button>
            <Button onClick={onClose} disabled={loading}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Drawer>
  );
}
