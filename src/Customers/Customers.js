import React, { useEffect, useState } from "react";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    try {
      const savedData = localStorage.getItem("formData");
      console.log("Raw Data from localStorage:", savedData); // ✅ Debugging
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Parsed Customers Data:", parsedData); // ✅ Debugging
        setCustomers(parsedData);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }, []);

  const handleAction = (customer, action) => {
    if (!customer) return;

    switch (action) {
      case "select":
        alert(`Selected customer: ${customer.name}`);
        break;

      case "update":
        const newName = prompt(`Enter new name for ${customer.name}:`, customer.name);
        if (newName) {
          const updatedCustomers = customers.map((c) =>
            c.id === customer.id ? { ...c, name: newName } : c
          );
          setCustomers(updatedCustomers);
          localStorage.setItem("formData", JSON.stringify(updatedCustomers));
        }
        break;

      case "delete":
        if (window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
          const updatedCustomers = customers.filter((c) => c.id !== customer.id);
          setCustomers(updatedCustomers);
          localStorage.setItem("formData", JSON.stringify(updatedCustomers));
        }
        break;

      default:
        break;
    }
  };

  return (
    <div className="customers-container">
      <h2>Customer List</h2>
      <table className="customers-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.gender}</td>
                <td>
                  <select
                    className="select-action"
                    onChange={(e) => {
                      handleAction(customer, e.target.value);
                      e.target.value = ""; // Reset dropdown
                    }}
                  >
                    <option value="">Select</option>
                    <option value="select">View</option>
                    <option value="update">Update</option>
                    <option value="delete">Delete</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data">
                No customers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
