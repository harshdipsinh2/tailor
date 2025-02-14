import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerRegistration from "./components/CustomerRegistration";
import Navbar from "./pages/Navbar";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Orders from "./pages/Orders";
// import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false); // Track if user submitted form

  return (
    <Router>
      <Routes>
        {/* First Page: Customer Registration */}
        <Route path="/" element={<CustomerRegistration setIsSubmitted={setIsSubmitted} />} />

        {/* Pages with Navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/customers" element={<Customers />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
