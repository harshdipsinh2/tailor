import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Row, Col, Input, Radio, message, Card, Space, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { updateCustomer, getAllCustomers, deleteCustomer } from "../api/customerapi";
import { addMeasurement } from "../api/measurementapi";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]); // For search filtering
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const [customerId, setCustomerID] = useState("");
  const [show, setShow] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for table
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllCustomers()
      .then((data) => {
        setCustomers(data);
        setFilteredCustomers(data); // Initialize filtered data
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setLoading(false));
  }, []);

  // Filter customers based on search term
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

  const handleDeleteCustomer = async (customerId) => {
    try {
      await deleteCustomer(customerId);
      message.success("Customer deleted successfully!");
      setCustomers(customers.filter(customer => customer.customerId !== customerId));
    } catch (error) {
      message.error("Failed to delete customer: " + error.message);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      if (showMeasurement) {
        await addMeasurement(customerId, values);
        message.success("Measurement added successfully!");
      } else {
        await updateCustomer(customerId, values);
        message.success("Customer updated successfully!");
      }
      setCustomers(prevCustomers =>
        prevCustomers.map(customer =>
          customer.customerId === customerId ? { ...customer, ...values } : customer
        )
      );
    } catch (error) {
      message.error((showMeasurement ? "Failed to add measurement: " : "Failed to update customer: ") + error.message);
    }
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
            dataSource={filteredCustomers} // Filtered data for display
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
        width={800} // Adjust modal width
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