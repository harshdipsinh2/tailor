import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/CustomerRegistration.css";
import { addCustomer } from "../api/customerapi";

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gender: "male",
    chest: "",
    waist: "",
    hip: "",
    shoulder: "",
    sleeveLength: "",
    trouserLength: "",
    inseam: "",
    thigh: "",
    neck: "",
    sleeve: "",
    arms: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
   // api call 
  const handleSubmit = (event) => {
    event.preventDefault();
    addCustomer(formData);
    navigate("/customers");
  };

  return (
    <div className="container">
      <h2>Customer Registration</h2>
      <form onSubmit={handleSubmit} className="form">
        {/* Personal Details */}
        <div className="section">
          {/* <h3>Personal Details</h3> */}
          <label>Full Name</label>
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <label>Phone Number</label>
          <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
          <label>Email Address</label>
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <label>Address</label>
          <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required></textarea>

          <div className="radio-group">
            <label>
              <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} /> Female
            </label>
          </div>
        </div>

        {/* Measurements */}
        {/* <div className="section">
          <h3>Measurements</h3>
          {["chest", "waist", "hip", "shoulder", "sleeveLength", "trouserLength", "inseam", "thigh", "neck", "sleeve", "arms"].map((field) => (
            <input key={field} type="number" name={field} placeholder={field} value={formData[field]} onChange={handleChange} required />
          ))}
        </div> */}

        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default CustomerRegistration;