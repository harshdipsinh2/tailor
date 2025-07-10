import React, { useEffect, useState } from "react";
import {
  Table, Button, Modal, Form, Row, Col, Input, Radio,
  message, Card, Space, Spin, Popconfirm, Select
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined
} from "@ant-design/icons";

import {
  getAllCustomers,
  editCustomer,
  deleteCustomer,
  addMeasurement,
  getAllBranches
} from "../../api/AdminApi";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerId, setCustomerID] = useState("");
  const [show, setShow] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const [branches, setBranches] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  // Load branches and fetch customers
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const shopId = parseInt(payload.shopId);
      const branchId = parseInt(payload.branchId);

      // Admin only: load all branches
      if (role === "Admin" || role === "SuperAdmin") {
        try {
          const data = await getAllBranches();
          setBranches(data || []);
          const uniqueShops = [
            ...new Map(data.map((b) => [b.ShopId, { label: b.ShopName, value: b.ShopId }])).values()
          ];
          setShopOptions(uniqueShops);
        } catch (err) {
          message.error("Failed to load branches");
        }
      }

      // Fetch customers based on token
      if (shopId && branchId) {
        setSelectedShopId(shopId);
        setSelectedBranchId(branchId);
        fetchCustomers(shopId, branchId);
      }
    };

    init();
  }, []);

  const fetchCustomers = async (shopId, branchId) => {
    try {
      setLoading(true);
      const data = await getAllCustomers(shopId, branchId);
      const validCustomers = data.map(customer => ({
        customerId: customer.CustomerId,
        fullName: customer.FullName || 'N/A',
        phoneNumber: customer.PhoneNumber || 'N/A',
        email: customer.Email || 'N/A',
        address: customer.Address || 'N/A',
        branchName: customer.BranchName || 'N/A',
        shopName: customer.ShopName || 'N/A',
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

  useEffect(() => {
    const filteredData = customers.filter((customer) => {
      const fullName = customer?.fullName || '';
      const phoneNumber = customer?.phoneNumber || '';
      return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phoneNumber.includes(searchTerm);
    });
    setFilteredCustomers(filteredData);
  }, [searchTerm, customers]);

  const handleEditCustomer = (id) => {
    const customer = customers.find((c) => c.customerId === id);
    if (customer) {
      form.setFieldsValue(customer);
      setCustomerID(id);
      setShowMeasurement(false);
      setShow(true);
    } else {
      message.error("Customer not found.");
    }
  };

  const handleAddMeasurements = (id) => {
    setCustomerID(id);
    setShowMeasurement(true);
    form.resetFields();
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      message.success("Customer deleted successfully!");
      setCustomers((prev) => prev.filter((c) => c.customerId !== id));
    } catch {
      message.error("Failed to delete customer");
    }
  };

  const calculateFabricRequirement = (values) => {
    const upper = (Number(values.chest) || 0) * 0.5 +
      (Number(values.shoulder) || 0) * 0.3 +
      (Number(values.sleeveLength) || 0) * 2;
    const lower = (Number(values.waist) || 0) * 0.5 +
      (Number(values.hip) || 0) * 0.5 +
      (Number(values.trouserLength) || 0) * 2;
    return Math.ceil((upper + lower) * 1.1 * 100) / 100;
  };

  const handleEditSubmit = async (values) => {
    try {
      setLoading(true);
      if (showMeasurement) {
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
        };

        if (!Object.values(measurementData).some(v => v > 0))
          throw new Error("Please enter at least one measurement");

        await addMeasurement(customerId, measurementData);
        message.success("Measurement added successfully!");
        navigate("/measurements");
      } else {
        await editCustomer(customerId, values);
        message.success("Customer updated successfully!");
        setCustomers(prev =>
          prev.map(c => c.customerId === customerId ? { ...c, ...values } : c)
        );
      }

      setShow(false);
      form.resetFields();
    } catch (error) {
      message.error(error.message || "Failed to submit");
    } finally {
      setLoading(false);
    }
  };

  const upperBodyMeasurements = ["chest", "shoulder", "sleeveLength", "neck", "sleeve", "arms", "bicep", "forearm", "wrist"];
  const lowerBodyMeasurements = ["waist", "hip", "trouserLength", "inseam", "thigh", "ankle", "calf"];

  return (
    <div style={{ padding: "20px" }}>
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
        {(role === "Admin" || role === "SuperAdmin")&& (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Select
                placeholder="Filter by Shop"
                options={shopOptions}
                allowClear
                value={selectedShopId}
                onChange={(value) => {
                  setSelectedShopId(value);
                  setSelectedBranchId(null);
                }}
                style={{ width: "100%" }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Select Branch"
                allowClear
                value={selectedBranchId}
                onChange={setSelectedBranchId}
                disabled={!selectedShopId}
                style={{ width: "100%" }}
              >
                {branches
                  .filter(branch => branch.ShopId === selectedShopId)
                  .map(branch => (
                    <Select.Option key={branch.BranchId} value={branch.BranchId}>
                      {branch.BranchName}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col>
              <Button type="primary" onClick={() => fetchCustomers(selectedShopId, selectedBranchId)}>
                Apply Filters
              </Button>
            </Col>
          </Row>
        )}

        <Spin spinning={loading}>
          <Table
            dataSource={filteredCustomers}
            rowKey="customerId"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            <Table.Column title="Name" dataIndex="fullName" />
            <Table.Column title="Phone" dataIndex="phoneNumber" />
            <Table.Column title="Email" dataIndex="email" />
            <Table.Column title="Address" dataIndex="address" />
            <Table.Column title="Gender" dataIndex="gender" />
            <Table.Column
              title="Actions"
              render={(customer) => (
                <Space>
                  <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditCustomer(customer.customerId)}>
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete Customer?"
                    onConfirm={() => handleDeleteCustomer(customer.customerId)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Delete
                    </Button>
                  </Popconfirm>
                  <Button icon={<PlusOutlined />} onClick={() => handleAddMeasurements(customer.customerId)}>
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
              <h3>Upper Body</h3>
              <Row gutter={16}>
                {upperBodyMeasurements.map(field => (
                  <Col xs={24} sm={12} md={8} key={field}>
                    <Form.Item label={field.toUpperCase()} name={field}>
                      <Input type="number" min={0} step={0.5} />
                    </Form.Item>
                  </Col>
                ))}
              </Row>
              <h3>Lower Body</h3>
              <Row gutter={16}>
                {lowerBodyMeasurements.map(field => (
                  <Col xs={24} sm={12} md={8} key={field}>
                    <Form.Item label={field.toUpperCase()} name={field}>
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
