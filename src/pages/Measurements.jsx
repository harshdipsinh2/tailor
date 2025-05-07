import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Card, Spin, Space, Input } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllMeasurements , deleteMeasurement } from "../api/AdminApi"; 

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const data = await getAllMeasurements();
  
      // Normalize PascalCase keys to camelCase (adjust this to match your backend field names)
      const normalized = data.map((m) => ({
        measurementID: m.MeasurementID,
        customerName: m.CustomerName,
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
      }));
  
      setMeasurements(normalized);
      setFilteredMeasurements(normalized);
    } catch (error) {
      console.error("Error loading measurements:", error);
      message.error("Failed to load measurements.");
    } finally {
      setLoading(false);
    }
  };
  

useEffect(() => {
  const filteredData = measurements.filter((measurement) =>
    (measurement.customerName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    Object.values(measurement).some(
      (value) =>
        typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  setFilteredMeasurements(filteredData);
}, [searchTerm, measurements]);


  const handleDeleteMeasurement = async (measurementId) => {
    try {
      await deleteMeasurement(measurementId);
      setMeasurements((prev) => prev.filter((m) => m.measurementID !== measurementId));
      message.success("Measurement deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
      message.error("Failed to delete measurement.");
    }
  };
  

  const columns = [
    { title: "Customer Name", dataIndex: "customerName", key: "customerName" },
    { title: "Chest", dataIndex: "chest", key: "chest" },
    { title: "Waist", dataIndex: "waist", key: "waist" },
    { title: "Hip", dataIndex: "hip", key: "hip" },
    { title: "Shoulder", dataIndex: "shoulder", key: "shoulder" },
    { title: "Sleeve Length", dataIndex: "sleeveLength", key: "sleeveLength" },
    { title: "Trouser Length", dataIndex: "trouserLength", key: "trouserLength" },
    { title: "Inseam", dataIndex: "inseam", key: "inseam" },
    { title: "Thigh", dataIndex: "thigh", key: "thigh" },
    { title: "Neck", dataIndex: "neck", key: "neck" },
    { title: "Sleeve", dataIndex: "sleeve", key: "sleeve" },
    { title: "Arms", dataIndex: "arms", key: "arms" },
    { title: "Bicep", dataIndex: "bicep", key: "bicep" },
    { title: "Forearm", dataIndex: "forearm", key: "forearm" },
    { title: "Wrist", dataIndex: "wrist", key: "wrist" },
    { title: "Ankle", dataIndex: "ankle", key: "ankle" },
    { title: "Calf", dataIndex: "calf", key: "calf" },
    {
      title: "Actions",
      key: "actions",
      render: (measurement) => (
        <Popconfirm
          title="Are you sure you want to delete this measurement?"
          onConfirm={() => handleDeleteMeasurement(measurement.measurementID)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="measurements-container" style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Measurement Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by Name or Measurement"
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
