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
import { DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import {
  getAllMeasurements,
  deleteMeasurement,
  getAllCustomers,
} from "../api/AdminApi";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [filteredMeasurements, setFilteredMeasurements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState({});

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
        estimatedFabric: calculateFabricRequirement({
          chest: m.Chest,
          shoulder: m.Shoulder,
          sleeveLength: m.SleeveLength,
          waist: m.Waist,
          hip: m.Hip,
          trouserLength: m.TrouserLength,
        }),
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
  title: "Estimated Fabric (m)",
  dataIndex: "estimatedFabric",
  key: "estimatedFabric",
  render: (value) => value ? `${value} meters` : "N/A",
  width: 160,
}
,
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
