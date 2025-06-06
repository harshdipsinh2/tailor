import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card,Popconfirm, Space, Spin, Select, DatePicker } from "antd";
import { PlusOutlined , FilePdfOutlined} from "@ant-design/icons";
import { PDFDownloadLink } from "@react-pdf/renderer";
import FabricStockPDF from "../../Components/Pdf/FabricStockPDF";
import {
  getAllFabricStocks,
  addFabricStock,
  getAllFabricTypes,
} from "../../api/AdminApi";
import dayjs from "dayjs";

const { Option } = Select;

const FabricStock = () => {
  const [stocks, setStocks] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [stocksData, fabricsData] = await Promise.all([
        getAllFabricStocks(),
        getAllFabricTypes()
      ]);

      // Create a map of fabric IDs to names
      const fabricMap = Object.fromEntries(
        fabricsData.map(f => [f.FabricTypeID, f.FabricName])
      );

      // Transform stock data
      const formattedStocks = stocksData.map(stock => ({
        stockId: stock.StockID,
        fabricTypeId: stock.FabricTypeID,
        fabricName: fabricMap[stock.FabricTypeID] || 'Unknown',
        stockIn: stock.StockIn,
        stockOut: stock.StockOut,
        stockAddDate: stock.StockAddDate,
      }));

      setStocks(formattedStocks);
      setFabrics(fabricsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      message.error("Failed to load stock data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (values) => {
    try {
      const stockData = {
        FabricTypeID: values.fabricTypeId,
        StockIn: parseFloat(values.stockIn) || 0,
        StockOut: parseFloat(values.stockOut) || 0,
        StockAddDate: values.stockAddDate.format("YYYY-MM-DDTHH:mm:ss")
      };

      await addFabricStock(stockData);
      message.success("Stock added successfully!");
      setShowModal(false);
      form.resetFields();
      fetchData(); // Refresh the table
    } catch (error) {
      console.error("Add stock error:", error);
      message.error("Failed to add stock");
    }
  };

  return (
    <div className="fabric-stock-container" style={{ padding: "20px" }}>
      <Card
        title={<h2>Fabric Stock Records</h2>}
        extra={
          <Space>
            <Popconfirm
              title="Are you sure you want to download the PDF?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                document.getElementById("fabric-stock-pdf-trigger").click();
              }}
            >
              <span>
                <PDFDownloadLink
                  id="fabric-stock-pdf-trigger"
                  document={<FabricStockPDF stocks={stocks} />}
                  fileName="fabric_stock_report.pdf"
                  style={{ display: "none" }}
                >
                  {({ loading }) => (loading ? "..." : <span />)}
                </PDFDownloadLink>

                <FilePdfOutlined
                  style={{ fontSize: 20, color: "#1890ff", cursor: "pointer" }}
                />
              </span>
            </Popconfirm>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowModal(true)}
            >
              Add Stock
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={stocks}
            rowKey="stockId"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            <Table.Column 
              title="Fabric Name" 
              dataIndex="fabricName" 
              key="fabricName"
              sorter={(a, b) => a.fabricName.localeCompare(b.fabricName)}
            />
            <Table.Column 
              title="Stock In" 
              dataIndex="stockIn" 
              key="stockIn"
              render={(text) => text || 0}
            />
            <Table.Column 
              title="Stock Out" 
              dataIndex="stockOut" 
              key="stockOut"
              render={(text) => text || 0}
            />
            <Table.Column
              title="Stock Add Date"
              dataIndex="stockAddDate"
              key="stockAddDate"
              render={(date) => dayjs(date).format("DD/MM/YYYY HH:mm")}
              sorter={(a, b) => dayjs(a.stockAddDate).unix() - dayjs(b.stockAddDate).unix()}
            />
          </Table>
        </Spin>
      </Card>

      <Modal
        title="Add New Stock"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddStock}
          initialValues={{
            stockAddDate: dayjs(),
            stockIn: 0,
            stockOut: 0
          }}
        >
          <Form.Item
            label="Fabric Name"
            name="fabricTypeId"
            rules={[{ required: true, message: "Please select fabric!" }]}
          >
            <Select placeholder="Select Fabric">
              {fabrics.map(fabric => (
                <Option key={fabric.FabricTypeID} value={fabric.FabricTypeID}>
                  {fabric.FabricName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Stock In"
            name="stockIn"
            rules={[{ required: true, message: "Please enter stock in quantity!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item
            label="Stock Out"
            name="stockOut"
            rules={[{ required: true, message: "Please enter stock out quantity!" }]}
          >
            <Input type="number" min={0} />
          </Form.Item>

          <Form.Item
            label="Stock Add Date"
            name="stockAddDate"
            rules={[{ required: true, message: "Please select date!" }]}
          >
            <DatePicker 
              showTime 
              format="DD/MM/YYYY HH:mm"
              style={{ width: "100%" }} 
            />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default FabricStock;