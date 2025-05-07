import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin, Popconfirm } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllFabricTypes,
  addFabricType,
  softDeleteFabricType,
} from "../api/AdminApi";


const Fabrics = () => {
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFabrics();
  }, []);

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
      fetchFabrics(); // Refresh the table
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
  

  return (
    <div className="fabrics-container" style={{ padding: "20px" }}>
      <Card
        title={<h2>Fabric Records</h2>}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowModal(true)}
          >
            Add Fabric
          </Button>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={fabrics}
            rowKey="fabricId"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            <Table.Column title="Fabric Name" dataIndex="fabricName" key="fabricName" />
            <Table.Column title="Price Per Meter" dataIndex="pricePerMeter" key="pricePerMeter" />
            <Table.Column title="Stock Quantity" dataIndex="stockQuantity" key="stockQuantity" />
            <Table.Column
              title="Actions"
              key="actions"
              render={(fabric) => (
                <Space>
                  <Popconfirm
                    title="Delete Fabric"
                    description="Are you sure you want to delete this fabric?"
                    onConfirm={() => handleDeleteFabric(fabric.fabricId)}
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
                </Space>
              )}
            />
          </Table>
        </Spin>
      </Card>

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
    </div>
  );
};

export default Fabrics;
