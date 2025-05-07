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
import { Layout, Menu, Breadcrumb, theme, Avatar, Dropdown, Space, message } from "antd";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import image from "../asset/maschine.jpeg";
import "../Css/Navbar.css";
import { AuthContext } from "../Contexts/AuthContext";

const { Header, Sider, Content } = Layout;
const token = AuthContext.token;
const role = AuthContext.role;
console.log(role);

console.log(token);

// Helper to generate menu item
const getItem = (label, key, icon, children, type) => ({
  key,
  icon,
  children,
  label: typeof label === 'object' ? 
    React.cloneElement(label, { style: { textDecoration: 'none' } }) : 
    label,
  type,
});

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    try {
      localStorage.clear(); // Clear all localStorage items
      message.success('Logged out successfully');
      navigate('/login', { replace: true }); // Use replace to prevent going back
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to logout. Please try again.');
    }
  };

  const role = localStorage.getItem("role");
  console.log(role);
  

  // Role-based sidebar menu items
  let items = [getItem(<Link to="/dashboard">Dashboard</Link>, "1", <PieChartOutlined />)];

  if (role === "Admin" || role === "Manager") {
    items.push(
      getItem("Customer Management", "sub1", <UserOutlined />, [
        getItem(<Link to="/customer-registration">Registration</Link>, "2"),
        getItem(<Link to="/customers">Customers</Link>, "3"),
        getItem(<Link to="/measurements">Measurements</Link>, "4"),
      ]),
      getItem("Product Management", "sub2", <AppstoreOutlined />, [
        getItem(<Link to="/products">Products</Link>, "5"),
        getItem(<Link to="/fabrics">Fabrics</Link>, "6"),
        getItem(<Link to="/FabricStock">Fabric Stock</Link>, "7"),
      ]),
      getItem("Order Management", "sub3", <OrderedListOutlined />, [
        getItem(<Link to="/orders">Orders</Link>, "8"),
        getItem(<Link to="/completed-orders">Completed Orders</Link>, "9"),
      ]),
      getItem(<Link to="/employees">Employees</Link>, "10", ),
      getItem(<Link to="/Calendar">Calendar</Link>, "11", <OrderedListOutlined />),
    );
  } else if (role === "Tailor") {
    items.push(
      getItem("Measurements", "sub1", <UserOutlined />, [
        getItem(<Link to="/measurements">Measurements</Link>, "4"),
      ]),
      getItem("Product Management", "sub2", <AppstoreOutlined />, [
        getItem(<Link to="/products">Products</Link>, "5"),
        getItem(<Link to="/fabrics">Fabrics</Link>, "6"),
      ]),
      getItem("Order Management", "sub3", <OrderedListOutlined />, [
        getItem(<Link to="/orders">Orders</Link>, "8"),
      ])
    );
  }

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
            background: "linear-gradient(90deg, #2b5876 0%, #4e4376 100%)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#fff",
          }}
        >
          <span
            style={{ paddingLeft: 20, fontSize: 18, fontWeight: "bold" }}
          >
            Tailor Management System ✃
          </span>

          <div style={{ paddingRight: 20 }}>
            <Dropdown
              menu={{
                items: [
                  {
                    key: "logout",
                    label: (
                      <span onClick={handleLogout} style={{ color: '#ff4d4f' }}>
                        <LogoutOutlined style={{ marginRight: 8 }} />
                        Logout
                      </span>
                    ),
                    danger: true
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
      </Layout>
    </Layout>
  );
};

export default MainLayout;
