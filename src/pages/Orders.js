import React, { useState, useEffect } from "react";
import "../Css/Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([
    "id",
    "customerId",
    "orderDate",
    "deliveryDate",
    "status",
    "price",
  ]);



  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            {columns.map((col) => ( // loop for columns for order object //
              <th key={col}>{col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                {columns.map((col) => (
                  <td key={col}>
                    {col === "status" ? (
                      <span className={`status ${order[col]?.toLowerCase()}`}>
                        {order[col]}
                      </span>
                    ) : (
                      order[col]
                    )}
                  </td>
                ))}
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
              <td colSpan={columns.length + 1}>No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
