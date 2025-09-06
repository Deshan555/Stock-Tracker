"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Table, Button, Space, Tag, Statistic, Card, Popconfirm, Drawer, Row, Col, Select } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import AddClothesPage from "../new/page";

import UpdateClothesDrawer from "../UpdateClothesDrawer";

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

export default function ClothesByCapitalPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const capitalRecordId = searchParams.get("capitalRecordId");
    const [clothes, setClothes] = useState<Clothes[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [patternCodeFilter, setPatternCodeFilter] = useState<string | undefined>(undefined);
    const [category, setCategory] = useState<string | undefined>(undefined);
    const [stockStatus, setStockStatus] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<any>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateDrawer, setShowUpdateDrawer] = useState({
        drawerOpen: false,
        id: '',
        initialStockStatus: undefined as string | undefined,
        initialSalePrice: undefined as number | undefined,
        initialDiscountedPrice: undefined as number | undefined,
        initialPrisedPrice: undefined as number | undefined,
    });

    useEffect(() => {
        if (!capitalRecordId) return;
        setLoading(true);
        fetch(`/api/clothes/by-capital/${capitalRecordId}`)
            .then(res => res.json())
            .then(data => setClothes(data))
            .catch(() => setClothes([]))
            .finally(() => setLoading(false));
    }, [capitalRecordId]);

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
            const matchesPatternCode = !patternCodeFilter || item.patternCode === patternCodeFilter;
            return matchesSearch && matchesCategory && matchesStock && matchesDate && matchesPatternCode;
        });
    }, [clothes, search, category, stockStatus, dateRange, patternCodeFilter]);

    // Table columns
    const columns: ColumnsType<Clothes> = [
        {
            title: "Pattern Code",
            dataIndex: "patternCode",
            key: "patternCode",
            fixed: 'left',
            width: 120,
            filters: Array.from(new Set(clothes.map(c => c.patternCode).filter((code): code is string => Boolean(code)))).map(code => ({ text: code, value: code })),
            onFilter: (value, record) => {
                if (!value) return true;
                return record.patternCode === value;
            },
        },
        { title: "Name", dataIndex: "name", key: "name", width: 140 },
        {
            title: "Category", dataIndex: "category", key: "category", filters: [
                { text: "Men", value: "men" },
                { text: "Women", value: "women" },
                { text: "Kids", value: "kids" },
                { text: "Accessories", value: "accessories" },
                { text: "Others", value: "others" },
            ],
            onFilter: (value, record) => record.category === value,
            width: 120
        },
        // { title: "Color", dataIndex: "color", key: "color", width: 100 },
        {
            title: "Stock Status", dataIndex: "stockStatus", key: "stockStatus", render: (status) => {
                if (!status) return '-';
                let color = status === 'IN_STOCK' ? 'green' : status === 'LOW_STOCK' ? 'orange' : 'red';
                return <Tag
                    bordered={false}
                    style={{ textTransform: 'capitalize', borderRadius: 5, padding: '0 8px', fontWeight: '500', fontSize: 11 }}
                    color={color}>{status.replace('_', ' ')}</Tag>;
            }, width: 120
        },
        { title: "Wholesale", dataIndex: "wholesalePrice", key: "wholesalePrice", render: v => `LKR ${v?.toFixed(2)}`, width: 110 },
        { title: "Prised", dataIndex: "prisedPrice", key: "prisedPrice", render: v => v ? `LKR ${v?.toFixed(2)}` : '-', width: 110 },
        { title: "Sale", dataIndex: "salePrice", key: "salePrice", render: v => v ? `LKR ${v?.toFixed(2)}` : '-', width: 110 },
        { title: "Discounted", dataIndex: "discountedPrice", key: "discountedPrice", render: v => v ? `LKR ${v?.toFixed(2)}` : '-', width: 120 },
        // { title: "Qty", dataIndex: "quantity", key: "quantity", width: 80 },
        // { title: "Capital", dataIndex: "capitalRecordId", key: "capitalRecordId", width: 120 },
        { title: "Created", dataIndex: "createdAt", key: "createdAt", render: v => v ? dayjs(v).format('YYYY-MM-DD') : '-', width: 120 },
        {
            title: "Actions", key: "actions", fixed: 'right', width: 120, render: (_, item) => (
                <Space>
                    <Button
                        type="link"
                        className="text-blue-600"
                        style={{ padding: 0 }}
                        onClick={() => setShowUpdateDrawer({
                            drawerOpen: true,
                            id: item._id,
                            initialStockStatus: item.stockStatus,
                            initialSalePrice: item.salePrice,
                            initialDiscountedPrice: item.discountedPrice,
                            initialPrisedPrice: item.prisedPrice,
                        })}
                    >
                        Edit
                    </Button>
                    <Popconfirm title="Delete this item?" onConfirm={() => handleDelete(item._id)} okText="Yes" cancelText="No">
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </Space>
            )
        },
    ];

    // Summary
    const totalQty = filteredClothes.reduce((sum, c) => sum + (c.quantity || 0), 0);
    const totalWholesale = filteredClothes.reduce((sum, c) => sum + (c.wholesalePrice || 0), 0);
    const totalSale = filteredClothes.reduce((sum, c) => sum + (c.salePrice || 0), 0);
    const soldItemCount = filteredClothes.filter(c => c.stockStatus === 'SOLD_OUT').length;
    const existingCount = filteredClothes.filter(c => c.stockStatus !== 'SOLD_OUT').length;
    const netProfit = filteredClothes
        .filter(c => c.stockStatus === 'SOLD_OUT')
        .reduce((sum, c) => sum + ((c.salePrice || 0) - (c.wholesalePrice || 0)), 0);

    const expectedProfit = filteredClothes.reduce((sum, c) => sum + (c.prisedPrice || 0), 0);

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    background: '#f9f9f9',
                    paddingBottom: 8,
                }}
            >
                <h2 className="text-xl font-bold">Clothes Inventory</h2>
                <Button
                    className="main-button"
                    onClick={() => setShowAddModal(true)}
                    type="primary"
                >
                    Add Item(s)
                </Button>
            </div>
            {/* <Card style={{ marginBottom: 16 }}>
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
      </Card> */}
            <Card style={{ marginBottom: 16, borderRadius: 10, width: '100%' }}>
                <Row style={{ width: '100%' }} gutter={16}>
                    <Col style={{ width: '16.6%' }}>
                        <Statistic
                            title={<span>Sold Item Count<br /><span style={{ fontSize: 12, color: '#888' }}>({filteredClothes.length > 0 ? ((soldItemCount / filteredClothes.length) * 100).toFixed(1) : 0}% of total)</span></span>}
                            value={soldItemCount}
                        />
                    </Col>
                    <Col style={{ width: '16.6%' }}>
                        <Statistic
                            title={<span>Existing Count<br /><span style={{ fontSize: 12, color: '#888' }}>({filteredClothes.length > 0 ? ((existingCount / filteredClothes.length) * 100).toFixed(1) : 0}% of total)</span></span>}
                            value={existingCount}
                        />
                    </Col>
                    <Col style={{ width: '16.6%' }}>
                        <Statistic title="Total Wholesale" value={totalWholesale} precision={2} prefix="LKR" valueStyle={{ color: '#faad14' }}/>
                    </Col>
                    <Col style={{ width: '16.6%' }}>
                        <Statistic title="Total Sale" value={totalSale} precision={2} prefix="LKR" />
                    </Col>
                    <Col style={{ width: '16.6%' }}>
                        <Statistic
                            title={<span>Expected Profit<br /><span style={{ fontSize: 12, color: '#888' }}>{expectedProfit > 0 && totalSale > 0 ? ((expectedProfit / totalSale) * 100).toFixed(1) : 0}% of sales</span></span>}
                            value={expectedProfit}
                            precision={2}
                            prefix="LKR"
                            valueStyle={{ color: '#1d39c4' }}
                        />
                    </Col>
                    <Col style={{ width: '16.6%' }}>
                        <Statistic
                            title={<span>Net Profit (Sold)<br /><span style={{ fontSize: 12, color: '#888' }}>{totalSale > 0 ? ((netProfit / totalSale) * 100).toFixed(1) : 0}% margin</span></span>}
                            value={netProfit}
                            precision={2}
                            prefix="LKR"
                            valueStyle={{ color: netProfit >= 0 ? '#3f8600' : '#cf1322' }}
                        />
                    </Col>
                </Row>
            </Card>
            <Table
                className="table-striped-rows"
                columns={columns}
                dataSource={filteredClothes}
                rowKey="_id"
                size="small"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: 1400 }}
            />

            <Drawer
                destroyOnClose={true}
                open={showAddModal} onClose={() => setShowAddModal(false)} width={720} title="Add Clothes">
                <AddClothesPage onClose={() => {
                    setShowAddModal(false); fetch(`/api/clothes/by-capital/${capitalRecordId}`)
                        .then(res => res.json())
                        .then(data => setClothes(data))
                        .catch(() => setClothes([]))
                        .finally(() => setLoading(false));
                }} />
            </Drawer>

            <UpdateClothesDrawer
                id={showUpdateDrawer.id}
                initialStockStatus={showUpdateDrawer.initialStockStatus}
                initialSalePrice={showUpdateDrawer.initialSalePrice}
                initialDiscountedPrice={showUpdateDrawer.initialDiscountedPrice}
                initialPrisedPrice={showUpdateDrawer.initialPrisedPrice}
                open={showUpdateDrawer.drawerOpen}
                onClose={() => setShowUpdateDrawer({
                    drawerOpen: false,
                    id: '',
                    initialStockStatus: undefined,
                    initialSalePrice: undefined,
                    initialDiscountedPrice: undefined,
                    initialPrisedPrice: undefined,
                })}
                onUpdated={() => {
                    fetch(`/api/clothes/by-capital/${capitalRecordId}`)
                        .then(res => res.json())
                        .then(data => setClothes(data))
                        .catch(() => setClothes([]))
                        .finally(() => setLoading(false));
                    setShowUpdateDrawer({
                        drawerOpen: false,
                        id: '',
                        initialStockStatus: undefined,
                        initialSalePrice: undefined,
                        initialDiscountedPrice: undefined,
                        initialPrisedPrice: undefined,
                    });
                }}
            />

            {error && <div className="text-red-500">{error}</div>}
        </div>
    );
}
