import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
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
import MainLayout from "../pages/MainLayot";console.log('AppRoutes component rendered');


const AppRoutes = () => {
  const { user } = useContext(AuthContext); // Retrieve user info from context

  return (
    <Routes>
      {/* Show login first on app start */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes under MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route
          path="dashboard"
          element={
            <ProtectedRoute
              element={<Dashboard />}
              allowedRoles={['admin', 'manager', 'tailor']}
              userRole={user?.role}
            />
          }
        />
        {/* More protected routes with role-based access */}
        <Route
          path="customers"
          element={
            <ProtectedRoute
              element={<Customers />}
              allowedRoles={['admin', 'manager']}
              userRole={user?.role}
            />
          }

        />
        <Route
          path="customer-registration"
          element={
            <ProtectedRoute
              element={<CustomerRegistration />}
              allowedRoles={['admin', 'manager']}
              userRole={user?.role}
            />
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute
              element={<Orders />}
              allowedRoles={['admin', 'manager', 'tailor']}
              userRole={user?.role}
            />
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute
              element={<Products />}
              allowedRoles={['admin', 'manager','tailor']}
              userRole={user?.role}
            />
          }
        />
        <Route
          path="measurements"
          element={
            <ProtectedRoute
              element={<Measurements />}
              allowedRoles={['admin', 'manager', 'tailor']}
              userRole={user?.role}
            />
          }
        />
        <Route
          path="fabrics"
          element={
            <ProtectedRoute
              element={<Fabrics />}
              allowedRoles={['admin', 'manager','tailor']}
              userRole={user?.role}
            />
          }
        />  

\      </Route>
    </Routes>
  );
};

export default AppRoutes;
