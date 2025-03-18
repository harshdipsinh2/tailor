import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { addFabric, getAllFabrics, deleteFabric } from "../api/fabricapi";

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
      const data = await getAllFabrics();
      setFabrics(data);
    } catch (error) {
      message.error("Failed to fetch fabrics.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFabric = async (values) => {
    try {
      const newFabric = await addFabric(values); // Assuming this returns the newly created fabric
      message.success("Fabric added successfully!");
      setFabrics((prevFabrics) => [...prevFabrics, newFabric]); // Directly update state
      setShowModal(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add fabric: " + error.message);
    }
};


  const handleDeleteFabric = async (fabricId) => {
    try {
      await deleteFabric(fabricId);
      message.success("Fabric deleted successfully!");
      fetchFabrics();
    } catch (error) {
      message.error("Failed to delete fabric: " + error.message);
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
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteFabric(fabric.fabricId)}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            />
          </Table>
        </Spin>
      </Card>

      <Modal
        title="Add New Fabric"
        visible={showModal}
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
