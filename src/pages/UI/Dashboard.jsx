import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaTshirt,
  FaBoxes,
  FaClipboardList,
  FaUserTie,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
} from "react-icons/fa";
import "../../Css/Dashboard.css";
import { getSummary, getAllOrders, getRevenue } from "../../api/AdminApi";

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

  useEffect(() => {
const fetchData = async () => {
  try {
    const [summaryResponse, ordersData, revenueData] = await Promise.all([
      getSummary(),
      getAllOrders(),
      getRevenue(),
    ]);

    console.log("Summary Response:", summaryResponse);
    
    // Safely extract summary data
    const summaryData = summaryResponse?.[0] || {};
    console.log("Summary Data:", summaryData);

    const pendingOrdersCount = ordersData.filter(
      (order) =>
        (order.OrderStatus || order.orderStatus)?.toLowerCase() === "pending"
    ).length;

    const completedOrdersCount = ordersData.filter(
      (order) =>
        (order.OrderStatus || order.orderStatus)?.toLowerCase() === "completed" &&
        (order.PaymentStatus || order.paymentStatus)?.toLowerCase() === "completed"
    ).length;

    setSummary({
      TotalCustomers: summaryData.TotalCustomers || 0,
      TotalOrders: summaryData.TotalOrders || 0,
      TotalEmployees: summaryData.TotalEmployees || 0,
      TotalProducts: summaryData.TotalProducts || 0,
      TotalFabrics: summaryData.TotalFabrics || 0,
      PendingOrders: pendingOrdersCount,
      CompletedOrders: completedOrdersCount,
      TotalRevenue: revenueData || 0,
    });
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
};
    fetchData();
  }, []);

  const role = localStorage.getItem("role");

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
  ].filter((item) => {
    if (role === "Tailor") {
      return item.key !== "revenue" && item.key !== "employees";
    }
    return true;
  });

  return (
    <div className="dashboard">
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
    </div>
  );
};

export default Dashboard;
