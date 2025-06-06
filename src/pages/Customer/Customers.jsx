import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Row, Col, Input, Radio,
  message, Card, Space, Spin, Popconfirm
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined,FilePdfOutlined
} from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CustomerListPDF from "../../Components/Pdf/CustomerListPDF";
import {
  getAllCustomers,
  editCustomer,
  deleteCustomer,
  addMeasurement
} from "../../api/AdminApi";   

const Customers = () => {
  // State management for customer data and UI controls
  const [customers, setCustomers] = useState([]); // Stores all customers
  const [filteredCustomers, setFilteredCustomers] = useState([]); // Stores searched/filtered customers
  const [searchTerm, setSearchTerm] = useState(""); // Search input value
  const [customerId, setCustomerID] = useState(""); // Selected customer ID for edit/measurement
  const [show, setShow] = useState(false); // Controls modal visibility
  const [showMeasurement, setShowMeasurement] = useState(false); // Toggle between edit and measurement forms
  const [loading, setLoading] = useState(true); // Loading state for API calls
  const [form] = Form.useForm(); // Antd form instance
  const navigate = useNavigate(); // Router navigation

  const upperBodyMeasurements = [
    "chest", "shoulder", "sleeveLength", "neck", "sleeve",
    "arms", "bicep", "forearm", "wrist"
  ];
  
  const lowerBodyMeasurements = [
    "waist", "hip", "trouserLength", "inseam", "thigh",
    "ankle", "calf"
  ];

  // Fetch customers data when component mounts
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await getAllCustomers();
  
        // Transform API data to match our frontend format
        const validCustomers = data.map(customer => ({
          customerId: customer.CustomerId,
          fullName: customer.FullName || 'N/A',
          phoneNumber: customer.PhoneNumber || 'N/A',
          email: customer.Email || 'N/A',
          address: customer.Address || 'N/A',
          gender: customer.Gender ? customer.Gender.charAt(0).toUpperCase() + customer.Gender.slice(1) : 'N/A',
        }));
  
        setCustomers(validCustomers);
        setFilteredCustomers(validCustomers);
      } catch (err) {
        console.error('Failed to load customers:', err);
        message.error("Failed to load customers");
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCustomers();
  }, []);
  
  // Filter customers based on search term
  useEffect(() => {
    const filteredData = customers.filter((customer) => {
        const fullName = customer?.fullName || '';
        const phoneNumber = customer?.phoneNumber || '';
        
        // Search by name or phone number
        return fullName.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
               phoneNumber.toString().includes(searchTerm);
    });
    setFilteredCustomers(filteredData);
  }, [searchTerm, customers]);

  // Handler for editing customer details
  const handleEditCustomer = (id) => {
    const customer = customers.find((c) => c.customerId === id);
    if (customer) {
      form.setFieldsValue(customer); // Pre-fill form with customer data
      setCustomerID(id);
      setShowMeasurement(false); // Ensure we're in edit mode, not measurement mode
      setShow(true);
    } else {
      message.error("Customer not found.");
    }
  };

  // Handler for adding customer measurements
  const handleAddMeasurements = async (id) => {
    try {
      setLoading(true);
      
      if (!id) throw new Error('Customer ID is required');
  
      setCustomerID(id);
      setShowMeasurement(true); // Switch to measurement form
      form.resetFields(); // Clear form fields
      setShow(true);
    } catch (error) {
      console.error("Failed to prepare measurement form:", error);
      message.error("Failed to load measurement form");
      setShow(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => setShow(false);

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      message.success("Customer deleted successfully!");
      setCustomers((prev) => prev.filter((c) => c.customerId !== id));
    } catch (err) {
      message.error("Failed to delete customer");
    }
  };

  // Add this function in your Customers component
  const calculateFabricRequirement = (values) => {
    // Upper body fabric calculation
    const upperBodyFabric = (
      (Number(values.chest) || 0) * 0.5 +
      (Number(values.shoulder) || 0) * 0.3 +
      (Number(values.sleeveLength) || 0) * 2
    );
  
    // Lower body fabric calculation
    const lowerBodyFabric = (
      (Number(values.waist) || 0) * 0.5 +
      (Number(values.hip) || 0) * 0.5 +
      (Number(values.trouserLength) || 0) * 2
    );
  
    // Add some allowance for seams and adjustments
    const totalFabric = (upperBodyFabric + lowerBodyFabric) * 1.1;
    return Math.ceil(totalFabric * 100) / 100; // Round to 2 decimal places
  };

  // Form submission handler for both edit and measurement forms
  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
  
      if (showMeasurement) {
        // Ensure we have a valid customerId
        if (!customerId) {
          throw new Error('Customer ID is required');
        }
  
        console.log('Submitting measurement for customer:', customerId);
  
        // Format measurement data
        const measurementData = {
          Chest: parseFloat(values.chest) || 0,
          Waist: parseFloat(values.waist) || 0,
          Hip: parseFloat(values.hip) || 0,
          Shoulder: parseFloat(values.shoulder) || 0,
          SleeveLength: parseFloat(values.sleeveLength) || 0,
          TrouserLength: parseFloat(values.trouserLength) || 0,
          Inseam: parseFloat(values.inseam) || 0,
          Thigh: parseFloat(values.thigh) || 0,
          Neck: parseFloat(values.neck) || 0,
          Sleeve: parseFloat(values.sleeve) || 0,
          Arms: parseFloat(values.arms) || 0,
          Bicep: parseFloat(values.bicep) || 0,
          Forearm: parseFloat(values.forearm) || 0,
          Wrist: parseFloat(values.wrist) || 0,
          Ankle: parseFloat(values.ankle) || 0,
          Calf: parseFloat(values.calf) || 0,
          EstimatedFabric: calculateFabricRequirement(values)
        };
  
        // Validate that at least one measurement is entered
        const hasValues = Object.values(measurementData)
          .some(val => val > 0);
  
        if (!hasValues) {
          throw new Error('Please enter at least one measurement');
        }
  
        // Call API with correct numeric CustomerId
        const numericCustomerId = Number(customerId);
        const response = await addMeasurement(numericCustomerId, measurementData);

        console.log('Measurement added:', response);
        message.success("Measurement added successfully!");
        navigate('/measurements');
      } else {
        // Handle customer edit
        await editCustomer(customerId, values);
        message.success("Customer updated successfully!");
        setCustomers(prev =>
          prev.map(c => c.customerId === customerId ? { ...c, ...values } : c)
        );
      }
  
      setShow(false);
      form.resetFields();
    } catch (error) {
      console.error('Submission error:', error);
      message.error(error.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };
  
  // Array of measurement fields for dynamic form generation
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
       {/* PDF Download Icon with Popconfirm */}
    <Popconfirm
      title="Download customer list as PDF?"
      onConfirm={() => document.getElementById("customer-pdf-download").click()}
      okText="Yes"
      cancelText="No"
    >
      <span style={{ cursor: "pointer", fontSize: 20, color: "#1890ff" }}>
        <FilePdfOutlined />
      </span>
    </Popconfirm>
    <PDFDownloadLink
      id="customer-pdf-download"
      document={<CustomerListPDF customers={filteredCustomers} />}
      fileName="customers_list.pdf"
      style={{ display: "none" }}
    >
      {({ loading }) => (loading ? "Loading..." : null)}
    </PDFDownloadLink>
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
            <Table.Column 
              title="Name" 
              dataIndex="fullName" 
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Phone" 
              dataIndex="phoneNumber" 
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Email" 
              dataIndex="email" 
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Address" 
              dataIndex="address" 
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Gender" 
              dataIndex="gender" 
              render={(text) => text || 'N/A'} 
            />
            <Table.Column
              title="Actions"
              render={(customer) => (
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditCustomer(customer.customerId)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete Customer"
                    description="Are you sure you want to delete this customer?"
                    onConfirm={() => handleDeleteCustomer(customer.customerId)}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
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
        open={show}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          {showMeasurement ? (
            <>
              <h3>Upper Body Measurements</h3>
              <Row gutter={16}>
                {upperBodyMeasurements.map((field) => (
                  <Col xs={24} sm={12} md={8} key={field}>
                    <Form.Item
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                    >
                      <Input type="number" min={0} step={0.5} />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
              <h3>Lower Body Measurements</h3>
              <Row gutter={16}>
                {lowerBodyMeasurements.map((field) => (
                  <Col xs={24} sm={12} md={8} key={field}>
                    <Form.Item
                      label={field.charAt(0).toUpperCase() + field.slice(1)}
                      name={field}
                    >
                      <Input type="number" min={0} step={0.5} />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </>
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