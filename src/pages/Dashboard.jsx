import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaTshirt,
  FaBoxes,
  FaClipboardList,
  FaUserTie,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle, // Add this import for completed orders icon
} from "react-icons/fa";
import "../Css/Dashboard.css";
import { getSummary, getAllOrders, getRevenue } from "../api/AdminApi";

const Dashboard = () => {
  const [summary, setSummary] = useState({
    TotalCustomers: 0,
    TotalOrders: 0,
    TotalUsers: 0,
    TotalProducts: 0,
    TotalFabrics: 0,
    PendingOrders: 0,
    CompletedOrders: 0, // Add this state
    TotalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryData, ordersData, revenueData] = await Promise.all([
          getSummary(),
          getAllOrders(),
          getRevenue(),
        ]);

        // Count pending and completed orders
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
          ...summaryData,
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
    icon: <FaMoneyBillWave className="dashboard-icon text-green-600" />,
    bgColor: "bg-green-light",
  },
  {
    key: "customers",
    title: "Total Customers",
    value: summary.TotalCustomers,
    icon: <FaUsers className="dashboard-icon text-blue-500" />,
    bgColor: "bg-blue-light",
  },
  {
    key: "products",
    title: "Total Products",
    value: summary.TotalProducts,
    icon: <FaTshirt className="dashboard-icon text-yellow-500" />,
    bgColor: "bg-yellow-light",
  },
  {
    key: "fabrics",
    title: "Total Fabrics",
    value: summary.TotalFabrics,
    icon: <FaBoxes className="dashboard-icon text-green-500" />,
    bgColor: "bg-green-light",
  },
  {
    key: "orders",
    title: "Total Orders",
    value: summary.TotalOrders,
    icon: <FaClipboardList className="dashboard-icon text-purple-500" />,
    bgColor: "bg-purple-light",
  },
  {
    key: "employees",
    title: "Total Employees",
    value: summary.TotalUsers,
    icon: <FaUserTie className="dashboard-icon text-red-500" />,
    bgColor: "bg-red-light",
  },
  {
    key: "pending",
    title: "Pending Orders",
    value: summary.PendingOrders,
    icon: <FaClock className="dashboard-icon text-orange-500" />,
    bgColor: "bg-orange-light",
  },
  {
    key: "completed",
    title: "Completed Orders",
    value: summary.CompletedOrders,
    icon: <FaCheckCircle className="dashboard-icon text-green-500" />,
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
        {data.map((item, index) => (
          <div key={index} className={`dashboard-card ${item.bgColor}`}>
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
