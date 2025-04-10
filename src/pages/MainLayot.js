import React from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const MainLayout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role"); // Get role from localStorage

  // Common menu items
  const commonItems = [
    { key: "dashboard", label: "Dashboard" },
  ];

  // Role-based menu items
  const roleBasedItems = {
    Admin: [
      { key: "customers", label: "Customers" },
      { key: "orders", label: "Orders" },
      { key: "products", label: "Products" },
      { key: "measurements", label: "Measurements" },
      { key: "customer-registration", label: "Customer Registration" },
      { key: "fabrics", label: "Fabrics" },
      { key: "employees", label: "Employees" },
      { key: "completed-orders", label: "Completed Orders" },
    ],
    Manager: [
      { key: "customers", label: "Customers" },
      { key: "orders", label: "Orders" },
      { key: "products", label: "Products" },
      { key: "measurements", label: "Measurements" },
      { key: "customer-registration", label: "Customer Registration" },
      { key: "fabrics", label: "Fabrics" },
      { key: "employees", label: "Employees" },
      { key: "completed-orders", label: "Completed Orders" },
    ],
    Tailor: [
      { key: "measurements", label: "Measurements" },
      { key: "products", label: "Products" },
      { key: "fabrics", label: "Fabrics" },
      { key: "completed-orders", label: "Completed Orders" },
      { key: "homepage", label: "Home Page" },

    ],
  };

  const handleMenuClick = ({ key }) => {
    navigate(`/${key}`);
  };

  const menuItems = [...commonItems, ...(roleBasedItems[role] || [])];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.3)",
            color: "#fff",
            textAlign: "center",
            lineHeight: "32px",
          }}
        >
          {role} Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleMenuClick}
          items={menuItems.map((item) => ({
            key: item.key,
            label: item.label,
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
