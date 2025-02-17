import React, { useEffect, useState } from "react";
import "./Customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [columns, setColumns] = useState([
    "name",
    "phone",
    "email",
    "address",
    "gender",
    
    // "chest",
    // "waist",
    // "hips",
    // "shoulder",
    // "sleeveLength",
    // "trouserLength",
  ]);

  // Fetch customers from API
  useEffect(() => {
    // fetch("https://yourapi.com/customers")
    //   .then((response) => response.json())
    //   .then((data) => setCustomers(data))
    //   .catch((error) => console.error("Error fetching customers:", error));

      const dd = localStorage.getItem('formData');
      console.log(JSON.parse(dd), 'dd');
      const data = JSON.parse(dd)
      
      setCustomers(data);
      console.log(customers, 'constomer data', data);
      
  }, []);

  // Handle Actions
  const handleAction = (customer, action) => {
    switch (action) {
      case "select":
        alert(`Selected customer: ${customer.name}`);
        break;
      case "update":
        alert(`Update customer with ID: ${customer.id}`);
        break;
      case "delete":
        alert(`Delete customer with ID: ${customer.id}`);
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
            {columns.map((col) => (
              <th key={col}>{col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {customers.length > 0 ? (
            customers.map((customer) => (
              // <tr key={customer.id}>
              //   {columns.map((col) => (
              //     <td key={col}>{customer[col]}</td>
              //   ))}
              //   <td>
              //     <select
              //       className="select-action"
              //       onChange={(e) => handleAction(customer, e.target.value)}
              //     >
              //       <option value="">Select</option>
              //       <option value="select">View</option>
              //       <option value="update">Update</option>
              //       <option value="delete">Delete</option>
              //     </select>
              //   </td>
              // </tr>
              <tr>
                <td>{customer.name}</td>
              </tr>
              
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="no-data">
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
