import React from "react";
import { FaUsers, FaTshirt, FaWallet, FaCreditCard } from "react-icons/fa";
import "../Css/Dashboard.css"; // Import your CSS file

const Dashboard = () => {
  const data = [
    {
      title: "Total Customer",
      value: "--",
      icon: <FaUsers className="dashboard-icon text-blue-500" />,
      bgColor: "bg-blue-light",
    },
    {
      title: "Products",
      value: "--",
      icon: <FaTshirt className="dashboard-icon text-yellow-500" />,
      bgColor: "bg-yellow-light",
    },
    {
      title: "Revenue",
      value: "--",
      icon: <FaWallet className="dashboard-icon text-gray-500" />,
      bgColor: "bg-gray-light",
    },
    {
      title: "Total Expense",
      value: "--",
      icon: <FaCreditCard className="dashboard-icon text-red-500" />,
      bgColor: "bg-red-light",
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
