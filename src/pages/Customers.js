import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Input, Radio, message } from "antd";
import { useNavigate } from "react-router-dom"; // For navigation
import { updateCustomer, getAllCustomers } from "../api/customerapi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerID] = useState("");
  const [show, setShow] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [form] = Form.useForm(); // Ant Design Form instance
  const navigate = useNavigate();

  useEffect(() => {
    getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleEditCustomer = (customerId) => {
    setCustomerID(customerId);
    setShowMeasurement(false);

    const singleCustomer = customers.find((customer) => customer.customerId === customerId);

    // Set form values correctly
    form.setFieldsValue(singleCustomer);

    setShow(true);
  };

  const handleAddMeasurements = (customerId) => {
    setCustomerID(customerId);
    setShowMeasurement(true);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleEditSubmit = async (values) => {
    try {
      console.log("Updating customer with ID:", customerId, "and data:", values);
      const response = await updateCustomer(customerId, values);

      message.success("Customer updated successfully!");
    } catch (error) {
      message.error("Failed to update customer: " + error.message);
    }
    setShow(false);
  };

  const measurementFields = [
    "chest", "waist", "hip", "shoulder", "sleeveLength",
    "trouserLength", "inseam", "thigh", "neck", "sleeve",
    "arms", "bicep", "forearm", "wrist", "ankle", "calf"
  ];

  return (
    <div className="customers-container" style={{ textAlign: "center" }}>
      <h2>Customer List</h2>

      {/* Add Customer Button in Top-Right Corner */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
<Button type="primary" onClick={() => navigate("/customer-registration")}>

          Add Customer
        </Button>
      </div>

      <Table
        dataSource={customers}
        rowKey="customerId"
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: "max-content" }}
      >
        <Table.Column title="Name" dataIndex="fullName" key="fullName" />
        <Table.Column title="Phone" dataIndex="phoneNumber" key="phoneNumber" />
        <Table.Column title="Email" dataIndex="email" key="email" />
        <Table.Column title="Address" dataIndex="address" key="address" />
        <Table.Column title="Gender" dataIndex="gender" key="gender" />
        <Table.Column
          title="Actions"
          key="actions"
          render={(customer) => (
            <>
              <Button type="primary" onClick={() => handleEditCustomer(customer.customerId)}>Edit</Button>{" "}
              <Button danger>Delete</Button>{" "}
              <Button onClick={() => handleAddMeasurements(customer.customerId)}>Add Measurement</Button>
            </>
          )}
        />
      </Table>

      {/* Modal for Edit / Add Measurements */}
      <Modal
        title={showMeasurement ? "Add Measurements" : "Update Customer Details"}
        visible={show}
        onCancel={handleClose}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          {showMeasurement ? (
            <Row gutter={16}>
              {measurementFields.map((field) => (
                <Col xs={24} sm={12} md={8} key={field}>
                  <Form.Item
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                  >
                    <Input type="number" />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          ) : (
            <>
              <Form.Item label="Full Name" name="fullName" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Email Address" name="email" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Address" name="address" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Radio.Group>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          )}

          <Button type="primary" htmlType="submit">Update Changes</Button>{" "}
          <Button onClick={handleClose}>Cancel</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;
