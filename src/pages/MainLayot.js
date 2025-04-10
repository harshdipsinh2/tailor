// src/layout/MainLayout.jsx
import React, { useState } from "react";
import {
  UserOutlined,
  TeamOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  LogoutOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb, theme, Avatar, Dropdown, Space } from "antd";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import image from "../asset/maschine.jpeg";
import "../Css/Navbar.css";

const { Header, Sider, Content, Footer } = Layout;

// Helper for menu item
const getItem = (label, key, icon, children, type) => ({
  key,
  icon,
  children,
  label,
  type,
});

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate(); // ✅ Correctly inside component
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // ✅ Single, properly placed logout handler
  const handleLogout = () => {
    localStorage.clear(); // Clear session
    navigate("/login");   // Redirect using React Router
  };

  const items = [
    getItem(<Link to="/dashboard">Dashboard</Link>, "1", <PieChartOutlined />),
    getItem("Customer Management", "sub1", <UserOutlined />, [
      getItem(<Link to="/customer-registration">Registration</Link>, "2"),
      getItem(<Link to="/customers">Customers</Link>, "3"),
      getItem(<Link to="/measurements">Measurements</Link>, "4"),
    ]),
    getItem("Product Management", "sub2", <AppstoreOutlined />, [
      getItem(<Link to="/products">Products</Link>, "5"),
      getItem(<Link to="/fabrics">Fabrics</Link>, "6"),
    ]),
    getItem("Order Management", "sub3", <OrderedListOutlined />, [
      getItem(<Link to="/orders">Orders</Link>, "7"),
      getItem(<Link to="/completed-orders">Completed Orders</Link>, "8"),
    ]),
    getItem(<Link to="/employees">Employees</Link>, "9", <TeamOutlined />),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={image}
            height={40}
            alt="Logo"
            style={{ borderRadius: "50%" }}
          />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ paddingLeft: 20, fontSize: 18, fontWeight: "bold" }}
          >
            Tailor Management System
          </span>

          <div style={{ paddingRight: 20 }}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    label: (
                      <span onClick={handleLogout}>
                        <LogoutOutlined style={{ marginRight: 10 }} />
                        Logout
                      </span>
                    ),
                  },
                ],
              }}
              placement="bottomRight"
              arrow
            >
              <Space style={{ cursor: "pointer" }}>
                <Avatar icon={<UserOutlined />} />
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            <Breadcrumb.Item>
              {location.pathname.split("/")[1] || "Dashboard"}
            </Breadcrumb.Item>
          </Breadcrumb>

          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Tailor Management System ©{new Date().getFullYear()} Created by You
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;