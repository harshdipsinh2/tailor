import React, { useState, useEffect } from "react";
import "./Employees.css";

const Employees = () => {
  const [employees, setEmployees] = useState([
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false); // Enable selecting employees

  // Handle Select Toggle
  const handleSelectToggle = () => {
    setIsSelecting(!isSelecting);
    setSelectedEmployee(null); // Reset selection
  };

  // Handle Update
  const handleUpdate = () => {
    if (selectedEmployee) {
      alert(`Update employee: ${selectedEmployee.name}`);
      // Implement update logic
    } else {
      alert("Please select an employee to update.");
    }
  };

  // Handle Delete
  const handleDelete = () => {
    if (selectedEmployee) {
      const updatedEmployees = employees.filter(e => e.id !== selectedEmployee.id);
      setEmployees(updatedEmployees);
      alert(`Deleted: ${selectedEmployee.name}`);
      setSelectedEmployee(null);
    } else {
      alert("Please select an employee to delete.");
    }
  };

  // Handle Add Employee
  const handleAddEmployee = () => {
    alert("Add Employee Clicked");
    // You can later implement a form to add new employees
  };

  return (
    <div className="employees-container">
      <div className="header-container">
        <h2>Employees</h2>

        {/* Dropdown menu (right after Employees heading) */}
        <div className="menu-container">
          <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            &#8942;
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleAddEmployee}>Add</button>
              <button onClick={handleSelectToggle}>{isSelecting ? "Cancel Select" : "Select"}</button>
              <button onClick={handleUpdate} disabled={!selectedEmployee}>Update</button>
              <button onClick={handleDelete} disabled={!selectedEmployee}>Delete</button>
            </div>
          )}
        </div>
      </div>

      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Salary</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className={selectedEmployee?.id === employee.id ? "selected" : ""}
              onClick={() => isSelecting && setSelectedEmployee(employee)}
            >
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.phone}</td>
              <td>{employee.role}</td>
              <td>${employee.salary}</td>
              <td>{employee.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
