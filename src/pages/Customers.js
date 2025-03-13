import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Radio, Space, message } from 'antd';
import { updateCustomer, getAllCustomers } from "../api/customerapi";
import '../Css/Customers.css';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerID] = useState('');
  const [show, setShow] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gender: "Male"
  });

  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleEditCustomer = (customerId) => {
    setCustomerID(customerId);
    setShowMeasurement(false);
    const customer = customers.find((customer) => customer.customerId === customerId);
    if (customer) {
      setFormData({
        fullName: customer.fullName,
        phoneNumber: customer.phoneNumber,
        email: customer.email,
        address: customer.address,
        gender: customer.gender,
      });
      setShow(true);
    } else {
      console.error("Customer not found");
    }
  };

  const handleAddMeasurements = (customerId) => {
    setCustomerID(customerId);
    setShowMeasurement(true);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (showMeasurement) {
      message.success("Measurement added successfully");
      setShow(false);
    } else {
      updateCustomer(customerId, formData)
        .then(() => {
          message.success("Customer updated successfully");
          setShow(false);
        })
        .catch((error) => {
          console.error("Error updating customer:", error);
        });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const columns = [
    { title: "Name", dataIndex: "fullName", key: "fullName" },
    { title: "Phone", dataIndex: "phoneNumber", key: "phoneNumber" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "Gender", dataIndex: "gender", key: "gender" },
    {
      title: "Actions",
      key: "actions",
      render: (_, customer) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEditCustomer(customer.customerId)}>Edit</Button>
          <Button danger onClick={() => console.log("Delete clicked")}>Delete</Button>
          <Button type="dashed" onClick={() => handleAddMeasurements(customer.customerId)}>Add Measurement</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="customers-container">
      <h2>Customer List</h2>
      <Table
        dataSource={customers}
        columns={columns}
        rowKey="customerId"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={showMeasurement ? "Add Measurements" : "Update Customer Details"}
        visible={show}
        onCancel={handleClose}
        onOk={handleEditSubmit}
      >
        <Form layout="vertical">
          {showMeasurement ? (
            ["chest", "waist", "hip", "shoulder", "sleeveLength", "trouserLength", "inseam", "thigh", "neck", "sleeve", "arms"].map((field) => (
              <Form.Item key={field} label={field}>
                <Input type="number" name={field} value={formData[field]} onChange={handleChange} required />
              </Form.Item>
            ))
          ) : (
            <>
              <Form.Item label="Full Name">
                <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
              </Form.Item>
              <Form.Item label="Phone Number">
                <Input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </Form.Item>
              <Form.Item label="Email">
                <Input name="email" value={formData.email} onChange={handleChange} required />
              </Form.Item>
              <Form.Item label="Address">
                <Input.TextArea name="address" value={formData.address} onChange={handleChange} required />
              </Form.Item>
              <Form.Item label="Gender">
                <Radio.Group name="gender" value={formData.gender} onChange={handleChange}>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;