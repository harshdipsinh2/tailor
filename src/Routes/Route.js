import React from "react";
import { Route, Routes } from "react-router-dom";
import CustomerRegistration from "../pages/CustomerRegistration";
import Customers from "../pages/Customers";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Measurements from "../pages/Measurements";
import Dashboard from "../pages/Dashboard";
import Fabrics from "../pages/Fabrics";
import Employees from "../pages/Employees"; // Import Employees
import CompletedOrders from "../pages/CompletedOrders"; // Import CompletedOrders
import HomePage from "../pages/HomePage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Home Page Route */}
      <Route path="/dashboard" element={<Dashboard />} /> {/* Set Dashboard as the default route */}
      <Route path="/customers" element={<Customers />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/products" element={<Products />} />
      <Route path="/measurements" element={<Measurements />} />
      <Route path="/customer-registration" element={<CustomerRegistration />} /> {/* Add route for CustomerRegistration */}
      <Route path="/fabrics" element={<Fabrics />} />
      <Route path="/employees" element={<Employees />} /> {/* Add Employees Route */}
      <Route path="/completed-orders" element={<CompletedOrders />} /> {/* Add CompletedOrders Route */}

    </Routes>
  );
};

export default AppRoutes;
