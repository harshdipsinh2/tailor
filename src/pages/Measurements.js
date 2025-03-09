import React, { useEffect, useState } from "react";
import "../Css/Measurements.css";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { getAllMeasurement, deleteMeasurement } from "../api/Meausementapi";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    fetchMeasurements();
  }, []);
            //api api
  const fetchMeasurements = async () => {
    try {
      const data = await getAllMeasurement();
      setMeasurements(data);
    } catch (error) {
      console.error("Error fetching measurements:", error.message);
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    try {
      await deleteMeasurement(measurementId);
      setMeasurements(measurements.filter(m => m.measurementID !== measurementId));
    } catch (error) {
      console.error("Error deleting measurement:", error.message);
    }
  };

  return (
    <div className="measurements-container">
      <h2>Measurement Records</h2>
      <table className="measurements-table">
        <thead>
          <tr>
            <th>MeasurementID</th>
            <th>CustomerID</th>
            <th>Chest</th>
            <th>Waist</th>
            <th>Hip</th>
            <th>Shoulder</th>
            <th>Sleeve Length</th>
            <th>Trouser Length</th>
            <th>Inseam</th>
            <th>Thigh</th>
            <th>Neck</th>
            <th>Sleeve</th>
            <th>Arms</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {measurements.length > 0 ? (
            measurements.map((m) => (
              <tr key={m.measurementID}>
                <td>{m.measurementID}</td>
                <td>{m.customerId}</td>
                <td>{m.chest}</td>
                <td>{m.waist}</td>
                <td>{m.hip}</td>
                <td>{m.shoulder}</td>
                <td>{m.sleeveLength}</td>
                <td>{m.trouserLength}</td>
                <td>{m.inseam}</td>
                <td>{m.thigh}</td>
                <td>{m.neck}</td>
                <td>{m.sleeve}</td>
                <td>{m.arms}</td>
                <td>
                  <DropdownButton id="dropdown-basic-button" title="Actions">
                    <Dropdown.Item onClick={() => handleDeleteMeasurement(m.measurementID)}>Delete</Dropdown.Item>
                  </DropdownButton>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="14">No records found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Measurements;