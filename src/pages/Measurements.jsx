import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message, Card, Spin, Space, Input } from "antd";
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = () => {
    setLoading(true);
    // Simulated static data (replace this with API data later)
    const mockData = [
      {
        measurementID: 1,
        customerName: "John Doe",
        chest: "40",
        waist: "32",
        hip: "38",
        shoulder: "18",
        sleeveLength: "24",
        trouserLength: "40",
        inseam: "30",
        thigh: "22",
        neck: "15",
        sleeve: "20",
        arms: "23",
        bicep: "13",
        forearm: "10",
        wrist: "7",
        ankle: "9",
        calf: "14",
      },
    ];
    setMeasurements(mockData);
    setFilteredMeasurements(mockData);
    setLoading(false);
  };

  useEffect(() => {
    const filteredData = measurements.filter((measurement) =>
      measurement.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      Object.values(measurement).some(
        (value) =>
          typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredMeasurements(filteredData);
  }, [searchTerm, measurements]);

  const handleDeleteMeasurement = (measurementId) => {
    setMeasurements(measurements.filter((m) => m.measurementID !== measurementId));
    message.success("Measurement deleted successfully (mock)");
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
