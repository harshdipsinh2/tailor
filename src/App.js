import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainLayout from "./pages/MainLayot"; // Import the MainLayout component
import AppRoutes from "./Routes/Route"; // Import the routes
import "antd/es/style/reset.css";

const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Router>
      
      <AppRoutes /> {/* Use the AppRoutes component */}
    </Router>
  );
};

export default App;