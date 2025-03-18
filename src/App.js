import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./pages/Navbar";
import AppRoutes from "./Routes/Route"; // Import the routes
import "antd/es/style/reset.css";

const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Router>
      <Navbar />
      <AppRoutes /> {/* Use the AppRoutes component */}
    </Router>
  );
};

export default App;