import React, { useEffect, useState } from "react";
import {Table, Button, Modal, Form, Input, Space, Spin,Card, Select, DatePicker, message, Popconfirm,Tag
} from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, DollarOutlined, SyncOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import {getAllOrders,getAllCustomers,getAllProducts , getAllFabricTypes,createOrder,deleteOrder
} from "../../api/AdminApi";
import { getAllUsers , getAllTailors } from "../../api/UserApi";
import { createCheckoutSession } from "../../api/Payment";
import { updateOrderStatus } from "../../api/AdminApi"; 
import orderactions from "./OrderActions"; // Import OrderActions component

const { Option } = Select;

const Orders = () => {
  // Get user role from localStorage for permission checks
  const role = localStorage.getItem('role');

  // State declarations for managing orders and UI
  const [orders, setOrders] = useState([]); // Store all orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Store filtered orders based on search
  const [customers, setCustomers] = useState([]); // Store customer list for dropdowns
  const [products, setProducts] = useState([]); // Store product list for dropdowns
  const [fabrics, setFabrics] = useState([]); // Store fabric list for dropdowns
  const [employees, setEmployees] = useState([]); // Store employee list for assignment
  const [tailors, setTailors] = useState([]); // Store tailors for assignment
  const [loading, setLoading] = useState(false); // Loading state for API calls
  const [showModal, setShowModal] = useState(false); // Control add order modal visibility
  const [showStatusModal, setShowStatusModal] = useState(false); // Control status update modal
  const [selectedOrder, setSelectedOrder] = useState(null); // Store currently selected order
  const [searchTerm, setSearchTerm] = useState(""); // Store search input value
  const [form] = Form.useForm(); // Form instance for add order
  const [statusForm] = Form.useForm(); // Form instance for status update 

  // Fetch all necessary data when component mounts
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all required data in parallel
      const [ordersData, customersData, productsData, fabricsData, tailorsData] = 
        await Promise.all([
          getAllOrders(),
          getAllCustomers(),
          getAllProducts(),
          getAllFabricTypes(),
          
          getAllTailors()
        ]);

        const formattedTailors = tailorsData.map(user => ({
  value: user.UserID,
  label: user.Name || user.name || user.FullName || user.fullName,
  isVerified: user.IsVerified ?? false
}));

setEmployees(formattedTailors); // This feeds the Assign To <Select>


      // Format users data for the dropdown
      // const formattedUsers = usersData.map(user => ({
      //   value: user.UserID,
      //   label: user.Name || user.name || user.FullName || user.fullName,
      //   isVerified: user.IsVerified ?? false
      // }));

      // // Update all state variables with fetched data
      // setEmployees(formattedTailors);
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

  // Load data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Filter orders based on search term
  useEffect(() => {
    const filtered = orders.filter(order => {
      // Check if order is pending and matches search term
      const isPending = (order.OrderStatus || order.orderStatus)?.toLowerCase() === "pending";
      const matchesSearch = (
        order.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return isPending && matchesSearch;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  // Handler for creating new order
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Format order data for API
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
      fetchData(); // Refresh data after creation
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
    // Check if user is Tailor and order is not approved
    if (role === 'Tailor' && order.ApprovalStatus !== 'Approved') {
      message.error('You can only update approved orders');
      return;
    }

    setSelectedOrder(order);
    statusForm.setFieldsValue({
      OrderStatus: order.OrderStatus,
      PaymentStatus: order.PaymentStatus,
      CompletionDate: order.CompletionDate ? dayjs(order.CompletionDate) : null
    });
    setShowStatusModal(true);
  };

  const handleStatusSubmit = async (values) => {
    if (!selectedOrder) return;
    setLoading(true);
    try {
      // If Tailor role, only send OrderStatus
      const updateData = role === 'Tailor' 
        ? { OrderStatus: values.OrderStatus, PaymentStatus: selectedOrder.PaymentStatus }
        : values;

      await updateOrderStatus(selectedOrder.OrderID, updateData);
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {/* Show Delete and Payment buttons for Admin/Manager/SuperAdmin */}
          {(role === 'Admin' || role === 'Manager' || role === 'SuperAdmin') && (
            <>
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
                disabled={record.PaymentStatus === 'Completed'}
              >
                <Button 
                  type="primary" 
                  icon={<DollarOutlined />}
                  disabled={record.PaymentStatus === 'Completed'}
                  style={{ 
                    opacity: record.PaymentStatus === 'Completed' ? 0.5 : 1,
                    cursor: record.PaymentStatus === 'Completed' ? 'not-allowed' : 'pointer'
                  }}
                >
                  {record.PaymentStatus === 'Completed' ? 'Paid' : 'Pay'}
                </Button>
              </Popconfirm>
            </>
          )}
          
          {/* Update Status button remains the same */}
          <Button
            type="dashed"
            icon={<SyncOutlined />}
            onClick={() => handleUpdateStatus(record)}
            disabled={role === 'Tailor' && record.ApprovalStatus !== 'Approved'}
            style={{
              opacity: (role === 'Tailor' && record.ApprovalStatus !== 'Approved') ? 0.5 : 1,
              cursor: (role === 'Tailor' && record.ApprovalStatus !== 'Approved') ? 'not-allowed' : 'pointer'
            }}
          >
            Update Status
          </Button>
        </Space>
      )
    }
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
            {(role === 'Admin' || role === 'Manager' || role === 'SuperAdmin') && (
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

          {/* Only show Payment Status field for non-Tailor roles */}
          {role !== 'Tailor' && (
            <>
              <Form.Item
                name="PaymentStatus"
                label="Payment Status"
                rules={[{ required: true, message: "Select payment status" }]}
              >
                <Select 
                  disabled={selectedOrder?.PaymentStatus === 'Completed'}
                  style={{ 
                    opacity: selectedOrder?.PaymentStatus === 'Completed' ? 0.5 : 1
                  }}
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="Completed">Completed</Option>
                </Select>
              </Form.Item>

              {selectedOrder?.PaymentStatus === 'Completed' && (
                <div style={{ marginBottom: 16, color: '#ff4d4f' }}>
                  Payment status cannot be changed once completed
                </div>
              )}
            </>
          )}

          <Form.Item
            name="CompletionDate"
            label="Completion Date"
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
              >
                Update Status
              </Button>
              <Button onClick={() => setShowStatusModal(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
