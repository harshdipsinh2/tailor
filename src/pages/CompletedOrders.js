import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Form,
  Input,
  message,
  Card,
  Space,
  Spin,
  DatePicker,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../api/Orderapi";
import { getAllCustomers } from "../api/customerapi";
import { getProducts } from "../api/Productsapi";
import { getAllFabrics } from "../api/fabricapi";
import { getAllEmployees } from "../api/Employeesapi";
import { SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

const Orders = () => {
  // State variables
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    setLoading(true);
    getAllOrders()
      .then((data) => {
        if (Array.isArray(data)) {
          // Filter orders to only show completed orders with completed payment
          const completedOrders = data.filter(
            (order) => 
              order.orderStatus === "Completed" && 
              order.paymentStatus === "Completed"
          );
          setOrders(completedOrders);
          setFilteredOrders(completedOrders);
        } else {
          setOrders([]);
          setFilteredOrders([]);
          message.warning("No completed order data available.");
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

  return (
    <div className="orders-container" style={{ padding: "20px" }}>
      {/* Order Records Table */}
      <Card
        title={<h2 style={{ margin: 0 }}>Completed Orders</h2>}
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
          </Table>
        </Spin>
      </Card>
    </div>
  );
};

export default Orders;