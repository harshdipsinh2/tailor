import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Offcanvas, Button, Nav, NavDropdown } from "react-bootstrap";
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
      <nav className="navbar navbar-custom">
        <div className="logo">
          <img src={image} height={60} width={60} alt="logo" />
          <span className="logo-text">Tailor Management System</span>
        </div>

        {/* Sidebar Toggle Button */}
        <Button
          variant="primary"
          className="sidebar-toggle"
          onClick={handleShow}
          aria-label="Toggle Sidebar"
        >
          <FontAwesomeIcon icon={faBars} />
        </Button>
      </nav>

      {/* Sidebar Component */}
      <Offcanvas
        show={showSidebar}
        onHide={handleClose}
        placement="end"
        className="sidebar-custom"
      >
        <Offcanvas.Header closeButton className="sidebar-header">
          <Offcanvas.Title className="sidebar-title">Menu</Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Item>
              <Link
                to="/"
                className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faHome} className="nav-icon" />
                Dashboard
              </Link>
            </Nav.Item>

            {/* Customer Management Dropdown */}
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                  Customer Management
                </span>
              }
              id="customer-management-dropdown"
              className="nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/customer-registration">
                <FontAwesomeIcon icon={faUserPlus} className="nav-icon" />
                Registration
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/customers">
                <FontAwesomeIcon icon={faUsers} className="nav-icon" />
                Customers
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/measurements">
                <FontAwesomeIcon icon={faRuler} className="nav-icon" />
                Measurements
              </NavDropdown.Item>
            </NavDropdown>

            {/* Product Management Dropdown */}
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faBox} className="nav-icon" />
                  Product Management
                </span>
              }
              id="product-management-dropdown"
              className="nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/products">
                <FontAwesomeIcon icon={faBox} className="nav-icon" />
                Products
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/fabrics">
                <FontAwesomeIcon icon={faShirt} className="nav-icon" />
                Fabrics
              </NavDropdown.Item>
            </NavDropdown>

            {/* Order Management Dropdown */}
            <NavDropdown
              title={
                <span>
                  <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
                  Order Management
                </span>
              }
              id="order-management-dropdown"
              className="nav-dropdown"
            >
              <NavDropdown.Item as={Link} to="/orders">
                <FontAwesomeIcon icon={faClipboardList} className="nav-icon" />
                Orders
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Item>
              <Link
                to="/employees"
                className={`nav-link ${location.pathname === "/employees" ? "active" : ""}`}
              >
                <FontAwesomeIcon icon={faUsers} className="nav-icon" />
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