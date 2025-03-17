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
          Tailor Management System
        </div>

        {/* Sidebar Toggle Button on Right Side */}
        <Button
          variant="primary"
          className="sidebar-toggle"
          onClick={handleShow}
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
          <Offcanvas.Title>Menu</Offcanvas.Title>
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
                <FontAwesomeIcon icon={faHome} style={{ marginRight: "8px" }} />
                Dashboard
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/customer-registration"
                className={`nav-link ${
                  location.pathname === "/customer-registration"
                    ? "active"
                    : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faUserPlus}
                  style={{ marginRight: "8px" }}
                />
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
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{ marginRight: "8px" }}
                />
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
                <FontAwesomeIcon
                  icon={faRuler}
                  style={{ marginRight: "8px" }}
                />
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
                <FontAwesomeIcon icon={faBox} style={{ marginRight: "8px" }} />
                Cloth Type
              </Link>
            </Nav.Item>

            <Nav.Item>
              <Link
                to="/orders"
                className={`nav-link ${
                  location.pathname === "/orders" ? "active" : ""
                }`}
              >
                <FontAwesomeIcon
                  icon={faClipboardList}
                  style={{ marginRight: "8px" }}
                />
                Orders
              </Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Navbar;
