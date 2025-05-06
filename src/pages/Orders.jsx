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
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

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
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(true);

    // Mock data setup
    const mockOrders = [
      {
        orderId: 1,
        customerName: "John Doe",
        productName: "Shirt",
        fabricName: "Cotton",
        fabricLength: 2,
        quantity: 1,
        totalPrice: 1000,
        orderDate: "2024-05-01",
        completionDate: "2024-05-10",
        assignedToName: "Jane Smith",
        orderStatus: "Pending",
        paymentStatus: "Completed",
      },
    ];

    const mockCustomers = [{ customerId: 1, fullName: "John Doe" }];
    const mockProducts = [{ productId: 1, productName: "Shirt" }];
    const mockFabrics = [{ fabricId: 1, fabricName: "Cotton" }];
    const mockEmployees = [{ employeeId: 1, fullName: "Jane Smith" }];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    setCustomers(mockCustomers);
    setProducts(mockProducts);
    setFabrics(mockFabrics);
    setEmployees(mockEmployees);
    setLoading(false);
  }, []);

  useEffect(() => {
    const filtered = orders.filter(
      (order) =>
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleEditOrder = (id) => {
    setOrderID(id);
    const existing = orders.find((order) => order.orderId === id);

    if (existing) {
      form.setFieldsValue({
        ...existing,
        orderDate: dayjs(existing.orderDate),
        completionDate: dayjs(existing.completionDate),
      });
      setShow(true);
    } else {
      message.error("Order not found.");
    }
  };

  const handleClose = () => setShow(false);

  const handleDeleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== id));
    setFilteredOrders((prev) => prev.filter((o) => o.orderId !== id));
    message.success("Order deleted (mock)!");
  };

  const handleSubmit = (values) => {
    const formatted = {
      ...values,
      orderDate: values.orderDate.format("YYYY-MM-DD"),
      completionDate: values.completionDate.format("YYYY-MM-DD"),
      customerName: customers.find((c) => c.customerId === values.customerId)?.fullName || "",
      productName: products.find((p) => p.productId === values.productId)?.productName || "",
      fabricName: fabrics.find((f) => f.fabricId === values.fabricId)?.fabricName || "",
      assignedToName: employees.find((e) => e.employeeId === values.assignedToName)?.fullName || "",
      totalPrice: values.fabricLength * values.quantity * 100, // mock pricing logic
    };

    if (orderId) {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, ...formatted } : o))
      );
      message.success("Order updated (mock)!");
    } else {
      const newOrder = { ...formatted, orderId: Date.now() };
      setOrders((prev) => [...prev, newOrder]);
      message.success("Order added (mock)!");
    }

    setFilteredOrders((prev) =>
      orderId
        ? prev.map((o) => (o.orderId === orderId ? { ...o, ...formatted } : o))
        : [...prev, { ...formatted, orderId: Date.now() }]
    );

    form.resetFields();
    setOrderID("");
    setShow(false);
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
            <Table.Column title="Assigned To" dataIndex="assignedToName" />
            <Table.Column title="Order Status" dataIndex="orderStatus" />
            <Table.Column title="Payment Status" dataIndex="paymentStatus" />
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

      <Modal
        title={orderId ? "Update Order Details" : "Add New Order"}
        open={show}
        onCancel={handleClose}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Customer"
            name="customerId"
            rules={[{ required: true, message: "Please select a customer!" }]}
          >
            <Select placeholder="Select Customer">
              {customers.map((c) => (
                <Option key={c.customerId} value={c.customerId}>
                  {c.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: "Please select a product!" }]}
          >
            <Select placeholder="Select Product">
              {products.map((p) => (
                <Option key={p.productId} value={p.productId}>
                  {p.productName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Fabric"
            name="fabricId"
            rules={[{ required: true, message: "Please select a fabric!" }]}
          >
            <Select placeholder="Select Fabric">
              {fabrics.map((f) => (
                <Option key={f.fabricId} value={f.fabricId}>
                  {f.fabricName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Assigned To"
            name="assignedToName"
            rules={[{ required: true, message: "Please select an employee!" }]}
          >
            <Select placeholder="Select Employee">
              {employees.map((e) => (
                <Option key={e.employeeId} value={e.employeeId}>
                  {e.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Fabric Length"
            name="fabricLength"
            rules={[{ required: true, message: "Please enter fabric length!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Completion Date"
            name="completionDate"
            rules={[{ required: true, message: "Please select completion date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

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

          <Form.Item
            label="Payment Status"
            name="paymentStatus"
            rules={[{ required: true, message: "Please select payment status!" }]}
          >
            <Select placeholder="Select Payment Status">
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

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
