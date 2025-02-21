import React, { useState, useEffect } from "react";
import "./Measurements.css";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]); // State to store measurements

  const [columns] = useState([
    "id",
    "customerId",
    "chest",
    "waist",
    "hips",
    "shoulder",
    "sleeveLength",
    "trouserLength",
  ]);

  // Load measurements from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("measurementsData");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setMeasurements(parsedData);
        console.log("Loaded Measurements:", parsedData); // Debugging line
      }
    } catch (error) {
      console.error("Error loading measurements:", error);
    }
  }, []);

  // Function to handle actions (View, Update, Delete)
  const handleAction = (measurement, action) => {
    switch (action) {
      case "select":
        alert(`Selected Measurement ID: ${measurement.id}`);
        break;
      case "update":
        alert(`Update Measurement with ID: ${measurement.id}`);
        break;
      case "delete":
        const updatedMeasurements = measurements.filter(m => m.id !== measurement.id);
        setMeasurements(updatedMeasurements);
        localStorage.setItem("measurementsData", JSON.stringify(updatedMeasurements));
        alert(`Deleted Measurement with ID: ${measurement.id}`);
        break;
      default:
        break;
    }
  };

  return (
    <div className="measurements-container">
      <h2>Measurements</h2>
      <table className="measurements-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
            ))}
            <th>ACTIONS</th> {/* New actions column */}
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
                  <select
                    className="select-action"
                    onChange={(e) => handleAction(measurement, e.target.value)}
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
              <td colSpan={columns.length + 1} className="no-data">
                No measurements found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Measurements;
