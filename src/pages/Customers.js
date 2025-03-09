import React, { useEffect, useState } from "react";
import "../Css/Customers.css";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { updateCustomer, getAllCustomers } from "../api/customerapi";


const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerID] = useState('');
  const [show, setShow] = useState(false);
  const [showMeasurment, setShowMeasurment] = useState(false);
   const [formData, setFormData] = useState({
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      gender: "male"
    });

  useEffect(() => {
    //API call to get all customers
    getAllCustomers()
    .then((data) => {
      setCustomers(data);
    })
    .catch((error) => {
        console.error('Error fetching data:', error);
    });
    
  }, []);

  const handleEditCustomer = async(customerId) => {
    setCustomerID(customerId);
    setShowMeasurment(false);
    const singlCustome = customers.find((customer) => customer.customerId === customerId);
    setFormData({ 
          fullName: singlCustome.fullName,
          phoneNumber: singlCustome.phoneNumber,
          email: singlCustome.email,
          address: singlCustome.address,
          gender: singlCustome.gender,
    })
    setShow(true);
  }
  const handleAddMeasurements = async(customerId) => {
    setShowMeasurment(true);
    // setCustomerID(customerId);
    // const singlCustome = customers.find((customer) => customer.customerId === customerId);
    // setFormData({ 
    //       fullName: singlCustome.fullName,
    //       phoneNumber: singlCustome.phoneNumber,
    //       email: singlCustome.email,
    //       address: singlCustome.address,
    //       gender: singlCustome.gender,
    // })
    setShow(true);
  }


  const handleClose = () => {
    setShow(false);
  }
  const handleEditSubmit = (event) => {

    if(showMeasurment){

    }else{
      
    }
   
    updateCustomer(customerId, event);
    setShow(false);
    // Log the form data to the console
    console.log("Customer Data:", event);

  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.fullName}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.email}</td>
                <td>{customer.address}</td>
                <td>{customer.gender}</td>
                <td>
                  <DropdownButton id="dropdown-basic-button" title="Dropdown button">
                  <Dropdown.Item onClick={(e) => handleEditCustomer(customer.customerId)}>Edit</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Delete</Dropdown.Item>
                  <Dropdown.Item onClick={(e) => handleAddMeasurements(customer.customerId)}>Add Measurement</Dropdown.Item>
                </DropdownButton>
                </td>
              
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {showMeasurment ?
          <Modal.Title>Add Measurements</Modal.Title>:
          <Modal.Title>Update Customer Details</Modal.Title>
          }
        </Modal.Header>
        <Modal.Body>

        <form onSubmit={handleEditSubmit} className="form">
        {/* Personal Details */}
        {showMeasurment ? 
        <div className="section">
          {["chest", "waist", "hip", "shoulder", "sleeveLength", "trouserLength", "inseam", "thigh", "neck", "sleeve", "arms"].map((field) => (
            <input key={field} type="number" name={field} placeholder={field} value={formData[field]} onChange={handleChange} required />
          ))}
        </div> : 
        <div className="section">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input type="tel" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} required />
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
        </div>}

        {/* <button type="submit">Save</button> */}
      </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=> handleEditSubmit(formData)}>
            Update Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Customers;
