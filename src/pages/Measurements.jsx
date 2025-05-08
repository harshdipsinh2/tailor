import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Card, Spin, Space, Input } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllMeasurements, deleteMeasurement, getAllCustomers } from "../api/AdminApi";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState({});

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    setLoading(true);
    try {
      const [measurementsData, customersData] = await Promise.all([
        getAllMeasurements(),
        getAllCustomers()
      ]);

      // Create customers lookup object
      const customersMap = {};
      customersData.forEach(customer => {
        customersMap[customer.CustomerId] = customer.FullName;
      });
      setCustomers(customersMap);

      // Update normalized data to show only customer name
      const normalized = measurementsData.map((m) => ({
        measurementID: m.MeasurementID,
        customerName: customersMap[m.CustomerId] || 'Unknown Customer',
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
      console.error("Error loading data:", error);
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
        setLoading(true);
        // Log the measurementId being sent
        console.log('Deleting measurement:', measurementId);
        
        await deleteMeasurement(measurementId);
        
        // Update local state after successful deletion
        setMeasurements(prev => prev.filter(m => m.measurementID !== measurementId));
        setFilteredMeasurements(prev => prev.filter(m => m.measurementID !== measurementId));
        
        message.success("Measurement deleted successfully!");
        
        // Optionally refresh the data
        await fetchMeasurements();
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
      // Simplified render to only show the name
      render: (text) => <span>{text}</span>
    },
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
      render: (record) => (
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
