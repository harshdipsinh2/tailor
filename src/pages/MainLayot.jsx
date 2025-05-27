import React, { useState } from "react";
import {
  UserOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  LogoutOutlined,
  DownOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb, theme, Avatar, Dropdown, Space, message, Badge, Popover } from "antd";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import image from "../asset/maschine.jpeg";
import "../Css/Navbar.css";
import { AuthContext } from "../Contexts/AuthContext";

// Destructure Layout components
const { Header, Sider, Content } = Layout;

// Get authentication data from context
const token = AuthContext.token;
const role = AuthContext.role;

// Helper function to create menu items with consistent structure
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
  // Hooks for navigation and state management
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [messageCount, setMessageCount] = useState(3); // Example count
  const [messageVisible, setMessageVisible] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Sample message data
  const messages = [
    {
      id: 1,
      title: "New Order",
      content: "You have received a new order",
      time: "5 mins ago"
    },
    {
      id: 2,
      title: "Order Update",
      content: "Order #123 has been completed",
      time: "1 hour ago"
    }
  ];

  // Handle user logout
  const handleLogout = () => {
    try {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isVerified");
      
      message.success('Logged out successfully');
      // Force navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Failed to logout');
    }
  };

  // Get user role from local storage
  const role = localStorage.getItem("role");

  let items = [getItem(<Link to="/dashboard">Dashboard</Link>, "1", <PieChartOutlined />)];

  // Add role-specific menu items
  if (role === "Admin" || role === "Manager") {
    // Admin and Manager see all menu items
    items.push(
      // Customer Management section
      getItem("Customer Management", "sub1", <UserOutlined />, [
        getItem(<Link to="/customer-registration">Registration</Link>, "2"),
        getItem(<Link to="/customers">Customers</Link>, "3"),
        getItem(<Link to="/measurements">Measurements</Link>, "4"),
      ]),
      // Product Management section
      getItem("Product Management", "sub2", <AppstoreOutlined />, [
        getItem(<Link to="/products">Products</Link>, "5"),
        getItem(<Link to="/fabrics">Fabrics</Link>, "6"),
        getItem(<Link to="/FabricStock">Fabric Stock</Link>, "7"),
      ]),
      // Order Management section
      getItem("Order Management", "sub3", <OrderedListOutlined />, [
        getItem(<Link to="/orders">Orders</Link>, "8"),
        getItem(<Link to="/completed-orders">Completed Orders</Link>, "9"),
        getItem(<Link to="/rejected-orders">Rejected Orders</Link>, "12"),
      ]),
      // Additional management options
      getItem(<Link to="/employees">Employees</Link>, "10", <TeamOutlined />),
      getItem(<Link to="/Calendar">Calendar</Link>, "11", <CalendarOutlined />),
    );
  } else if (role === "Tailor") {
    // Tailor sees limited menu items
    items.push(
      // Tailor-specific sections
      getItem("Measurements", "sub1", <UserOutlined />, [
        getItem(<Link to="/measurements">Measurements</Link>, "4"),
      ]),
      getItem("Product Management", "sub2", <AppstoreOutlined />, [
        getItem(<Link to="/products">Products</Link>, "5"),
        getItem(<Link to="/fabrics">Fabrics</Link>, "6"),
      ]),
      getItem("Order Management", "sub3", <OrderedListOutlined />, [
        getItem(<Link to="/orders">Orders</Link>, "8"),
        getItem(<Link to="/manage-orders">Manage Orders</Link>, "9"), // Verify this line
      ])
    );
  }

  // Message content component
  const MessageContent = () => (
    <div style={{ width: 300 }}>
      <div style={{ 
        borderBottom: '1px solid #f0f0f0', 
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold' }}>Messages</span>
        <a href="#" style={{ fontSize: '12px' }}>Mark all as read</a>
      </div>
      <div style={{ maxHeight: 300, overflow: 'auto' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f0f0f0',
            cursor: 'pointer',
            ':hover': { backgroundColor: '#f5f5f5' }
          }}>
            <div style={{ fontWeight: 'bold' }}>{msg.title}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{msg.content}</div>
            <div style={{ fontSize: '11px', color: '#999', marginTop: 4 }}>{msg.time}</div>
          </div>
        ))}
      </div>
      <div style={{ 
        padding: '8px 16px', 
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center' 
      }}>
        <Link to="/messages">View All Messages</Link>
      </div>
    </div>
  );

  // Main layout structure
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Collapsible Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* Logo container */}
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
        {/* Navigation Menu */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={items}
        />
      </Sider>

      {/* Main Content Area */}
      <Layout>
        {/* Header with user profile */}
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
          {/* Application Title */}
          <span style={{ paddingLeft: 20, fontSize: 18, fontWeight: "bold" }}>
            Tailor Management System ✃
          </span>

          {/* User Profile Section */}
          <div style={{ paddingRight: 20, display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Message Icon */}
            <Popover
              content={<MessageContent />}
              title={null}
              trigger="click"
              open={messageVisible}
              onOpenChange={setMessageVisible}
              placement="bottomRight"
              arrow
            >
              <Badge count={messageCount} size="small">
                <MessageOutlined 
                  style={{ 
                    fontSize: '20px', 
                    color: '#fff',
                    cursor: 'pointer'
                  }} 
                />
              </Badge>
            </Popover>

            {/* Existing Dropdown */}
            <Dropdown
              menu={{
                items: [
                  // Role display
                  {
                    key: "role",
                    label: (
                      <span style={{ color: '#1890ff' }}>
                        <TeamOutlined style={{ marginRight: 8 }} />
                        Role: {role || 'N/A'}
                      </span>
                    ),
                    disabled: true
                  },
                  { type: 'divider' },
                  // Logout option
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
                <span style={{ color: '#fff' }}>{role || 'User'}</span>
                <DownOutlined />
              </Space>
            </Dropdown>
          </div>
        </Header>

        {/* Main Content */}
        <Content style={{ margin: "0 16px" }}>


          {/* Content Container */}
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