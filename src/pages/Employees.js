import React, { useState, useEffect } from "react";
import "./Employees.css";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [columns, setColumns] = useState([
    "id",
    "name",
    "phone",
    "role",
    "salary",
    "status",
  ]);

  // Fetch employees from API
  useEffect(() => {
    fetch("https://yourapi.com/employees")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  return (
    <div className="employees-container">
      <h2>Employees</h2>
      <table className="employees-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <tr key={employee.id}>
                {columns.map((col) => (
                  <td key={col}>
                    {col === "status" ? (
                      <span className={`status ${employee[col]?.toLowerCase()}`}>
                        {employee[col]}
                      </span>
                    ) : (
                      employee[col]
                    )}
                  </td>
                ))}
                {/* Actions Dropdown */}
                <td>
                  <select className="select-action">
                    <option value="">Select</option>
                    <option value="view">View</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1}>No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
