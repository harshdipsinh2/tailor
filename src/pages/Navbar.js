import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Offcanvas, Button, Nav } from "react-bootstrap";
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
  faBars,
  faShirt,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="logo">
          <img src={image} height={60} width={60} alt="logo" />
          <span className="logo-text">Tailor Management System</span>
        </div>

        {/* Sidebar Toggle Button on Right Side */}
        <Button
          variant="primary"
          className="sidebar-toggle"
          onClick={handleShow}
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </nav>

      {/* Sidebar Component - Opens from Right Side */}
      <Offcanvas
        show={showSidebar}
        onHide={handleClose}
        placement="end"
        className="sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="sidebar-title">Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Item>
              <Link
                to="/"
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                Dashboard
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/customer-registration"
                className={`nav-link ${
                  location.pathname === "/customer-registration" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faUserPlus} className="nav-icon" />
                Registration
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/customers"
                className={`nav-link ${
                  location.pathname === "/customers" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                Customers
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/measurements"
                className={`nav-link ${
                  location.pathname === "/measurements" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faRuler} className="nav-icon" />
                Measurements
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/products"
                className={`nav-link ${
                  location.pathname === "/products" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faBox} className="nav-icon" />
                Cloth Type
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/fabrics"
                className={`nav-link ${
                  location.pathname === "/fabrics" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faShirt} className="nav-icon" />
                Fabrics
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/orders"
                className={`nav-link ${
                  location.pathname === "/orders" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
                Orders
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link
                to="/employees"
                className={`nav-link ${
                  location.pathname === "/employees" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon={faUsers} className="nav-icon" />{" "}
                {/* Use appropriate icon */}
                Employees
              </Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Navbar;
