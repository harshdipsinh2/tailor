import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerRegistration.css";
import image from "../asset/maschine.jpeg";



const CustomerRegistration = ({ setIsSubmitted }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gender: "male",
    chest: "",
    waist: "",
    hips: "",
    shoulder: "",
    sleeveLength: "",
    trouserLength: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    console.log(formData, '??');
    localStorage.setItem('formData', JSON.stringify(formData))
    
    setTimeout(() => {
      navigate("/customers");
    }, 500);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      gender: "male",
      chest: "",
      waist: "",
      hips: "",
      shoulder: "",
      sleeveLength: "",
      trouserLength: "",
    });
  };

  return (
    <div className="container">
      {/* <div className="logo"><img src={image} height={50} width={50} alt="logo" /></div> */}
      <div className="form-header">
        <h2 className="title">Customer Registration</h2>
      </div>
      <form onSubmit={handleSubmit} className="form">

        {/* Personal Details Section */}
        <div className="left-section">
          <h3 className="subtitle">Personal Details</h3>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <textarea name="address" placeholder="Address" value={formData.address} onChange={handleChange} required></textarea>
          <div className="radio-group">
            <label>
              <input type="radio" name="gender" value="male" checked={formData.gender === "male"} onChange={handleChange} /> Male
            </label>
            <label>
              <input type="radio" name="gender" value="female" checked={formData.gender === "female"} onChange={handleChange} /> Female
            </label>
          </div>

          {/* Save & Cancel Buttons  */}
          <div className="button-group">
            <button type="submit" onSubmit={handleSubmit}>Save</button>
            <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
          </div>
        </div>

        {/* Measurements*/}
        <div className="right-section">
          <h3 className="subtitle">Measurements</h3>
          <input type="number" name="chest" placeholder="Chest (inches)" value={formData.chest} onChange={handleChange} required />
          <input type="number" name="waist" placeholder="Waist (inches)" value={formData.waist} onChange={handleChange} required />
          <input type="number" name="hips" placeholder="Hips (inches)" value={formData.hips} onChange={handleChange} required />
          <input type="number" name="shoulder" placeholder="Shoulder (inches)" value={formData.shoulder} onChange={handleChange} required />
          <input type="number" name="sleeveLength" placeholder="Sleeve Length (inches)" value={formData.sleeveLength} onChange={handleChange} required />
          <input type="number" name="trouserLength" placeholder="Trouser Length (inches)" value={formData.trouserLength} onChange={handleChange} required />
        </div>
      </form>
    </div>
  );
};

export default CustomerRegistration;
