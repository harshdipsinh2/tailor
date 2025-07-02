import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin, Popconfirm, Row, Col, Select } from "antd";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getAllFabricTypes,
  addFabricType,
  softDeleteFabricType,
  updateFabricPrice,
  getAllBranches, // <-- import this
} from "../../api/AdminApi";

const Fabrics = () => {
  const role = localStorage.getItem('role');
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [editFabricId, setEditFabricId] = useState(null);
  const [editPriceForm] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFabrics, setFilteredFabrics] = useState([]);

  // --- Filter states ---
  const [branches, setBranches] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  useEffect(() => {
    fetchFabrics();
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const data = await getAllBranches();
      setBranches(data || []);
      const uniqueShops = [
        ...new Map(data.map((b) => [b.ShopId, { label: b.ShopName, value: b.ShopId }])).values()
      ];
      setShopOptions(uniqueShops);
    } catch {
      message.error("Failed to load branches");
    }
  };

  useEffect(() => {
    let filtered = fabrics.filter((fabric) =>
      fabric.fabricName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    // Apply shop/branch filter if selected
    if (selectedShopId) {
      const branchIds = branches
        .filter(b => b.ShopId === selectedShopId && (!selectedBranchId || b.BranchId === selectedBranchId))
        .map(b => b.BranchId);
      filtered = filtered.filter(fabric => !fabric.branchId || branchIds.includes(fabric.branchId));
    }
    setFilteredFabrics(filtered);
  }, [searchQuery, fabrics, selectedShopId, selectedBranchId, branches]);

  const fetchFabrics = async () => {
    setLoading(true);
    try {
      const data = await getAllFabricTypes(selectedShopId, selectedBranchId);
      const formatted = data.map(f => ({
        fabricId: f.FabricTypeID,
        fabricName: f.FabricName,
        pricePerMeter: f.PricePerMeter,
        stockQuantity: f.AvailableStock,
        branchId: f.BranchId,
        shopId: f.ShopId
      }));
      setFabrics(formatted);
      setFilteredFabrics(formatted);
    } catch (error) {
      console.error("Failed to load fabric types:", error);
      message.error("Failed to load fabrics.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFabric = async (values) => {
    try {
      await addFabricType({
        FabricName: values.fabricName,
        PricePerMeter: values.pricePerMeter,
        AvailableStock: values.stockQuantity,
      });
      message.success("Fabric added successfully!");
      setShowModal(false);
      form.resetFields();
      fetchFabrics();
    } catch (error) {
      console.error("Add fabric error:", error);
      message.error("Failed to add fabric.");
    }
  };

  const handleDeleteFabric = async (fabricId) => {
    try {
      await softDeleteFabricType(fabricId);
      message.success("Fabric deleted successfully!");
      fetchFabrics();
    } catch (error) {
      console.error("Delete error:", error);
      message.error("Failed to delete fabric.");
    }
  };

  const handleEditPrice = (fabric) => {
    setEditFabricId(fabric.fabricId);
    setIsEditing(true);
    editPriceForm.setFieldsValue({ pricePerMeter: fabric.pricePerMeter });
  };

  const handlePriceUpdate = async (values) => {
    try {
      await updateFabricPrice(editFabricId, values.pricePerMeter);
      message.success("Price updated successfully!");
      setIsEditing(false);
      fetchFabrics();
    } catch (error) {
      console.error("Update price error:", error);
      message.error("Failed to update price.");
    }
  };

  // Filter button handler
  const handleApplyFilters = () => {
    fetchFabrics();
  };

  return (
    <div className="fabrics-container" style={{ padding: "20px" }}>
      <Card
        title={<h2>Fabric Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by Fabric Name"
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: 250 }}
            />
            {(role === 'Admin' || role === 'Manager' || role === 'SuperAdmin') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setShowModal(true)}
              >
                Add Fabric
              </Button>
            )}
          </Space>
        }
      >
        {(role === "Admin" || role === "SuperAdmin") && (
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
              <Button type="primary" onClick={handleApplyFilters}>
                Apply Filters
              </Button>
            </Col>
          </Row>
        )}

        <Spin spinning={loading}>
          <Table
            dataSource={filteredFabrics}
            rowKey="fabricId"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            <Table.Column title="Fabric Name" dataIndex="fabricName" key="fabricName" />
            <Table.Column title="Price Per Meter" dataIndex="pricePerMeter" key="pricePerMeter" />
            <Table.Column title="Stock Quantity" dataIndex="stockQuantity" key="stockQuantity" />
            {(role === 'Admin' || role === 'Manager' || role === 'SuperAdmin') && (
              <Table.Column
                title="Actions"
                key="actions"
                render={(fabric) => (
                  <Space>
                    <Button onClick={() => handleEditPrice(fabric)}>Edit Price</Button>
                    <Popconfirm
                      title="Delete Fabric"
                      description="Are you sure you want to delete this fabric?"
                      onConfirm={() => handleDeleteFabric(fabric.fabricId)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                )}
              />
            )}
          </Table>
        </Spin>
      </Card>

      {/* Add Fabric Modal */}
      <Modal
        title="Add New Fabric"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddFabric}
        >
          <Form.Item
            label="Fabric Name"
            name="fabricName"
            rules={[{ required: true, message: "Please enter fabric name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Price Per Meter"
            name="pricePerMeter"
            rules={[{ required: true, message: "Please enter price per meter!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Stock Quantity"
            name="stockQuantity"
            rules={[{ required: true, message: "Please enter stock quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>

      {/* Edit Price Modal */}
      <Modal
        title="Edit Fabric Price"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
      >
        <Form form={editPriceForm} layout="vertical" onFinish={handlePriceUpdate}>
          <Form.Item
            label="New Price Per Meter"
            name="pricePerMeter"
            rules={[{ required: true, message: "Enter the new price!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Update</Button>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Fabrics;
