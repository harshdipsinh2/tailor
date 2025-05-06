import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Input, Radio, message, Card, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
// import { updateCustomer, getAllCustomers, deleteCustomer } from "../api/customerapi";
// import { addMeasurement } from "../api/measurementapi";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

const Customers = () => {
  const [customers, setCustomers] = useState([
    // Dummy data for testing
    {
      customerId: "1",
      fullName: "John Doe",
      phoneNumber: "1234567890",
      email: "john@example.com",
      address: "123 Main St",
      gender: "male"
    },
    {
      customerId: "2",
      fullName: "Jane Smith",
      phoneNumber: "9876543210",
      email: "jane@example.com",
      address: "456 Elm St",
      gender: "female"
    }
  ]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerId, setCustomerID] = useState("");
  const [show, setShow] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  useEffect(() => {
    const filteredData = customers.filter((customer) =>
      customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phoneNumber.includes(searchTerm)
    );
    setFilteredCustomers(filteredData);
  }, [searchTerm, customers]);

  const handleEditCustomer = (customerId) => {
    setCustomerID(customerId);
    setShowMeasurement(false);
    const singleCustomer = customers.find((customer) => customer.customerId === customerId);
    if (singleCustomer) {
      form.setFieldsValue(singleCustomer);
      setShow(true);
    } else {
      message.error("Customer not found.");
    }
  };

  const handleAddMeasurements = (customerId) => {
    setCustomerID(customerId);
    setShowMeasurement(true);
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleDeleteCustomer = (customerId) => {
    // Simulate delete
    // await deleteCustomer(customerId);
    message.success("Customer deleted successfully!");
    setCustomers(customers.filter(customer => customer.customerId !== customerId));
  };

  const handleEditSubmit = (values) => {
    if (showMeasurement) {
      // Simulate addMeasurement(customerId, values);
      message.success("Measurement added successfully!");
    } else {
      // Simulate updateCustomer(customerId, values);
      message.success("Customer updated successfully!");
    }
    setCustomers(prev =>
      prev.map(c => c.customerId === customerId ? { ...c, ...values } : c)
    );
    setShow(false);
  };

  const measurementFields = [
    "chest", "waist", "hip", "shoulder", "sleeveLength",
    "trouserLength", "inseam", "thigh", "neck", "sleeve",
    "arms", "bicep", "forearm", "wrist", "ankle", "calf"
  ];

  return (
    <div className="customers-container" style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Customer Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by Name or Mobile"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: "250px" }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/customer-registration")}
            >
              Add Customer
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredCustomers}
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
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditCustomer(customer.customerId)}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteCustomer(customer.customerId)}
                  >
                    Delete
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={() => handleAddMeasurements(customer.customerId)}
                  >
                    Add Measurement
                  </Button>
                </Space>
              )}
            />
          </Table>
        </Spin>
      </Card>

      <Modal
        title={showMeasurement ? "Add Measurements" : "Update Customer Details"}
        visible={show}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
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
          <Space>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Customers;
