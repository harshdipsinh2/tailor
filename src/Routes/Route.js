import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import PrivateRoute from "../Routes/ProtectedRoute"; // Import your PrivateRoute component
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

      <Route path="/" element={<MainLayout />}>
        <Route
          path="dashboard"
          element={
            <PrivateRoute allowedRoles={["Admin", "Manager", "Tailor"]}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="customers"
          element={
            <PrivateRoute allowedRoles={["Admin", "Manager"]}>
              <Customers />
            </PrivateRoute>
          }
        />
        <Route
          path="orders"
          element={
            <PrivateRoute allowedRoles={["Admin", "Manager"]}>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="products"
          element={
            <PrivateRoute allowedRoles={["Admin", "Manager"]}>
              <Products />
            </PrivateRoute>
          }
        />
        <Route
          path="measurements"
          element={
            <PrivateRoute allowedRoles={["Admin", "Tailor", "Manager"]}>
              <Measurements />
            </PrivateRoute>
          }
        />
        <Route
          path="customer-registration"
          element={
            <PrivateRoute allowedRoles={["Admin", "Manager"]}>
              <CustomerRegistration />
            </PrivateRoute>
          }
        />
        <Route
          path="fabrics"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Fabrics />
            </PrivateRoute>
          }
        />
        <Route
          path="employees"
          element={
            <PrivateRoute allowedRoles={["Admin"]}>
              <Employees />
            </PrivateRoute>
          }
        />
        <Route
          path="completed-orders"
          element={
            <PrivateRoute allowedRoles={["Admin", "Manager"]}>
              <CompletedOrders />
            </PrivateRoute>
          }
        />
        <Route
          path="homepage"
          element={
            <PrivateRoute allowedRoles={["Admin", "Manager", "Tailor"]}>
              <HomePage />
            </PrivateRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
