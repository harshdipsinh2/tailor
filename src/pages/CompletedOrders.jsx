import React, { useEffect, useState } from "react";
import { Table, Input, message, Card, Space, Spin, Popconfirm } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { getAllOrders } from "../api/AdminApi";
import CompletedOrdersPDF from "../Components/Pdf/CompletedOrdersPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";
import dayjs from "dayjs";

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch completed orders
  useEffect(() => {
    const fetchCompletedOrders = async () => {
      setLoading(true);
      try {
        const data = await getAllOrders();
        console.log("Raw API response:", data); // Debug log

        // Filter for completed orders only with case-insensitive comparison
        const completedOrders = data.filter((order) => {
          console.log("Checking order:", order); // Debug log
          const orderStatus = order.OrderStatus || order.orderStatus;
          const paymentStatus = order.PaymentStatus || order.paymentStatus;

          return (
            orderStatus?.toLowerCase() === "completed" 
          );
        });

        console.log("Completed orders:", completedOrders); // Debug log

        // Transform the data to ensure consistent property names
        const formattedOrders = completedOrders.map((order) => ({
          orderId: order.OrderId || order.orderId,
          customerName: order.CustomerName || order.customerName || "N/A",
          productName: order.ProductName || order.productName || "N/A",
          fabricName: order.FabricName || order.fabricName || "N/A",
          fabricLength: order.FabricLength || order.fabricLength || 0,
          quantity: order.Quantity || order.quantity || 0,
          totalPrice: order.TotalPrice || order.totalPrice || 0,
          orderDate: order.OrderDate || order.orderDate,
          completionDate: order.CompletionDate || order.completionDate,
          assignedToName: order.AssignedToName || order.assignedToName || "N/A",
          orderStatus: order.OrderStatus || order.orderStatus,
          paymentStatus: order.PaymentStatus || order.paymentStatus,
        }));

        console.log("Formatted orders:", formattedOrders); // Debug log

        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
        message.error("Failed to fetch completed orders: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedOrders();
  }, []);

  // Filter orders based on search term
  useEffect(() => {
    const filtered = orders.filter((order) => {
      const customerNameMatch =
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      const productNameMatch =
        order.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false;
      return customerNameMatch || productNameMatch;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  return (
    <div className="completed-orders-container" style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Completed Orders</h2>}
        extra={
          <Space>
            <Popconfirm
              title=" Are you sure you want to download PDF?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                // Let the link render normally
                document.getElementById("pdf-download-trigger").click();
              }}
            >
              <span>
                <PDFDownloadLink
                  id="pdf-download-trigger"
                  document={<CompletedOrdersPDF orders={filteredOrders} />}
                  fileName="completed_orders.pdf"
                  style={{ display: "none" }} // Hide the actual trigger
                >
                  {({ loading }) =>
                    loading ? "..." : <span id="hidden-download-link" />
                  }
                </PDFDownloadLink>

                <FilePdfOutlined
                  style={{ fontSize: 20, color: "#1890ff", cursor: "pointer" }}
                />
              </span>
            </Popconfirm>

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
          <Table
            dataSource={filteredOrders}
            rowKey="orderId"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            <Table.Column
              title="Customer Name"
              dataIndex="customerName"
              key="customerName"
            />
            <Table.Column
              title="Product Name"
              dataIndex="productName"
              key="productName"
            />
            <Table.Column
              title="Fabric Name"
              dataIndex="fabricName"
              key="fabricName"
            />
            <Table.Column
              title="Fabric Length"
              dataIndex="fabricLength"
              key="fabricLength"
            />
            <Table.Column
              title="Quantity"
              dataIndex="quantity"
              key="quantity"
            />
            <Table.Column
              title="Total Price"
              dataIndex="totalPrice"
              key="totalPrice"
              render={(price) => `₹${price}`}
            />
            <Table.Column
              title="Order Date"
              dataIndex="orderDate"
              key="orderDate"
              render={(date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-")}
            />
            <Table.Column
              title="Completion Date"
              dataIndex="completionDate"
              key="completionDate"
              render={(date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-")}
            />
            <Table.Column
              title="Assigned To"
              dataIndex="assignedToName"
              key="assignedToName"
            />
          </Table>
        </Spin>
      </Card>
    </div>
  );
};

export default CompletedOrders;
