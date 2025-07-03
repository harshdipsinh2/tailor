import React, { useEffect, useState } from "react";
import { Table, Input, message, Card, Space, Spin, Popconfirm, Select, Button, Row, Col } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import { getAllOrders, getAllBranches } from "../../api/AdminApi";
import CompletedOrdersPDF from "../../Components/Pdf/CompletedOrdersPDF";
import InvoicePDF from "../../Components/Pdf/InvoicePDF";

import { PDFDownloadLink } from "@react-pdf/renderer";
import dayjs from "dayjs";

const { Option } = Select;

const CompletedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Branch/shop filter state
  const [branches, setBranches] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  // Fetch branches and shop options
  useEffect(() => {
    const fetchBranchesData = async () => {
      try {
        const data = await getAllBranches();
        setBranches(data || []);
        const uniqueShops = [
          ...new Map(data.map((b) => [b.ShopId, { label: b.ShopName, value: b.ShopId }])).values()
        ];
        setShopOptions(uniqueShops);
      } catch {
        message.error("Failed to load branches");
      }
    };
    fetchBranchesData();
  }, []);

  // Fetch completed orders
  const fetchCompletedOrders = async (shopId, branchId) => {
    setLoading(true);
    try {
      const data = await getAllOrders(shopId, branchId);

      // Filter for completed orders only with case-insensitive comparison
      const completedOrders = data.filter((order) => {
        const orderStatus = order.OrderStatus || order.orderStatus;
        return orderStatus?.toLowerCase() === "completed";
      });

      // Transform the data to ensure consistent property names
      const formattedOrders = completedOrders.map((order) => ({
        orderId: order.OrderId || order.orderId || order.OrderID,
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

      setOrders(formattedOrders);
      setFilteredOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching completed orders:", error);
      message.error("Failed to fetch completed orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // On mount: fetch completed orders with default shop/branch from token if available
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      fetchCompletedOrders();
      return;
    }
    const payload = JSON.parse(atob(token.split(".")[1]));
    const shopId = parseInt(payload.shopId);
    const branchId = parseInt(payload.branchId);

    if (shopId && branchId) {
      setSelectedShopId(shopId);
      setSelectedBranchId(branchId);
      fetchCompletedOrders(shopId, branchId);
    } else {
      fetchCompletedOrders();
    }
  }, []);

  // When shop/branch filter changes, fetch completed orders
  useEffect(() => {
    if (selectedShopId && selectedBranchId) {
      fetchCompletedOrders(selectedShopId, selectedBranchId);
    }
  }, [selectedShopId, selectedBranchId]);

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
                document.getElementById("pdf-download-trigger").click();
              }}
            >
              <span>
                <PDFDownloadLink
                  id="pdf-download-trigger"
                  document={<CompletedOrdersPDF orders={filteredOrders} />}
                  fileName="completed_orders.pdf"
                  style={{ display: "none" }}
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
        {/* Shop/Branch Filter Row */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <Select
              placeholder="Filter by Shop"
              options={shopOptions}
              allowClear
              value={selectedShopId}
              onChange={(value) => {
                setSelectedShopId(value);
                setSelectedBranchId(null);
              }}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <Select
              placeholder="Select Branch"
              allowClear
              value={selectedBranchId}
              onChange={setSelectedBranchId}
              disabled={!selectedShopId}
              style={{ width: "100%" }}
            >
              {branches
                .filter(branch => branch.ShopId === selectedShopId)
                .map(branch => (
                  <Option key={branch.BranchId} value={branch.BranchId}>
                    {branch.BranchName}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col>
            <Button type="primary" onClick={() => fetchCompletedOrders(selectedShopId, selectedBranchId)}>
              Apply Filters
            </Button>
          </Col>
        </Row>

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
            <Table.Column
              title="Action"
              key="action"
              render={(text, record) => (
                <PDFDownloadLink
                  document={<InvoicePDF order={record} />}
                  fileName={`invoice_${record.orderId}.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      <Spin size="small" />
                    ) : (
                      <FilePdfOutlined style={{ fontSize: 18, color: "#52c41a", cursor: "pointer" }} />
                    )
                  }
                </PDFDownloadLink>
              )}
            />
          </Table>
        </Spin>
      </Card>
    </div>
  );
};

export default CompletedOrders;
