import React, { useEffect, useState } from "react";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu visibility

 

  // Handle Update
  const handleUpdate = () => {
    if (selectedCustomer) {
      alert(`Update customer with ID: ${selectedCustomer.id}`);
   
    } else {
      alert("Please select a customer to update.");
    }
    setIsMenuOpen(false); // Close the menu after action
  };

  // Handle Select
  const handleSelect = (customer) => {
    setSelectedCustomer(customer);
    alert(`Selected customer: ${customer.name}`);
    setIsMenuOpen(false); // Close the menu after action
  };

  // Handle Delete
  const handleDelete = () => {
    if (selectedCustomer) {
      alert(`Delete customer with ID: ${selectedCustomer.id}`);
      // Add your delete logic here
    } else {
      alert("Please select a customer to delete.");
    }
    setIsMenuOpen(false); // Close the menu after action
  };

  return (
    <div className="customers-container">
      <h2>
        Customer List
        {/* Three-dots menu */}
        <div className="menu-container">
          <button className="menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            &#8942; {/* Three dots icon */}
          </button>
          {isMenuOpen && (
            <div className="menu-dropdown">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => selectedCustomer && handleSelect(selectedCustomer)}>
                Select
              </button>
              <button onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </h2>

      <table className="customers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Gender</th>
            <th>Chest</th>
            <th>Waist</th>
            <th>Hips</th>
            <th>Shoulder</th>
            <th>Sleeve Length</th>
            <th>Trouser Length</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr
                key={customer.id}
                className={selectedCustomer?.id === customer.id ? "selected" : ""}
                onClick={() => handleSelect(customer)}
              >
                <td>{customer.name}</td>
                <td>{customer.phone}</td>
                <td>{customer.address}</td>
                <td>{customer.gender}</td>
                <td>{customer.chest}</td>
                <td>{customer.waist}</td>
                <td>{customer.hips}</td>
                <td>{customer.shoulder}</td>
                <td>{customer.sleeveLength}</td>
                <td>{customer.trouserLength}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="no-data">
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