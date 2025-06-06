import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Card,
  Spin,
  Space,
  Input,
  Tooltip,
} from "antd";
import { DeleteOutlined, SearchOutlined, FilePdfOutlined } from "@ant-design/icons";
import {
  getAllMeasurements,
  deleteMeasurement,
  getAllCustomers,
} from "../../api/AdminApi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


const handleDownloadPDF = (record) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Customer Measurement Report", 14, 22);

  doc.setFontSize(12);
  doc.text(`Customer: ${record.customerName}`, 14, 32);

  const fields = [
    ["Chest", record.chest],
    ["Waist", record.waist],
    ["Hip", record.hip],
    ["Shoulder", record.shoulder],
    ["Sleeve Length", record.sleeveLength],
    ["Trouser Length", record.trouserLength],
    ["Inseam", record.inseam],
    ["Thigh", record.thigh],
    ["Neck", record.neck],
    ["Sleeve", record.sleeve],
    ["Arms", record.arms],
    ["Bicep", record.bicep],
    ["Forearm", record.forearm],
    ["Wrist", record.wrist],
    ["Ankle", record.ankle],
    ["Calf", record.calf],
    ["Upper Body Fabric (m)", record.upperBodyMeasurement],
    ["Lower Body Fabric (m)", record.lowerBodyMeasurement],
  ];

  autoTable(doc, {
    startY: 40,
    head: [["Measurement", "Value"]],
    body: fields.map(([key, val]) => [key, val !== null && val !== undefined ? val : "N/A"]),
  });

  doc.save(`${record.customerName}_Measurement_Report.pdf`);
};

const Measurements = () => {
  const role = localStorage.getItem('role'); // Get user role
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState({});

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const [measurementsData, customersData] = await Promise.all([
        getAllMeasurements(),
        getAllCustomers(),
      ]);

      const customersMap = {};
      customersData.forEach((customer) => {
        customersMap[customer.CustomerId] = customer.FullName;
      });
      setCustomers(customersMap);

      const normalized = measurementsData.map((m) => ({
        measurementID: m.MeasurementID,
        customerName: customersMap[m.CustomerId] || "Unknown Customer",
        chest: m.Chest,
        waist: m.Waist,
        hip: m.Hip,
        shoulder: m.Shoulder,
        sleeveLength: m.SleeveLength,
        trouserLength: m.TrouserLength,
        inseam: m.Inseam,
        thigh: m.Thigh,
        neck: m.Neck,
        sleeve: m.Sleeve,
        arms: m.Arms,
        bicep: m.Bicep,
        forearm: m.Forearm,
        wrist: m.Wrist,
        ankle: m.Ankle,
        calf: m.Calf,
        upperBodyMeasurement: m.UpperBodyMeasurement,
        lowerBodyMeasurement: m.LowerBodyMeasurement,
      }));

      setMeasurements(normalized);
      setFilteredMeasurements(normalized);
    } catch (error) {
      console.error("Error loading data:", error);
      message.error("Failed to load measurements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

  useEffect(() => {
    const filteredData = measurements.filter((measurement) =>
      (measurement.customerName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredMeasurements(filteredData);
  }, [searchTerm, measurements]);

  const handleDeleteMeasurement = async (measurementId) => {
    try {
      setLoading(true);
      await deleteMeasurement(measurementId);

      setMeasurements((prev) =>
        prev.filter((m) => m.measurementID !== measurementId)
      );
      setFilteredMeasurements((prev) =>
        prev.filter((m) => m.measurementID !== measurementId)
      );

      message.success("Measurement deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error(error.message || "Failed to delete measurement");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Customer",
      dataIndex: "customerName",
      key: "customerName",
    },
    { title: "Chest (in)", dataIndex: "chest", key: "chest" },
    { title: "Waist (in)", dataIndex: "waist", key: "waist" },
    { title: "Hip (in)", dataIndex: "hip", key: "hip" },
    { title: "Shoulder (in)", dataIndex: "shoulder", key: "shoulder" },
    {
      title: "Sleeve Length (in)",
      dataIndex: "sleeveLength",
      key: "sleeveLength",
    },
    {
      title: "Trouser Length (in)",
      dataIndex: "trouserLength",
      key: "trouserLength",
    },
    { title: "Inseam (in)", dataIndex: "inseam", key: "inseam" },
    { title: "Thigh (in)", dataIndex: "thigh", key: "thigh" },
    { title: "Neck (in)", dataIndex: "neck", key: "neck" },
    { title: "Sleeve (in)", dataIndex: "sleeve", key: "sleeve" },
    { title: "Arms (in)", dataIndex: "arms", key: "arms" },
    { title: "Bicep (in)", dataIndex: "bicep", key: "bicep" },
    { title: "Forearm (in)", dataIndex: "forearm", key: "forearm" },
    { title: "Wrist (in)", dataIndex: "wrist", key: "wrist" },
    { title: "Ankle (in)", dataIndex: "ankle", key: "ankle" },
    { title: "Calf (in)", dataIndex: "calf", key: "calf" },
    {
      title: "Upper Body Fabric (m)",
      dataIndex: "upperBodyMeasurement",
      key: "upperBodyMeasurement",
      render: (value) => value ? `${value} meters` : "N/A",
    },
    {
      title: "Lower Body Fabric (m)",
      dataIndex: "lowerBodyMeasurement",
      key: "lowerBodyMeasurement",
      render: (value) => value ? `${value} meters` : "N/A",
    },
   {
  title: "Actions",
  key: "actions",
  render: (record) => (
    <Space>
      <Popconfirm
        title="Download Measurement"
        description="Are you sure you want to download the PDF?"
        okText="Yes"
        cancelText="No"
        onConfirm={() => handleDownloadPDF(record)}
      >
        <FilePdfOutlined
          style={{ fontSize: 20, color: "#1890ff", cursor: "pointer" }}
        />
      </Popconfirm>
      
      {/* Only show delete button for admin and manager */}
      {(role === 'Admin' || role === 'Manager') && (
        <Popconfirm
          title="Delete Measurement"
          description="Are you sure you want to delete this measurement?"
          onConfirm={() => handleDeleteMeasurement(record.measurementID)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      )}
    </Space>
  ),
}

  ];

  return (
    <div className="measurements-container" style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Measurement Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by customer name"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: "300px" }}
            />
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredMeasurements}
            columns={columns}
            rowKey="measurementID"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default Measurements;
