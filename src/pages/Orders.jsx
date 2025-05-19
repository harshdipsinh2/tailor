import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Space,
  Spin,
  DatePicker,
  Select,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getAllOrders,
  getAllCustomers,
  getAllProducts,
  getAllFabricTypes,
  createOrder,
  updateOrder,
  getAllMeasurements
} from "../api/AdminApi";
import { getAllUsers } from "../api/UserApi";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderInvoicePDF from "../Components/Pdf/OrderInvoicePDF";

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
  const [measurements, setMeasurements] = useState([]); // Add this state
  const [form] = Form.useForm();

  // Add this function to calculate fabric requirement
  const calculateFabricRequirement = (measurements) => {
    const inchToMeter = 0.0254;

    const shirtLength = 30; // standard shirt length
    const upperBodyFabric =
      (shirtLength + (Number(measurements.sleeveLength) || 24) + 6) *
      inchToMeter;

    const lowerBodyFabric =
      ((Number(measurements.trouserLength) || 40) + 10) * inchToMeter;

    const totalFabric = upperBodyFabric + lowerBodyFabric;
    const fabricWithAllowance = totalFabric * 1.15;

    return Math.ceil(fabricWithAllowance * 10) / 10;
  };

  // Modify fetchData to include measurements
  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, customersRes, productsRes, fabricsRes, usersRes, measurementsRes] = 
        await Promise.all([
          getAllOrders(),
          getAllCustomers(),
          getAllProducts(),
          getAllFabricTypes(),
          getAllUsers(),
          getAllMeasurements(), // Add this API call
        ]);

      // Ensure unique IDs in customer data
      const formattedCustomers = customersRes.map((c) => ({
        customerId: c.CustomerId || c.customerId || `customer-${Math.random()}`,
        fullName: c.FullName || c.fullName || "N/A",
      }));

      // Ensure unique IDs in product data
      const formattedProducts = productsRes.map((p) => ({
        productId: p.ProductID || p.productId || `product-${Math.random()}`,
        productName: p.ProductName || p.productName || "N/A",
      }));

      // Ensure unique IDs in fabric data
      const formattedFabrics = fabricsRes.map((f) => ({
        fabricId: f.FabricTypeID || f.fabricId || `fabric-${Math.random()}`,
        fabricName: f.FabricName || f.fabricName || "N/A",
      }));

      // Ensure unique IDs in employee data
      const formattedEmployees = usersRes
        .filter((u) => u.RoleName?.toLowerCase() === "tailor")
        .map((e) => ({
          employeeId: parseInt(e.Id) || parseInt(e.id), // Ensure integer ID
          fullName: e.Name || e.name || "N/A",
        }));

      // Update orders filtering to only show pending orders
      const formattedOrders = ordersRes
        .map((order) => ({
          ...order,
          orderId: order.OrderId || order.orderId || `order-${Math.random()}`,
          customerName: order.CustomerName || order.customerName || "N/A",
          productName: order.ProductName || order.productName || "N/A",
          fabricName: order.FabricName || order.fabricName || "N/A",
          fabricLength: order.FabricLength || order.fabricLength || 0,
          quantity: order.Quantity || order.quantity || 0,
          totalPrice: order.TotalPrice || order.totalPrice || 0,
          orderDate: order.OrderDate || order.orderDate,
          completionDate: order.CompletionDate || order.completionDate,
          assignedToName: order.AssignedToName || order.assignedToName || "N/A",
          orderStatus: order.OrderStatus || order.orderStatus || "Pending",
          paymentStatus: order.PaymentStatus || order.paymentStatus || "Pending",
        }))
        .filter(order => {
          // Show order if either order status or payment status is pending
          const isOrderPending = order.orderStatus?.toLowerCase() === "pending";
          const isPaymentPending = order.paymentStatus?.toLowerCase() === "pending";
          return isOrderPending || isPaymentPending;
        });

      setCustomers(formattedCustomers);
      setProducts(formattedProducts);
      setFabrics(formattedFabrics);
      setEmployees(formattedEmployees);
      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
      // Store measurements data
      setMeasurements(measurementsRes);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const customerNameMatch =
        order?.customerName?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) || false;
      const productNameMatch =
        order?.productName?.toLowerCase?.()?.includes(searchTerm.toLowerCase()) || false;
      return customerNameMatch || productNameMatch;
    });
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
        assignedToId: existing.assignedToId,
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

  // Add this function to handle customer selection
  const handleCustomerSelect = (customerId) => {
    const customerMeasurement = measurements.find(m => m.CustomerId === customerId);
    if (customerMeasurement) {
      const estimatedFabric = calculateFabricRequirement({
        chest: customerMeasurement.Chest,
        shoulder: customerMeasurement.Shoulder,
        sleeveLength: customerMeasurement.SleeveLength,
        waist: customerMeasurement.Waist,
        hip: customerMeasurement.Hip,
        trouserLength: customerMeasurement.TrouserLength,
      });
      
      form.setFieldValue('fabricLength', estimatedFabric);
    }
  };

  // Update handleSubmit to match API expectations
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Validate required fields
      if (!values.customerId || !values.productId || !values.fabricId) {
        throw new Error('Please fill in all required fields');
      }

      const orderData = {
        CustomerId: parseInt(values.customerId),
        ProductId: parseInt(values.productId),
        FabricTypeId: parseInt(values.fabricId),
        AssignedTo: values.assignedToId ? parseInt(values.assignedToId) : 0,
        FabricLength: parseFloat(values.fabricLength),
        Quantity: parseInt(values.quantity),
        OrderDate: values.orderDate?.format("YYYY-MM-DD"),
        CompletionDate: values.completionDate?.format("YYYY-MM-DD"),
        OrderStatus: values.orderStatus || "Pending",
        PaymentStatus: values.paymentStatus || "Pending"
      };

      // Validate numeric values
      if (isNaN(orderData.FabricLength) || orderData.FabricLength <= 0) {
        throw new Error('Invalid fabric length');
      }
      if (isNaN(orderData.Quantity) || orderData.Quantity <= 0) {
        throw new Error('Invalid quantity');
      }

      console.log('Sending order data:', orderData);

      if (orderId) {
        await updateOrder(orderId, orderData);
        message.success("Order updated successfully!");
      } else {
        await createOrder(orderData);
        message.success("Order created successfully!");
      }

      await fetchData();
      form.resetFields();
      setOrderID("");
      setShow(false);
    } catch (error) {
      console.error("Error submitting order:", error);
      message.error(error.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
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
                  <Popconfirm
                    title="Delete Order"
                    description="Are you sure you want to delete this order?"
                    onConfirm={() => handleDeleteOrder(order.orderId)}
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
                  <PDFDownloadLink
                    document={<OrderInvoicePDF order={order} />}
                    fileName={`invoice-${order.orderId}.pdf`}
                    style={{ textDecoration: "none" }}
                  >
                    {({ loading }) => (
                      <Button type="dashed">
                        {loading ? "Generating..." : "Download Invoice"}
                      </Button>
                    )}
                  </PDFDownloadLink>
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
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            orderStatus: "Pending",
            paymentStatus: "Pending",
            orderDate: dayjs(),
          }}
        >
          <Form.Item
            label="Customer"
            name="customerId"
            rules={[{ required: true, message: "Please select a customer!" }]}
          >
            <Select 
              placeholder="Select Customer"
              onChange={handleCustomerSelect}
            >
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

          <Form.Item label="Assigned To" name="assignedToId">
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
            <Input 
              type="number" 
              step="0.1"
              addonAfter="meters"
            />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter quantity!" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Order Date"
            name="orderDate"
            rules={[{ required: true, message: "Please select order date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Completion Date"
            name="completionDate"
            rules={[{ required: true, message: "Please select completion date!" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Order Status" name="orderStatus" rules={[{ required: true }]}>
            <Select disabled={!orderId}>
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
              <Button type="primary" htmlType="submit" loading={loading}>
                {orderId ? "Update" : "Submit"}
              </Button>
              <Button onClick={handleClose} disabled={loading}>
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