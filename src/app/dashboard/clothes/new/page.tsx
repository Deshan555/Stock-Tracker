
"use client";
import { useState } from "react";
import { Progress, Select } from "antd";
import { useRouter } from "next/navigation";
import { Form, Input, InputNumber, Button, Card, Space, message, Row, Col } from "antd";
import { CapitalRecordSelect } from "./CapitalRecordSelect";
import { ToastContainer, toast } from 'react-toastify';
import { on } from "events";

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

export default function AddClothesPage({ onClose }: { onClose?: () => void }) {
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
      toast.success("Clothes added successfully", { autoClose: 3000 });
      onClose?.();
    } catch (err: any) {
      toast.error('Failed to add clothes', { autoClose: 3000 });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="patternCode" label="Pattern Code">
              <Input placeholder="e.g. P1234" defaultValue={"PAT-"} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="name" label="Item Name" rules={[{ required: true, message: "Required" }]}>
          <Select placeholder="Select or type item name" bordered={false} showSearch optionFilterProp="children" className="selectField-custom"
            options={[
              { label: "T-shirt", value: "t-shirt" },
              { label: "Shirt", value: "shirt" },
              { label: "Polo Shirt", value: "polo-shirt" },
              { label: "Tank Top", value: "tank-top" },
              { label: "Blouse", value: "blouse" },
              { label: "Sweater", value: "sweater" },
              { label: "Hoodie", value: "hoodie" },
              { label: "Crop Top", value: "crop-top" },
              { label: "Jeans", value: "jeans" },
              { label: "Pants", value: "pants" },
              { label: "Shorts", value: "shorts" },
              { label: "Leggings", value: "leggings" },
              { label: "Skirt", value: "skirt" },
              { label: "Cargo Pants", value: "cargo-pants" },
              { label: "Chinos", value: "chinos" },
              { label: "Joggers", value: "joggers" },
              { label: "Jacket", value: "jacket" },
              { label: "Coat", value: "coat" },
              { label: "Blazer", value: "blazer" },
              { label: "Cardigan", value: "cardigan" },
              { label: "Trench Coat", value: "trench-coat" },
              { label: "Windbreaker", value: "windbreaker" },
              { label: "Puffer Jacket", value: "puffer-jacket" },
              { label: "Denim Jacket", value: "denim-jacket" },
              { label: "Dress", value: "dress" },
              { label: "Casual Frock", value: "casual-frock" },
              { label: "Party Frock", value: "party-frock" },
              { label: "Evening Frock", value: "evening-frock" },
              { label: "Kids Frock", value: "kids-frock" },
              { label: "Long Frock", value: "long-frock" },
              { label: "Short Frock", value: "short-frock" },
              { label: "Floral Frock", value: "floral-frock" },
              { label: "A-Line Frock", value: "a-line-frock" },
              { label: "Maxi Frock", value: "maxi-frock" },
              { label: "Mini Frock", value: "mini-frock" },
              { label: "Evening Gown", value: "evening-gown" },
              { label: "Sundress", value: "sundress" },
              { label: "Jumpsuit", value: "jumpsuit" },
              { label: "Suit", value: "suit" },
              { label: "Overalls", value: "overalls" },
              { label: "Sports Bra", value: "sports-bra" },
              { label: "Tracksuit", value: "tracksuit" },
              { label: "Yoga Pants", value: "yoga-pants" },
              { label: "Athletic Shorts", value: "athletic-shorts" },
              { label: "Compression Shirt", value: "compression-shirt" },
              { label: "Sneakers", value: "sneakers" },
              { label: "Boots", value: "boots" },
              { label: "Sandals", value: "sandals" },
              { label: "Flip Flops", value: "flip-flops" },
              { label: "Loafers", value: "loafers" },
              { label: "Heels", value: "heels" },
              { label: "Dress Shoes", value: "dress-shoes" },
              { label: "Slippers", value: "slippers" },
              { label: "Hat", value: "hat" },
              { label: "Cap", value: "cap" },
              { label: "Scarf", value: "scarf" },
              { label: "Gloves", value: "gloves" },
              { label: "Belt", value: "belt" },
              { label: "Tie", value: "tie" },
              { label: "Sunglasses", value: "sunglasses" },
              { label: "Watch", value: "watch" },
            ]}
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onSearch={(value) => {
              if (value && !value.trim()) return;
              const exists = (document.querySelectorAll('.ant-select-item-option-content') as NodeListOf<HTMLElement>);
              let found = false;
              exists.forEach(el => {
                if (el.innerText.toLowerCase() === value.toLowerCase()) {
                  found = true;
                }
              });
              if (!found) {
                const newOption = document.createElement('div');
                newOption.className = 'ant-select-item ant-select-item-option';
                newOption.setAttribute('role', 'option');
                newOption.setAttribute('unselectable', 'on');
                newOption.innerText = value;
                document.querySelector('.ant-select-item-option-group')?.appendChild(newOption);
              }
            }
            }
          ></Select>
        </Form.Item>
          </Col>
          <Col span={12}>
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
          </Col>
          <Col span={12}>
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
                  </Col>
          <Col span={12}>
        <Form.Item name="wholesalePrice" label="Wholesale Price" rules={[{ required: true, message: "Required" }]}>
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 10.00" />
        </Form.Item>
                  </Col>
          <Col span={12}>
        <Form.Item name="prisedPrice" label="Prised Price">
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 15.00" />
        </Form.Item>
                  </Col>
          <Col span={12}>
        <Form.Item name="salePrice" label="Sale Price">
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 20.00" />
        </Form.Item>
                  </Col>
          <Col span={12}>
        <Form.Item name="discountedPrice" label="Discounted Price">
          <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g. 18.00" />
        </Form.Item>
                  </Col>
          <Col span={12}>
        <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Required" }]}>
          <InputNumber min={1} style={{ width: "100%" }} placeholder="e.g. 50" />
        </Form.Item>
        </Col>
          <Col span={12}>
        <Form.Item name="stockStatus" label="Stock Status" rules={[{ required: true, message: "Required" }]}>
          <Select placeholder="Select Stock Status" bordered={false} className="selectField-custom" options={[
            { label: "In Stock", value: "IN_STOCK" },
            { label: "Sold Out", value: "SOLD_OUT" },
            { label: "Low Stock", value: "LOW_STOCK" }
          ]} />
        </Form.Item>
                  </Col>
          <Col span={12}>
        <Form.Item
          name="capitalRecordId"
          label="Capital Record"
          rules={[{ required: true, message: "Required" }]}
          getValueFromEvent={v => v}
          valuePropName="value"
        >
          <CapitalRecordSelect />
        </Form.Item>
                  </Col>
        </Row>
        <Form.Item>
          <Space style={{gap: 10, marginTop: 20}}>
            <Button type="primary" htmlType="submit" className="main-button" loading={loading}>Add Clothes</Button>
            <Button className="cancel-button" onClick={() => router.back()} disabled={loading}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
      <ToastContainer />
    </div>
  );
}
