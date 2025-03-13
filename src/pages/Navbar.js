import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Css/Navbar.css";
import image from "../asset/maschine.jpeg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUserPlus,
  faUsers,
  faRuler,
  faBox,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

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
        Tailor Management 
        System
      </div>
      <ul className="nav-links">
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">
            <FontAwesomeIcon icon={faHome} style={{ marginRight: "8px" }} />
           Dashboard
          </Link>
        </li>
        <li
          className={
            location.pathname === "/customer-registration" ? "active" : ""
          }
        >
          <Link to="/customer-registration">
            <FontAwesomeIcon icon={faUserPlus} style={{ marginRight: "8px" }} />
            Registration
          </Link>
        </li>
        <li className={location.pathname === "/customers" ? "active" : ""}>
          <Link to="/customers">
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: "8px" }} />
            Customers
          </Link>
        </li>
        <li className={location.pathname === "/measurements" ? "active" : ""}>
          <Link to="/measurements">
            <FontAwesomeIcon icon={faRuler} style={{ marginRight: "8px" }} />
            Measurements
          </Link>
        </li>
        <li className={location.pathname === "/products" ? "active" : ""}>
          <Link to="/products">
            <FontAwesomeIcon icon={faBox} style={{ marginRight: "8px" }} />
            Cloth Type          </Link>
        </li>
        <li className={location.pathname === "/orders" ? "active" : ""}>
          <Link to="/orders">
            <FontAwesomeIcon
              icon={faClipboardList}
              style={{ marginRight: "8px" }}
            />
            Orders
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
