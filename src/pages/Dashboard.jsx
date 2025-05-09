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

  const data = [
    {
      title: "Total Revenue",
      value: `₹${summary.TotalRevenue.toLocaleString()}`,
      icon: <FaMoneyBillWave className="dashboard-icon text-green-600" />,
      bgColor: "bg-green-light",
    },
    {
      title: "Total Customers",
      value: summary.TotalCustomers,
      icon: <FaUsers className="dashboard-icon text-blue-500" />,
      bgColor: "bg-blue-light",
    },
    {
      title: "Total Products",
      value: summary.TotalProducts,
      icon: <FaTshirt className="dashboard-icon text-yellow-500" />,
      bgColor: "bg-yellow-light",
    },
    {
      title: "Total Fabrics",
      value: summary.TotalFabrics,
      icon: <FaBoxes className="dashboard-icon text-green-500" />,
      bgColor: "bg-green-light",
    },
    {
      title: "Total Orders",
      value: summary.TotalOrders,
      icon: <FaClipboardList className="dashboard-icon text-purple-500" />,
      bgColor: "bg-purple-light",
    },
    {
      title: "Total Employees",
      value: summary.TotalUsers,
      icon: <FaUserTie className="dashboard-icon text-red-500" />,
      bgColor: "bg-red-light",
    },
    {
      title: "Pending Orders",
      value: summary.PendingOrders,
      icon: <FaClock className="dashboard-icon text-orange-500" />,
      bgColor: "bg-orange-light",
    },
    {
      title: "Completed Orders",
      value: summary.CompletedOrders,
      icon: <FaCheckCircle className="dashboard-icon text-green-500" />,
      bgColor: "bg-green-light",
    },
  ];

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
