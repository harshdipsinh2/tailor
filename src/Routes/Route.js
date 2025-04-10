import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Customers from "../pages/Customers";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Measurements from "../pages/Measurements";
import CustomerRegistration from "../pages/CustomerRegistration";
import Fabrics from "../pages/Fabrics";
import Employees from "../pages/Employees";
import CompletedOrders from "../pages/CompletedOrders";
import Login from "../pages/Login";
import HomePage from "../pages/HomePage";

import MainLayout from "../pages/MainLayot";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Tailor"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="orders" element={<Orders />} />
        <Route path="products" element={<Products />} />
        <Route path="measurements" element={<Measurements />} />
        <Route path="customer-registration" element={<CustomerRegistration />} />
        <Route path="fabrics" element={<Fabrics />} />
        <Route path="employees" element={<Employees />} />
        <Route path="completed-orders" element={<CompletedOrders />} />
        <Route path="homepage" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
