import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Spin,
  Card,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Tag
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined,
  DollarOutlined,
  SyncOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getAllOrders,
  getAllCustomers,
  getAllProducts,
  getAllFabricTypes,
  createOrder,
  deleteOrder
} from "../api/AdminApi";
import { getAllUsers } from "../api/UserApi";
import { createCheckoutSession } from "../api/Payment";
import { updateOrderStatus } from "../api/AdminApi"; // 👈 Make sure this is exported

const { Option } = Select;

const Orders = () => {
  const role = localStorage.getItem('role');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();
  const [statusForm] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        ordersData,
        customersData,
        productsData,
        fabricsData,
        usersData
      ] = await Promise.all([
        getAllOrders(),
        getAllCustomers(),
        getAllProducts(),
        getAllFabricTypes(),
        getAllUsers()
      ]);

      const formattedUsers = usersData.map(user => ({
        value: user.UserID,
        label: user.Name || user.name || user.FullName || user.fullName,
        isVerified: user.IsVerified ?? false
      }));

      setEmployees(formattedUsers);
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setCustomers(customersData);
      setProducts(productsData);
      setFabrics(fabricsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => {
      const isPending = (order.OrderStatus || order.orderStatus)?.toLowerCase() === "pending";
      const matchesSearch = (
        order.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return isPending && matchesSearch;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const orderData = {
        CustomerId: values.customerId,
        ProductId: values.productId,
        FabricTypeId: values.fabricId,
        AssignedTo: parseInt(values.assignedTo),
        Quantity: values.quantity,
        OrderDate: values.orderDate.format("YYYY-MM-DD"),
        CompletionDate: values.completionDate.format("YYYY-MM-DD"),
        OrderStatus: "Pending",
        PaymentStatus: values.paymentStatus
        
      };

      await createOrder(orderData);
      message.success("Order created successfully");
      setShowModal(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error('Error creating order:', error);
      message.error(error.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      message.success("Order deleted successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to delete order");
    }
  };

  const handleOpenModal = () => {
    form.resetFields();
    form.setFieldsValue({
      orderDate: dayjs(),
      orderStatus: "Pending",
      paymentStatus: "Pending"
    });
    setShowModal(true);
  };

  const handlePayment = async (orderId) => {
    try {
      setLoading(true);
      const response = await createCheckoutSession(orderId);
      if (response?.url) {
        window.location.href = response.url;
      } else {
        message.error("Failed to get payment link");
      }
    } catch (error) {
      console.error("Payment error:", error);
      message.error(error.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    statusForm.setFieldsValue({
      OrderStatus: order.OrderStatus,
      PaymentStatus: order.PaymentStatus
    });
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (values) => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      await updateOrderStatus(selectedOrder.OrderID, values);
      message.success("Order status updated successfully");
      setShowStatusModal(false);
      setSelectedOrder(null);
      fetchData();
    } catch (error) {
      console.error("Update status error:", error);
      message.error(error.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer Name",
      dataIndex: "CustomerName",
      key: "customerName",
      sorter: (a, b) => a.CustomerName.localeCompare(b.CustomerName)
    },
    {
      title: "Product Name",
      dataIndex: "ProductName",
      key: "productName"
    },
    {
      title: "Fabric Name",
      dataIndex: "FabricName",
      key: "fabricName"
    },
    {
      title: "Fabric Length (m)",
      dataIndex: "FabricLength",
      key: "fabricLength"
    },
    {
      title: "Quantity",
      dataIndex: "Quantity",
      key: "quantity"
    },
    {
      title: "Total Price",
      dataIndex: "TotalPrice",
      key: "totalPrice",
      render: (price) => `₹${price.toFixed(2)}`
    },
    {
      title: "Order Date",
      dataIndex: "OrderDate",
      key: "orderDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Completion Date",
      dataIndex: "CompletionDate",
      key: "completionDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.CompletionDate).unix() - dayjs(b.CompletionDate).unix(),
    },
    {
      title: "Assigned To",
      dataIndex: "AssignedToName",
      key: "assignedTo"
    },
    {
      title: "Order Status",
      dataIndex: "OrderStatus",
      key: "orderStatus",
      render: (status) => (
        <Tag color={
          status === 'Completed' ? 'green' :
          status === 'Pending' ? 'blue' : 
          'blue'  // Default color
        }>
          {status || 'Pending'}
        </Tag>
      )
    },
    {
      title: "Payment Status",
      dataIndex: "PaymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <Tag color={
          status === 'Completed' ? 'green' :
          status === 'Pending' ? 'blue' :
          'gold'  // Default color
        }>
          {status || 'Pending'}
        </Tag>
      )
    },
    {
      title: "Approval Status",
      dataIndex: "ApprovalStatus",
      key: "approvalStatus",
      render: (status) => (
        <Tag color={
          status === 'Approved' ? 'green' :
          status === 'Rejected' ? 'red' :
          'orange'
        }>
          {status || 'Pending'}
        </Tag>
      )
    },
    // Conditionally add actions column
    ...(role !== 'Tailor' ? [{
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="Delete Order"
            description="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record.OrderID)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>

          <Popconfirm
            title="Make Payment"
            description="Do you want to proceed to payment?"
            onConfirm={() => handlePayment(record.OrderID)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" icon={<DollarOutlined />}>Pay</Button>
          </Popconfirm>

          <Button
            type="dashed"
            icon={<SyncOutlined />}
            onClick={() => handleUpdateStatus(record)}
          >
            Update Status
          </Button>
        </Space>
      )
    }] : [])
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={<h2>Orders</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by customer or product"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            {/* Only show Add Order button for admin and manager */}
            {(role === 'Admin' || role === 'Manager') && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleOpenModal}
              >
                Add Order
              </Button>
            )}
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="OrderID"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </Spin>
      </Card>

      {/* Add Order Modal */}
      <Modal
        title="Add New Order"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            orderDate: dayjs(),
            orderStatus: "Pending",
            paymentStatus: "Pending"
          }}
        >
          <Form.Item
            name="customerId"
            label="Customer"
            rules={[{ required: true, message: "Please select a customer" }]}
          >
            <Select
              placeholder="Select customer"
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {customers.map(c => (
                <Option key={c.CustomerId} value={c.CustomerId}>
                  {c.FullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="productId"
            label="Product"
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select
              placeholder="Select product"
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {products.map(p => (
                <Option key={p.ProductID} value={p.ProductID}>
                  {p.ProductName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="fabricId"
            label="Fabric"
            rules={[{ required: true, message: "Please select a fabric" }]}
          >
            <Select
              placeholder="Select fabric"
              showSearch
              allowClear
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {fabrics.map(f => (
                <Option key={f.FabricTypeID} value={f.FabricTypeID}>
                  {f.FabricName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="assignedTo"
            label="Assign To"
            rules={[{ required: true, message: "Please select a user to assign" }]}
          >
            <Select
              placeholder="Select user to assign"
              showSearch
              allowClear
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={employees}
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[{ required: true, message: "Please enter quantity" }]}
          >
            <Input type="number" min={1} />
          </Form.Item>

          <Form.Item
            name="orderDate"
            label="Order Date"
            rules={[{ required: true, message: "Please select order date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="completionDate"
            label="Completion Date"
            rules={[{ required: true, message: "Please select completion date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="paymentStatus"
            label="Payment Status"
            rules={[{ required: true, message: "Please select payment status" }]}
          >
            <Select placeholder="Select payment status">
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Create Order
              </Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Update Status Modal */}
      <Modal
        title="Update Order Status"
        open={showStatusModal}
        onCancel={() => setShowStatusModal(false)}
        footer={null}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleStatusSubmit}>
          <Form.Item
            name="OrderStatus"
            label="Order Status"
            rules={[{ required: true, message: "Select order status" }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="PaymentStatus"
            label="Payment Status"
            rules={[{ required: true, message: "Select payment status" }]}
          >
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Update Status
              </Button>
              <Button onClick={() => setShowStatusModal(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
