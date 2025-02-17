import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerRegistration from "./components/CustomerRegistration";
import Navbar from "./pages/Navbar";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Orders from "./pages/Orders";
// import Products from "./pages/Products";
import Products from "./pages/Products";
import Measurements from "./pages/Measurements";
// import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [isSubmitted, setIsSubmitted] = useState(false); 

  return (
    <Router>
      <Routes>
        {/*Customer Registration */}
        <Route path="/" element={<CustomerRegistration setIsSubmitted={setIsSubmitted} />} />

        {/*Navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                {/* <Route path="/products" element={<Products />} /> */}
                <Route path="/customers" element={<Customers />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products" element={<Products />} />
                <Route path="/measurements" element={<Measurements />} />

              </Routes>
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
