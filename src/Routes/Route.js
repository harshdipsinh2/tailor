import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "../Contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import CustomerRegistration from "../pages/Customer/CustomerRegistration";
import Customers from "../pages/Customer/Customers";
import Orders from "../pages/Order/Orders";
import Products from "../pages/Product/Products";
import Measurements from "../pages/Customer/Measurements";
import Dashboard from "../pages/UI/Dashboard";
import Fabrics from "../pages/Product/Fabrics";
import Employees from "../pages/Employees";
import CompletedOrders from "../pages/Order/CompletedOrders";
import Login from "../pages/Registration/Login";
import HomePage from "../pages/UI/HomePage";
import MainLayout from "../pages/UI/MainLayot";
import FabricStock from "../pages/Product/FabricStock";
import Unauthorized from "../pages/Unauthorized";
import Calendar from "../pages/Calendar";
import Otp from "../pages/Registration/Otp";
import PaymentSuccess from "../Stripe/Payment-Success";
import ManageOrders from "../pages/Order/ManageOrders";
import RejectedOrders from "../pages/Order/RejectedOrders";
import SmsHistory from "../pages/SmsHistory"; 


const AppRoutes = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Add OTP route before the protected routes */}
      <Route path="/otp" element={<Otp />} />

      {/* Change root route to show HomePage */}
      <Route
        path="/"
        element={
          auth.token ? <Navigate to="/dashboard" /> : <HomePage />
        }
      />

      {/* Protected routes under MainLayout */}
      <Route
        element={
          auth.token ? <MainLayout /> : <Navigate to="/login" />
        }
      >
        <Route
          path="dashboard"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager', 'tailor']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Other protected routes... */}
        <Route
          path="customers"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer-registration"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
              <CustomerRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={['superadmin','admin', 'manager', 'tailor']}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute allowedRoles={['superadmin','admin', 'manager','tailor']}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="measurements"
          element={
            <ProtectedRoute allowedRoles={['superadmin','admin', 'manager', 'tailor']}>
              <Measurements />
            </ProtectedRoute>
          }
        />
        <Route
          path="fabrics"
          element={
            <ProtectedRoute allowedRoles={['superadmin','admin', 'manager','tailor']}>
              <Fabrics />
            </ProtectedRoute>
          }
        />  
        <Route
          path="employees"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
              <Employees />
            </ProtectedRoute>
          }
          />
        <Route
          path="completed-orders"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
              <CompletedOrders />
            </ProtectedRoute>
          }
        />
        <Route
         path="FabricStock"
         element={
           <ProtectedRoute allowedRoles={['superadmin','admin', 'manager','tailor']}>
             <FabricStock />
           </ProtectedRoute>
         }
        />
        <Route
          path="Calendar"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="manage-orders"
          element={
            <ProtectedRoute allowedRoles={['superadmin','tailor']}>
              <ManageOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="rejected-orders"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
              <RejectedOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="sms-history"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
              <SmsHistory />
            </ProtectedRoute>
          }
        />

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Route>

      {/* Payment routes */}
      <Route
        path="payment-success"
        element={
          <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment-cancel"
        element={
          <ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']}>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;