import React, { useState, useEffect } from "react";
import "./Measurements.css";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [columns, setColumns] = useState([
    "id",
    "customerId",
    "chest",
    "waist",
    "hips",
    "shoulder",
    "sleeveLength",
    "trouserLength",
  ]);

  useEffect(() => {
  


      const dd = localStorage.getItem('formData');

      console.log();
      
  }, []);

  return (
    <div className="measurements-container">
      <h2>Measurements</h2>
      <table className="measurements-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
            ))}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {measurements.length > 0 ? (
            measurements.map((measurement) => (
              <tr key={measurement.id}>
                {columns.map((col) => (
                  <td key={col}>{measurement[col]}</td>
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
              <td colSpan={columns.length + 1}>No measurements found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Measurements;
