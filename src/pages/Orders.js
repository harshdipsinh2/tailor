import React, { useEffect, useState } from "react";
import {
  Table,Button,Modal, Form, Row, Col,Input, message, Card, Space, Spin, DatePicker, Select,} from "antd";
import { useNavigate } from "react-router-dom";
import { getAllOrders,addOrder,updateOrder,deleteOrder} from "../api/Orderapi";
import { getAllCustomers } from "../api/customerapi";
import { getProducts} from "../api/Productsapi";
import { getAllFabrics } from "../api/fabricapi";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderId, setOrderID] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllOrders()
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          setFilteredOrders(data);
        } else {
          setOrders([]);
          setFilteredOrders([]);
          message.warning("No order data available.");
        }
      })
      .catch((error) => message.error("Error fetching data: " + error.message))
      .finally(() => setLoading(false));

    // Fetch customers, products, and fabrics
    getAllCustomers()
      .then((data) => setCustomers(data))
      .catch((error) => message.error("Error fetching customers: " + error.message));

      getProducts()
      .then((data) => setProducts(data))
      .catch((error) => message.error("Error fetching products: " + error.message));

    getAllFabrics()
      .then((data) => setFabrics(data))
      .catch((error) => message.error("Error fetching fabrics: " + error.message));
  }, []);

  // Filter orders based on search term
  useEffect(() => {
    const filteredData = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filteredData);
  }, [searchTerm, orders]);

  const handleEditOrder = (orderId) => {
    setOrderID(orderId);

    const singleOrder = orders.find((order) => order.orderId === orderId);

    if (singleOrder) {
      form.setFieldsValue({
        ...singleOrder,
        orderDate: singleOrder.orderDate ? dayjs(singleOrder.orderDate) : null,
        completionDate: singleOrder.completionDate
          ? dayjs(singleOrder.completionDate)
          : null,
      });
      setShow(true);
    } else {
      message.error("Order not found.");
    }
  };

  const handleClose = () => setShow(false);

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      message.success("Order deleted successfully!");
      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (error) {
      message.error("Failed to delete order: " + error.message);
    }
  };

  const handleSubmit = async (values) => {
    const orderData = {
      ...values,
      orderDate: values.orderDate ? values.orderDate.format("YYYY-MM-DD") : null,
      completionDate: values.completionDate
        ? values.completionDate.format("YYYY-MM-DD")
        : null,
    };

    try {
      if (orderId) {
        await updateOrder(orderId, orderData);
        message.success("Order updated successfully!");
      } else {
        await addOrder(orderData);
        message.success("Order added successfully!");
      }

      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders);
      setFilteredOrders(updatedOrders);
    } catch (error) {
      message.error(
        (orderId ? "Failed to update order: " : "Failed to add order: ") +
          error.message
      );
    }

    setShow(false);
  };

  // Calculate total price based on fabric length and quantity
  const calculateTotalPrice = (fabricLength, quantity) => {
    const pricePerUnit = 10; // Replace with actual price per unit from fabric data
    return fabricLength * quantity * pricePerUnit;
  };

  return (
    <div className="orders-container" style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Order Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by Customer or Product"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: "250px" }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setOrderID("");
                form.resetFields();
                setShow(true);
              }}
            >
              Add Order
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredOrders}
            rowKey="orderId"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            <Table.Column title="Customer Name" dataIndex="customerName" />
            <Table.Column title="Product Name" dataIndex="productName" />
            <Table.Column title="Fabric Name" dataIndex="fabricName" />
            <Table.Column title="Fabric Length" dataIndex="fabricLength" />
            <Table.Column title="Quantity" dataIndex="quantity" />
            <Table.Column title="Total Price" dataIndex="totalPrice" />
            <Table.Column
              title="Order Date"
              dataIndex="orderDate"
              render={(date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-")}
            />
            <Table.Column
              title="Completion Date"
              dataIndex="completionDate"
              render={(date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-")}
            />
            <Table.Column title="Assigned To" dataIndex="assignedTo" />
            <Table.Column title="Order Status" dataIndex="orderStatus" />
            <Table.Column
              title="Actions"
              render={(order) => (
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditOrder(order.orderId)}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteOrder(order.orderId)}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            />
          </Table>
        </Spin>
      </Card>

      {/* Modal for Add/Update Order */}
      <Modal
        title={orderId ? "Update Order Details" : "Add New Order"}
        visible={show}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Customer Name"
                name="customerName"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Customer">
                  {customers.map((customer) => (
                    <Option key={customer.customerId} value={customer.fullName}>
                      {customer.fullName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Product Name"
                name="productName"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Product">
                  {products.map((product) => (
                    <Option key={product.productId} value={product.productName}>
                      {product.productName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Fabric Name"
                name="fabricName"
                rules={[{ required: true }]}
              >
                <Select placeholder="Select Fabric">
                  {fabrics.map((fabric) => (
                    <Option key={fabric.fabricId} value={fabric.fabricName}>
                      {fabric.fabricName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Fabric Length"
                name="fabricLength"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  onChange={(e) => {
                    const fabricLength = e.target.value;
                    const quantity = form.getFieldValue("quantity");
                    if (fabricLength && quantity) {
                      const totalPrice = calculateTotalPrice(fabricLength, quantity);
                      form.setFieldsValue({ totalPrice });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true }]}
              >
                <Input
                  type="number"
                  onChange={(e) => {
                    const quantity = e.target.value;
                    const fabricLength = form.getFieldValue("fabricLength");
                    if (fabricLength && quantity) {
                      const totalPrice = calculateTotalPrice(fabricLength, quantity);
                      form.setFieldsValue({ totalPrice });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Total Price" name="totalPrice">
                <Input readOnly />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Order Date" name="orderDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item label="Completion Date" name="completionDate">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Assigned To"
                name="assignedTo"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Order Status"
                name="orderStatus"
                rules={[{ required: true }]}
              >
                <Select>
                  <Option value="Pending">Pending</Option>
                  <Option value="In Progress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;