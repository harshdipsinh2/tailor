import React, { useState, useEffect } from "react";
import "../Css/Orders.css";
import { getAllOrders } from "../api/Orderapi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [columns, setColumns] = useState([
    
    "customerName",
    "productName",
    "quantity",
    "totalPrice",
    "orderStatus",
    "paymentStatus",
    "orderDate",
    "completionDate",
  ]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
            ))}
            {/* <th>ACTIONS</th> */}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                {columns.map((col) => (
                  <td key={col}>
                    {col === "orderStatus" || col === "paymentStatus" ? (
                      <span className={`status ${order[col]?.toLowerCase()}`}>
                        {order[col]}
                      </span>
                    ) : (
                      order[col]
                    )}
                  </td>
                ))}
                {/* <td>
                  <select className="select-action">
                    <option value="">Select</option>
                    <option value="edit">Edit</option>
                    <option value="delete">Delete</option>
                  </select>
                </td> */}
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
