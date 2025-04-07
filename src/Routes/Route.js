import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import CustomerRegistration from "../pages/CustomerRegistration";
import Customers from "../pages/Customers";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Measurements from "../pages/Measurements";
import Dashboard from "../pages/Dashboard";
import Fabrics from "../pages/Fabrics";
import Employees from "../pages/Employees";
import CompletedOrders from "../pages/CompletedOrders";
import Login from "../pages/Login";
import HomePage from "../pages/HomePage";
import MainLayout from "../pages/MainLayot"; // make sure file name is correct
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Default route redirects to login */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

      {/* Protected Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Tailor"]}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "Tailor"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="customers"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="measurements"
          element={
            <ProtectedRoute allowedRoles={["Tailor", "Admin"]}>
              <Measurements />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer-registration"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <CustomerRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="fabrics"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Fabrics />
            </ProtectedRoute>
          }
        />
        <Route
          path="employees"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="completed-orders"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
              <CompletedOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="homepage"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Manager", "Tailor"]}>
              <HomePage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
