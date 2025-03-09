import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Css/Navbar.css";
import image from "../asset/maschine.jpeg";

const Navbar = () => {
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={image} height={60} width={60} alt="logo" />
        Tailor Management System
      </div>
      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === "/orders" ? "active" : ""}>
          <Link to="/customer-registration">Registration</Link>
        </li>
        <li className={location.pathname === "/customers" ? "active" : ""}>
          <Link to="/customers">Customers</Link>
        </li>
        <li className={location.pathname === "/measurements" ? "active" : ""}>
          <Link to="/measurements">Measurements</Link>
        </li>
        <li className={location.pathname === "/products" ? "active" : ""}>
          <Link to="/products">Products</Link>
        </li>
        
        <li className={location.pathname === "/orders" ? "active" : ""}>
          <Link to="/orders">Orders</Link>
        </li>
      
       
      </ul>
    </nav>
  );
};

export default Navbar;
