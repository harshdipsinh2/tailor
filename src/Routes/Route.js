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
import MainLayout from "../pages/MainLayot";
import FabricStock from "../pages/FabricStock";
import Unauthorized from "../pages/Unauthorized";
import Calendar from "../pages/Calendar";
import Otp from "../pages/Otp";
import PaymentSuccess from "../Stripe/Payment-Success";


const AppRoutes = () => {
  const { auth } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={ <Login /> } />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Add OTP route before the protected routes */}
      <Route 
        path="/otp" 
        element={ <Otp /> } 
      />

      {/* Redirect root to login if not authenticated */}
      <Route
        path="/"
        element={
          auth.token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
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
            <ProtectedRoute allowedRoles={['admin', 'manager', 'tailor']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Other protected routes... */}
        <Route
          path="customers"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="customer-registration"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <CustomerRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'tailor']}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="products"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager','tailor']}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="measurements"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager', 'tailor']}>
              <Measurements />
            </ProtectedRoute>
          }
        />
        <Route
          path="fabrics"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager','tailor']}>
              <Fabrics />
            </ProtectedRoute>
          }
        />  
        <Route
          path="employees"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Employees />
            </ProtectedRoute>
          }
          />
        <Route
          path="completed-orders"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <CompletedOrders />
            </ProtectedRoute>
          }
        />
        <Route
         path="FabricStock"
         element={
           <ProtectedRoute allowedRoles={['admin', 'manager']}>
             <FabricStock />
           </ProtectedRoute>
         }
        />
        <Route
          path="Calendar"
          element={
            <ProtectedRoute allowedRoles={['admin', 'manager']}>
              <Calendar />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route
        path="payment-success"
        element={
          <ProtectedRoute allowedRoles={['admin', 'manager']}>
            <PaymentSuccess />
          </ProtectedRoute>
        }
      />


      {/* Catch all route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;