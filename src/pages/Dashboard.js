import React from "react";
import {
  FaUsers,
  FaTshirt,
  FaBoxes,
  FaClipboardList,
  FaUserTie,
} from "react-icons/fa"; // Imported necessary icons
import "../Css/Dashboard.css"; // Import your CSS file

const Dashboard = () => {
  const role = localStorage.getItem("role"); // Get the role from local storage
  const token = localStorage.getItem("token"); // Get the token from local storage    
  

  
  const data = [
    {
      title: "Total Customers",
      value: "--",
      icon: <FaUsers className="dashboard-icon text-blue-500" />,
      bgColor: "bg-blue-light",
    },
    {
      title: "Total Products",
      value: "--",
      icon: <FaTshirt className="dashboard-icon text-yellow-500" />,
      bgColor: "bg-yellow-light",
    },
    {
      title: "Total Fabrics",
      value: "--",
      icon: <FaBoxes className="dashboard-icon text-green-500" />, // Changed to Fabric Icon
      bgColor: "bg-green-light",
    },
    {
      title: "Total Orders",
      value: "--",
      icon: <FaClipboardList className="dashboard-icon text-purple-500" />, // Changed to Order Icon
      bgColor: "bg-purple-light",
    },
    {
      title: "Total Employees",
      value: "--",
      icon: <FaUserTie className="dashboard-icon text-red-500" />, // Changed to Employee Icon
      bgColor: "bg-red-light",
    },
    {
      title: "Pending Orders",
      value: "--",
      icon: <FaClipboardList className="dashboard-icon text-red-500" />, // Changed to Employee Icon
      bgColor: "bg-brown-light",
    }
  ];

  return (
    <div className="dashboard">
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        {role === "Admin" && <h2>Welcome, Admin</h2>}
        {role === "Manager" && <h2>Welcome, Manager</h2>}
        {role === "Tailor" && <h2>Welcome, Tailor</h2>}
      </div>
      
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
}
export default Dashboard;
