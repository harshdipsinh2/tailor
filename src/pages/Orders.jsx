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
  Popconfirm
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  EditOutlined
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

const { Option } = Select;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  // Fetch all data
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

    console.log('Raw users data:', usersData);

    // Assume each user has an ID or fall back to Email if necessary
    const formattedUsers = usersData.map(user => ({
      value: user.UserID , // Prefer numeric ID
      label: user.Name || user.name || user.FullName || user.fullName,
      isVerified: user.IsVerified ?? false
    }));

    console.log('Formatted users:', formattedUsers);

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
    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Log the form values
      console.log('Form values:', values);

      const orderData = {
        CustomerId: values.customerId,
        ProductId: values.productId,
        FabricTypeId: values.fabricId,
        AssignedTo: parseInt(values.assignedTo), // Ensure it's a number
        Quantity: values.quantity,
        OrderDate: values.orderDate.format("YYYY-MM-DD"),
        CompletionDate: values.completionDate.format("YYYY-MM-DD"),
        OrderStatus: "Pending",
        PaymentStatus: values.paymentStatus
      };

      console.log('Submitting order data:', orderData);
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

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      message.success("Order deleted successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to delete order");
    }
  };

  // Add after handleDelete and before columns
  const handleEdit = (record) => {
    form.setFieldsValue({
      customerId: record.CustomerID,
      productId: record.ProductID,
      fabricId: record.FabricTypeID,
      assignedTo: record.AssignedTo,
      quantity: record.Quantity,
      orderDate: dayjs(record.OrderDate),
      completionDate: dayjs(record.CompletionDate),
      orderStatus: record.OrderStatus,
      paymentStatus: record.PaymentStatus
    });

    setShowModal(true);
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

  // Table columns
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
      render: (date) => dayjs(date).format("DD/MM/YYYY")
    },
    {
      title: "Assigned To",
      dataIndex: "AssignedToName",
      key: "assignedTo"
    },
    {
      title: "Order Status",
      dataIndex: "OrderStatus",
      key: "orderStatus"
    },
    {
      title: "Payment Status",
      dataIndex: "PaymentStatus",
      key: "paymentStatus"
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Order"
            description="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(record.OrderID)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Orders</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by customer or product"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleOpenModal}
            >
              Add Order
            </Button>
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

      <Modal
        title={form.getFieldValue('orderId') ? "Edit Order" : "Add New Order"}
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
            <Select placeholder="Select customer">
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
            <Select placeholder="Select product">
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
            <Select placeholder="Select fabric">
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
            validateTrigger={['onChange', 'onBlur']}
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
                {form.getFieldValue('orderId') ? "Update Order" : "Create Order"}
              </Button>
              <Button onClick={() => setShowModal(false)}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;