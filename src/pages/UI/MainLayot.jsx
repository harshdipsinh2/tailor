import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  PieChartOutlined,
  AppstoreOutlined,
  OrderedListOutlined,
  LogoutOutlined,
  DownOutlined,
  TeamOutlined,
  CalendarOutlined,
  MessageOutlined, // Add this import
  HomeOutlined 
} from "@ant-design/icons";
import { Layout, Menu, Breadcrumb, theme, Avatar, Dropdown, Space, message, 
  // Badge, Popover, Tag // Comment out
} from "antd";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import image from "../../asset/maschine.jpeg";
import "../../Css/Navbar.css";
import { AuthContext } from "../../Contexts/AuthContext";
import { getRejectedOrders, getAllOrders } from '../../api/AdminApi';
import dayjs from 'dayjs';
import { Popconfirm } from 'antd';

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
  // Add useNavigate hook at the top of component
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  // const [notifications, setNotifications] = useState([]);
  // const [messageCount, setMessageCount] = useState(0);
  // const [messageVisible, setMessageVisible] = useState(false);
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
  if (role === "SuperAdmin") {
    // SuperAdmin sees all menu items
    items.push(
      // Customer Management section
      getItem("Customer Management", "sub1", <UserOutlined />, [
        getItem(<Link to="/customer-registration">Registration</Link>, "2"),
        getItem(<Link to="/customers">Customers</Link>, "3"),
      ]),
      // Product Management section
      getItem("Product Management", "sub2", <AppstoreOutlined />, [
        getItem(<Link to="/products">Products</Link>, "5"),
        getItem(<Link to="/fabrics">Fabrics</Link>, "6"),
      ]),
      // Order Management section
      getItem("Order Management", "sub3", <OrderedListOutlined />, [
        getItem(<Link to="/orders">Orders</Link>, "8"),
        getItem(<Link to="/completed-orders">Completed Orders</Link>, "9"),
 
      ]),
      // Additional management options
      getItem(<Link to="/employees">Employees</Link>, "10", <TeamOutlined />),
      getItem(<Link to="/Calendar">Calendar</Link>, "11", <CalendarOutlined />),
      getItem(<Link to="/sms-history">SMS History</Link>, "13", <MessageOutlined />),
    );
  } else if (role === "Admin" ) {
    // Admin and Manager see all menu items
    items.push(
      // Customer Management section
      getItem("Customer Management", "sub1", <UserOutlined />, [
        getItem(<Link to="/customer-registration">Registration</Link>, "2"),
        getItem(<Link to="/customers">Customers</Link>, "3"),
      ]),
      // Product Management section
      getItem("Product Management", "sub2", <AppstoreOutlined />, [
        getItem(<Link to="/products">Products</Link>, "5"),
        getItem(<Link to="/fabrics">Fabrics</Link>, "6"),
        getItem(<Link to="/FabricStock">Fabric Stock Management</Link>, "7"),
      ]),
      // Order Management section
      getItem("Order Management", "sub3", <OrderedListOutlined />, [
        getItem(<Link to="/orders">Orders</Link>, "8"),
        getItem(<Link to="/completed-orders">Completed Orders</Link>, "9"),
        getItem(<Link to="/rejected-orders">Rejected Orders</Link>, "12"),
      ]),
      //plan
      getItem(<Link to="/Plan">Plan</Link>, "14", <PieChartOutlined />),  

      //branch
        getItem(<Link to="/branch">Branch</Link>, "15"),


      // Additional management options
      getItem(<Link to="/employees">Employees</Link>, "10", <TeamOutlined />),
      getItem(<Link to="/Calendar">Calendar</Link>, "11", <CalendarOutlined />),
      // Add this new item for SMS History
      // getItem(<Link to="/sms-history">SMS History</Link>, "13", <MessageOutlined />),
    );
  } else if (role === "Manager") {
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
        getItem(<Link to="/FabricStock">Fabric Stock Management</Link>, "7"),
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
      // Add this new item for SMS History
      // getItem(<Link to="/sms-history">SMS History</Link>, "13", <MessageOutlined />),
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

  // Comment out the fetchNotifications function
  /*
  const fetchNotifications = async () => {
    try {
      let notificationsList = [];

      // Get all orders for pending approvals (for tailors)
      const allOrders = await getAllOrders();
      const pendingOrders = allOrders.filter(order => 
        order.ApprovalStatus === 'Pending' && 
        order.AssignedToName === localStorage.getItem('userName')
      );

      // Add pending orders to notifications
      pendingOrders.forEach(order => {
        notificationsList.push({
          id: `pending-${order.OrderID}`,
          title: 'New Order Assignment',
          content: `You have a new order for ${order.ProductName} from ${order.CustomerName}`,
          time: dayjs(order.OrderDate).fromNow(),
          type: 'pending'
        });
      });

      // Get rejected orders (for managers)
      if (role === 'Manager' || role === 'Admin') {
        const rejectedOrders = await getRejectedOrders();
        rejectedOrders.forEach(order => {
          notificationsList.push({
            id: `rejected-${order.OrderID}`,
            title: 'Order Rejected',
            content: `Order #${order.OrderID} was rejected by ${order.AssignedToName}. Reason: ${order.RejectionReason}`,
            time: dayjs(order.OrderDate).fromNow(),
            type: 'rejected'
          });
        });
      }

      setNotifications(notificationsList);
      setMessageCount(notificationsList.length);

      // Show popup for new notifications
      if (notificationsList.length > 0) {
        message.info({
          content: 'You have new messages',
          duration: 3
        });
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  */

  // Comment out the useEffect for notifications
  /*
  useEffect(() => {
    fetchNotifications();
    // Fetch notifications every 5 minutes
    const interval = setInterval(fetchNotifications, 300000);
    return () => clearInterval(interval);
  }, []);
  */

  // Comment out the MessageContent component
  /*
  const MessageContent = () => (
    <div style={{ width: 300 }}>
      <div style={{ 
        borderBottom: '1px solid #f0f0f0', 
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontWeight: 'bold' }}>Notifications</span>
        <a onClick={fetchNotifications} style={{ fontSize: '12px', cursor: 'pointer' }}>
          Refresh
        </a>
      </div>
      <div style={{ maxHeight: 400, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
            No new notifications
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #f0f0f0',
                cursor: 'pointer',
                backgroundColor: notification.type === 'rejected' ? '#fff2f0' : 
                                notification.type === 'pending' ? '#e6f7ff' : 'white'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{notification.title}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>{notification.content}</div>
              <div style={{ 
                fontSize: '11px', 
                color: '#999', 
                marginTop: 4,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>{notification.time}</span>
                <Tag color={notification.type === 'rejected' ? 'red' : 'blue'}>
                  {notification.type === 'rejected' ? 'Rejected' : 'Pending'}
                </Tag>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
  */

  // Add handle home navigation function
  const handleHomeNavigation = () => {
    try {
      // Clear all authentication data
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("isVerified");
      
      message.success('Successfully logged out');
      navigate('/home');
    } catch (error) {
      console.error('Navigation error:', error);
      message.error('Failed to navigate');
    }
  };

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
            cursor: "pointer", // Add cursor pointer to indicate clickable
          }}
          onClick={() => window.location.reload()} // Add onClick to refresh page
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
          {/* Application Title and Home Icon */}
          <div style={{ 
            paddingLeft: 20, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px' 
          }}>
            <span style={{ fontSize: 18, fontWeight: "bold" }}>
              Tailor Management System ✃
            </span>
          </div>

          {/* User Profile Section */}
          <div style={{ paddingRight: 20, display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Home Icon */}
            <Popconfirm
              title="Leave Dashboard"
              description="Are you sure you want to leave? This will log you out."
              onConfirm={handleHomeNavigation}
              okText="Yes"
              cancelText="No"
              placement="bottomLeft"
            >
              <HomeOutlined 
                style={{ 
                  fontSize: '20px', 
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'color 0.3s',
                  '&:hover': {
                    color: '#1890ff'
                  }
                }} 
              />
            </Popconfirm>

            {/* Existing Dropdown remains unchanged */}
            <Dropdown
              menu={{
                items: [
                  // Role display
                  {
                    key: "role",
                    label: (
                      <span style={{ color: '#1890ff' }}>
                        <TeamOutlined style={{ marginRight: 8 }} />
                        Role: {role || ''}
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