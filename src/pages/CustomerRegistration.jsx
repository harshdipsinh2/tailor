import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Radio, Button, Card, message } from "antd";
import { addCustomer } from "../api/AdminApi";

const CustomerRegistration = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    try {
      await addCustomer(values);
      message.success("Customer added successfully!");
      navigate("/customers");
    } catch (error) {
      message.error("Failed to add customer. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-lg p-4 bg-white">
        <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
          Customer Registration
        </h2>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Full Name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: "Please enter a valid email address" },
              { type: "email", message: "Invalid email format" },
            ]}
          >
            <Input placeholder="Email Address" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input.TextArea placeholder="Address" rows={3} />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[{ required: true, message: "Please select gender" }]}
          >
            <Radio.Group className="flex space-x-4">
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg h-10 transition-all duration-300"
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerRegistration;
