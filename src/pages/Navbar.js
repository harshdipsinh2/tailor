import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="logo">Tailor Manager</div>
      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        {/* <li className={location.pathname === "/customers" ? "active" : ""}>
          <Link to="/customers">Customers</Link>
        </li> */}
        <li className={location.pathname === "/customers" ? "active" : ""}>
          <Link to="/customers">Customers</Link>
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
