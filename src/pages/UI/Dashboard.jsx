import React, { useEffect, useState } from "react";
import {
  FaUsers, FaTshirt, FaBoxes, FaClipboardList, FaUserTie,
  FaClock, FaMoneyBillWave, FaCheckCircle,
} from "react-icons/fa";
import { Select, Row, Col, message, Spin } from "antd";
import "../../Css/Dashboard.css";

import {
  getAllOrders,
  getAllBranches,
  getAllCustomers,
  getAllProducts,
  getAllFabricTypes,
} from "../../api/AdminApi";
import { getAllUsers } from "../../api/UserApi";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    TotalCustomers: 0,
    TotalOrders: 0,
    TotalEmployees: 0,
    TotalProducts: 0,
    TotalFabrics: 0,
    PendingOrders: 0,
    CompletedOrders: 0,
    TotalRevenue: 0,
  });

  const [branches, setBranches] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [loading, setLoading] = useState(true);

  const role = localStorage.getItem("role");

  const loadBranches = async () => {
    try {
      const data = await getAllBranches();
      setBranches(data || []);

      // Extract unique shops (for SuperAdmin)
      const shops = [
        ...new Map(
          data.map(b => [b.ShopId, { label: b.ShopName, value: b.ShopId }])
        ).values(),
      ];
      setShopOptions(shops);
    } catch (err) {
      message.error("Failed to load branches");
    }
  };

  const fetchSummary = async (shopId, branchId) => {
    try {
      setLoading(true);
      const [orders, customers, employees, products, fabrics] = await Promise.all([
        getAllOrders(shopId, branchId),
        getAllCustomers(shopId, branchId),
        getAllUsers(shopId, branchId),
        getAllProducts(shopId, branchId),
        getAllFabricTypes(shopId, branchId),
      ]);

      const pendingOrders = orders.filter(order =>
        (order.OrderStatus || order.orderStatus)?.toLowerCase() === "pending"
      ).length;

      const completedOrders = orders.filter(order =>
        (order.OrderStatus || order.orderStatus)?.toLowerCase() === "completed" &&
        (order.PaymentStatus || order.paymentStatus)?.toLowerCase() === "completed"
      ).length;

      const totalRevenue = orders
        .filter(order =>
          (order.OrderStatus || order.orderStatus)?.toLowerCase() === "completed" &&
          (order.PaymentStatus || order.paymentStatus)?.toLowerCase() === "completed"
        )
        .reduce((sum, order) => sum + (order.TotalAmount || order.totalAmount || 0), 0);

      setSummary({
        TotalCustomers: customers?.length || 0,
        TotalOrders: orders?.length || 0,
        TotalEmployees: employees?.length || 0,
        TotalProducts: products?.length || 0,
        TotalFabrics: fabrics?.length || 0,
        PendingOrders: pendingOrders,
        CompletedOrders: completedOrders,
        TotalRevenue: totalRevenue,
      });
    } catch (err) {
      message.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      const shopId = parseInt(payload.shopId);
      const branchId = parseInt(payload.branchId);

      if (role === "SuperAdmin") {
        await loadBranches(); // load shop/branch filter
      } else if (role === "Admin") {
        await loadBranches();
        setSelectedShopId(shopId);
        setSelectedBranchId(branchId);
        fetchSummary(shopId, branchId);
      } else {
        // Tailor / Manager
        fetchSummary(shopId, branchId);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (
      (role === "SuperAdmin" && selectedShopId && selectedBranchId) ||
      (role === "Admin" && selectedShopId && selectedBranchId)
    ) {
      fetchSummary(selectedShopId, selectedBranchId);
    }
  }, [selectedShopId, selectedBranchId]);

  const data = [
    {
      key: "revenue",
      title: "Total Revenue",
      value: `₹${summary.TotalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave className="dashboard-icon" />,
      bgColor: "bg-green-light",
    },
    {
      key: "customers",
      title: "Total Customers",
      value: summary.TotalCustomers,
      icon: <FaUsers className="dashboard-icon" />,
      bgColor: "bg-blue-light",
    },
    {
      key: "products",
      title: "Total Products",
      value: summary.TotalProducts,
      icon: <FaTshirt className="dashboard-icon" />,
      bgColor: "bg-yellow-light",
    },
    {
      key: "fabrics",
      title: "Total Fabrics",
      value: summary.TotalFabrics,
      icon: <FaBoxes className="dashboard-icon" />,
      bgColor: "bg-purple-light",
    },
    {
      key: "orders",
      title: "Total Orders",
      value: summary.TotalOrders,
      icon: <FaClipboardList className="dashboard-icon" />,
      bgColor: "bg-orange-light",
    },
    {
      key: "employees",
      title: "Total Employees",
      value: summary.TotalEmployees,
      icon: <FaUserTie className="dashboard-icon" />,
      bgColor: "bg-red-light",
    },
    {
      key: "pending",
      title: "Pending Orders",
      value: summary.PendingOrders,
      icon: <FaClock className="dashboard-icon" />,
      bgColor: "bg-orange-light",
    },
    {
      key: "completed",
      title: "Completed Orders",
      value: summary.CompletedOrders,
      icon: <FaCheckCircle className="dashboard-icon" />,
      bgColor: "bg-green-light",
    },
  ].filter(item => {
    if (role === "Tailor") {
      return item.key !== "revenue" && item.key !== "employees";
    }
    return true;
  });

  return (
    <div className="dashboard">
      {(role === "SuperAdmin" || role === "Admin") && (
        <Row gutter={16} style={{ marginBottom: 16 }}>
          {role === "SuperAdmin" && (
            <Col span={6}>
              <Select
                placeholder="Select Shop"
                options={shopOptions}
                value={selectedShopId}
                onChange={(value) => {
                  setSelectedShopId(value);
                  setSelectedBranchId(null);
                }}
                allowClear
                style={{ width: "100%" }}
              />
            </Col>
          )}
          <Col span={6}>
            <Select
              placeholder="Select Branch"
              value={selectedBranchId}
              onChange={setSelectedBranchId}
              allowClear
              disabled={!selectedShopId && role === "SuperAdmin"}
              style={{ width: "100%" }}
            >
              {branches
                .filter(branch =>
                  role === "SuperAdmin"
                    ? branch.ShopId === selectedShopId
                    : true
                )
                .map(branch => (
                  <Select.Option key={branch.BranchId} value={branch.BranchId}>
                    {branch.BranchName}
                  </Select.Option>
                ))}
            </Select>
          </Col>
        </Row>
      )}

      <Spin spinning={loading}>
        <div className="dashboard-cards">
          {data.map((item) => (
            <div key={item.key} className={`dashboard-card ${item.bgColor}`}>
              <div className="icon-container">{item.icon}</div>
              <div className="dashboard-info">
                <h2>{item.title}</h2>
                <p>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default Dashboard;
