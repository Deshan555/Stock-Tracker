
"use client";
import { useState } from "react";
import { Progress, Select } from "antd";
import { useRouter } from "next/navigation";
import { Form, Input, InputNumber, Button, Card, Space, message } from "antd";
import { CapitalRecordSelect } from "./CapitalRecordSelect";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface ClothesInput {
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
  createdAt?: Date;
  updatedAt?: Date;
  stockStatus?: 'IN_STOCK' | 'SOLD_OUT' | 'LOW_STOCK';
}

export default function AddClothesPage({ data, isEditMode = false }: { data: any; isEditMode?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  const onFinish = async (values: ClothesInput) => {
    setLoading(true);
    setProgress(0);
    try {
      const expanded: ClothesInput[] = [];
      if (values.quantity > 1) {
        for (let i = 0; i < values.quantity; i++) {
          expanded.push({ ...values, quantity: 1 });
        }
      } else {
        expanded.push({ ...values, quantity: 1 });
      }

      for (let i = 0; i < expanded.length; i++) {
        const res = await fetch("/api/clothes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(expanded[i]),
        });
        if (!res.ok) throw new Error("Failed to add clothes at record " + (i + 1));
        setProgress(Math.round(((i + 1) / expanded.length) * 100));
      }
      message.success("Clothes added successfully");
      setTimeout(() => router.push("/dashboard/clothes"), 500);
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Clothes (Bulk Supported)</h2>
      {progress > 0 && loading && (
        <div className="mb-4">
          <Progress percent={progress} status={progress === 100 ? "success" : "active"} />
        </div>
      )}
      <Form
        layout="vertical"
        name="add-clothes" onFinish={onFinish}
        autoComplete="off"
      // initialValues={{ items: [{ name: "", category: "", wholesalePrice: 0, prisedPrice: 0, salePrice: 0, discountedPrice: 0, quantity: 1, capitalRecordId: "" }] }}
      >
        <Form.Item name="patternCode" label="Pattern Code">
          <Input placeholder="e.g. P1234" />
        </Form.Item>
        <Form.Item name="name" label="Item Name" rules={[{ required: true, message: "Required" }]}>
          <Input placeholder="e.g. T-shirt" />
        </Form.Item>
        <Form.Item name="category" label="Category" rules={[{ required: true, message: "Required" }]}>
          <Select placeholder="Select Category" bordered={false}
            className="selectField-custom" options={[
              { label: "Men", value: "men" },
              { label: "Women", value: "women" },
              { label: "Kids", value: "kids" },
              { label: "Accessories", value: "accessories" },
              { label: "Others", value: "others" }
            ]} />
        </Form.Item>
        <Form.Item name="color" label="Color">
          <Select placeholder="Select Color" bordered={false} className="selectField-custom" options={[
            { label: "Multicolor", value: "multicolor" },
            { label: "Red", value: "red" },
            { label: "Green", value: "green" },
            { label: "Blue", value: "blue" },
            { label: "Black", value: "black" },
            { label: "White", value: "white" }
          ]} />
        </Form.Item>
        <Form.Item name="wholesalePrice" label="Wholesale Price" rules={[{ required: true, message: "Required" }]}>
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 10.00" />
        </Form.Item>
        <Form.Item name="prisedPrice" label="Prised Price">
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 15.00" />
        </Form.Item>
        <Form.Item name="salePrice" label="Sale Price">
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 20.00" />
        </Form.Item>
        <Form.Item name="discountedPrice" label="Discounted Price">
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 18.00" />
        </Form.Item>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Required" }]}>
          <InputNumber min={1} style={{ width: "100%" }} placeholder="e.g. 50" />
        </Form.Item>
        <Form.Item name="stockStatus" label="Stock Status" rules={[{ required: true, message: "Required" }]}>
          <Select placeholder="Select Stock Status" bordered={false} className="selectField-custom" options={[
            { label: "In Stock", value: "IN_STOCK" },
            { label: "Sold Out", value: "SOLD_OUT" },
            { label: "Low Stock", value: "LOW_STOCK" }
          ]} />
        </Form.Item>
        <Form.Item
          name="capitalRecordId"
          label="Capital Record"
          rules={[{ required: true, message: "Required" }]}
          getValueFromEvent={v => v}
          valuePropName="value"
        >
          <CapitalRecordSelect />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>Add Clothes</Button>
            <Button onClick={() => router.back()} disabled={loading}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
