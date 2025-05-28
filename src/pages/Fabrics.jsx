import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getAllFabricTypes,
  addFabricType,
  softDeleteFabricType,
  updateFabricPrice, // make sure this is imported
} from "../api/AdminApi";

const Fabrics = () => {
  const role = localStorage.getItem('role'); // Get user role
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [editFabricId, setEditFabricId] = useState(null);
  const [editPriceForm] = Form.useForm();

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFabrics, setFilteredFabrics] = useState([]);

  useEffect(() => {
    fetchFabrics();
  }, []);

  useEffect(() => {
    const filtered = fabrics.filter((fabric) =>
      fabric.fabricName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFabrics(filtered);
  }, [searchQuery, fabrics]);

  const fetchFabrics = async () => {
    setLoading(true);
    try {
      const data = await getAllFabricTypes();
      const formatted = data.map(f => ({
        fabricId: f.FabricTypeID,
        fabricName: f.FabricName,
        pricePerMeter: f.PricePerMeter,
        stockQuantity: f.AvailableStock,
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
            {/* Only show Add Fabric button for admin and manager */}
            {(role === 'Admin' || role === 'Manager') && (
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
            {/* Only show actions column for admin and manager */}
            {(role === 'Admin' || role === 'Manager') && (
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
