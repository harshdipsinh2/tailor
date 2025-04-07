import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Input,
  message,
  Card,
  Space,
  Spin,
  DatePicker,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  getAllOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} from "../api/Orderapi";
// import {getAllCustomers,addCustomer,editCustomer,deleteCustomer,addMeasurement} from "../api/AdminApi";

import { getAllCustomers } from "../api/customerapi";
import { getProducts } from "../api/Productsapi";
import { getAllFabrics } from "../api/fabricapi";
import { getAllEmployees } from "../api/Employeesapi";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const Orders = () => {
  // State variables
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderId, setOrderID] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch initial data
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
      .catch((error) =>
        message.error("Error fetching customers: " + error.message)
      );

    getProducts()
      .then((data) => setProducts(data))
      .catch((error) =>
        message.error("Error fetching products: " + error.message)
      );

    getAllFabrics()
      .then((data) => setFabrics(data))
      .catch((error) =>
        message.error("Error fetching fabrics: " + error.message)
      );
    // Fetch employees
    getAllEmployees()
      .then((data) => setEmployees(data))
      .catch((error) =>
        message.error("Error fetching employees: " + error.message)
      );
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

  // Handle editing an order
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

  // Close the modal
  const handleClose = () => setShow(false);

  // Handle deleting an order
  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      message.success("Order deleted successfully!");
      setOrders(orders.filter((order) => order.orderId !== orderId));
    } catch (error) {
      message.error("Failed to delete order: " + error.message);
    }
  };

  // Handle adding or updating an order
  const handleSubmit = async (values) => {
    const orderData = {
      ...values,
      orderDate: values.orderDate
        ? values.orderDate.format("YYYY-MM-DD")
        : null,
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

      // Refresh order data
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

  return (
    <div className="orders-container" style={{ padding: "20px" }}>
      {/* Order Records Table */}
      <Card
        title={<h2 style={{ margin: 0 }}>Order Records</h2>}
        extra={
          <Space>
            {/* Search Field */}
            <Input
              placeholder="Search by Customer or Product"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: "250px" }}
            />
            {/* Add Order Button */}
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
          {/* Order Table */}
          <Table
            dataSource={filteredOrders}
            rowKey="orderId"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            {/* Table Columns */}
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
            <Table.Column title="Assigned To" dataIndex="assignedToName" />
            <Table.Column title="Order Status" dataIndex="orderStatus" />
            <Table.Column title="Payment Status" dataIndex="paymentStatus" />
            {/* Actions for Edit & Delete */}
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
          {/* Customer Dropdown */}
          <Form.Item
            label="Customer"
            name="customerId"
            rules={[{ required: true, message: "Please select a customer!" }]}
          >
            <Select placeholder="Select Customer">
              {customers.map((customer) => (
                <Option key={customer.customerId} value={customer.customerId}>
                  {customer.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Product Dropdown */}
          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: "Please select a product!" }]}
          >
            <Select placeholder="Select Product">
              {products.map((product) => (
                <Option key={product.productId} value={product.productId}>
                  {product.productName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Fabric Dropdown */}
          <Form.Item
            label="Fabric"
            name="fabricId"
            rules={[{ required: true, message: "Please select a fabric!" }]}
          >
            <Select placeholder="Select Fabric">
              {fabrics.map((fabric) => (
                <Option key={fabric.fabricId} value={fabric.fabricId}>
                  {fabric.fabricName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Assigned To Name */}
          <Form.Item
            label="Assigned To"
            name="assignedToName"
            rules={[
              { required: true, message: "Please enter assigned to name!" },
            ]}
          >
            <Select placeholder="Select Employee">
              {employees.map((employee) => (
                <Option key={employee.employeeId} value={employee.employeeId}>
                  {employee.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Fabric Length */}
          <Form.Item
            label="Fabric Length"
            name="fabricLength"
            rules={[{ required: true, message: "Please enter fabric length!" }]}
          >
            <Input type="number" />
          </Form.Item>

          {/* Quantity */}
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>

          {/* Completion Date */}
          <Form.Item
            label="Completion Date"
            name="completionDate"
            rules={[
              { required: true, message: "Please select a completion date!" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          {/* Assigned To Name */}
          <Form.Item
            label="Assigned To"
            name="assignedToName"
            rules={[
              { required: true, message: "Please enter assigned to name!" },
            ]}
          >
            <Input />
          </Form.Item>

          {/* Order Status */}
          <Form.Item
            label="Order Status"
            name="orderStatus"
            rules={[{ required: true, message: "Please select order status!" }]}
          >
            <Select placeholder="Select Order Status">
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          {/* Payment Status */}
          <Form.Item
            label="Payment Status"
            name="paymentStatus"
            rules={[
              { required: true, message: "Please select payment status!" },
            ]}
          >
            <Select placeholder="Select Payment Status">
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          {/* Submit and Cancel Buttons */}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button onClick={handleClose}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
