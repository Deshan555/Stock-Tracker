"use client";
import { Layout, Menu, Button, Drawer } from "antd";
import {
  AppstoreOutlined,
  DollarOutlined,
  ShoppingOutlined,
  BarChartOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";

const { Header, Sider, Content } = Layout;

const menuItems = [
  {
    key: "/dashboard",
    icon: <AppstoreOutlined />,
    label: <Link href="/dashboard">Dashboard</Link>,
  },
  {
    key: "/dashboard/clothes",
    icon: <ShoppingOutlined />,
    label: <Link href="/dashboard/clothes">Clothes</Link>,
  },
  {
    key: "/dashboard/capital-records",
    icon: <DollarOutlined />,
    label: <Link href="/dashboard/capital-records">Capital Records</Link>,
  },
  {
    key: "/dashboard/transactions",
    icon: <BarChartOutlined />,
    label: <Link href="/dashboard/transactions">Transactions</Link>,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0 }}
        width={220}
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["/dashboard"]}
          items={menuItems}
          style={{ height: "100%" }}
          onClick={() => setDrawerOpen(false)}
        />
      </Drawer>
      {/* Desktop Sider */}
      <Sider
        breakpoint="lg"
        collapsedWidth={60}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={220}
        className="hidden lg:block"
        style={{ background: "#fff", borderRight: "1px solid #f0f0f0", transition: 'width 0.2s', height: '100vh', overflow: 'hidden', position: 'fixed', left: 0, top: 0, zIndex: 100 }}
        trigger={null}
      >
        <div className="p-4 text-xl font-bold flex items-center justify-between">
          <span style={{ display: collapsed ? 'none' : 'inline' }}>Fintech Dashboard</span>
          <Button
            icon={<MenuOutlined />}
            type="text"
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            style={{ marginLeft: collapsed ? 0 : 8 }}
          />
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["/dashboard"]}
          items={menuItems}
          style={{ height: 'calc(100vh - 64px)', overflow: 'hidden' }}
          inlineCollapsed={collapsed}
        />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 60 : 220,
          transition: 'margin-left 0.2s',
        }}
      >
        {/* <Header
          style={{ background: "#fff", padding: "0 16px", display: "flex", alignItems: "center", borderBottom: "1px solid #f0f0f0" }}
          className="lg:hidden"
        >
          <Button
            icon={<MenuOutlined />}
            type="text"
            onClick={() => setDrawerOpen(true)}
            style={{ marginRight: 16 }}
          />
          <span className="text-lg font-bold">Fintech Dashboard</span>
        </Header> */}
        <Content style={{ margin: 0, padding: "0 0 0 0", background: "#f9f9f9", minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
