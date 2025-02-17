import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import image from "../asset/logo.jpeg"

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo"><img src={image} height={50} width={50} alt="logo"/>Tailor Manager</div>
      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
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
        <li className={location.pathname === "/employees" ? "active" : ""}>
          <Link to="/employees">Employees</Link>
        </li>
        <li className={location.pathname === "/orders" ? "active" : ""}>
          <Link to="/orders">Orders</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
