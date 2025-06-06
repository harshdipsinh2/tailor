import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./pages/UI/MainLayot"; // Import the MainLayout component
import AppRoutes from "./Routes/Route"; // Import the routes
import "antd/es/style/reset.css";
import AuthProvider from "./Contexts/AuthContext";

const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <AuthProvider>
    <Router>
      <AppRoutes /> {/* Use the AppRoutes component */}
    </Router>
    </AuthProvider>
  );
};
export default App;