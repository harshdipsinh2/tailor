import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Radio, Button, Card, message } from "antd";
import { addCustomer } from "../api/customerapi";

const CustomerRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    address: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await addCustomer(formData);
      message.success("Customer added successfully!");
      navigate("/customers");
    } catch (error) {
      message.error("Failed to add customer. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Customer Registration</h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Full Name" name="fullName" rules={[{ required: true, message: "Please enter full name" }]}> 
            <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true, message: "Please enter phone number" }]}> 
            <Input name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Email Address" name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email address" }]}> 
            <Input name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Address" name="address" rules={[{ required: true, message: "Please enter address" }]}> 
            <Input.TextArea name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
          </Form.Item>

          <Form.Item label="Gender" name="gender" rules={[{ required: true, message: "Please select gender" }]}> 
            <Radio.Group name="gender" value={formData.gender} onChange={handleChange}>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerRegistration;