import React, { useEffect, useState } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { getAllMeasurement, deleteMeasurement } from "../api/Meausementapi";

const Measurements = () => {
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const fetchMeasurements = async () => {
    try {
      const data = await getAllMeasurement();
      setMeasurements(data);
    } catch (error) {
      console.error("Error fetching measurements:", error.message);
    }
  };

  const handleDeleteMeasurement = async (measurementId) => {
    try {
      await deleteMeasurement(measurementId);
      setMeasurements(measurements.filter((m) => m.measurementID !== measurementId));
      message.success("Measurement deleted successfully");
    } catch (error) {
      console.error("Error deleting measurement:", error.message);
      message.error("Failed to delete measurement");
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
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this measurement?"
          onConfirm={() => handleDeleteMeasurement(record.measurementID)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="measurements-container">
      <h2>Measurement Records</h2>
      <Table
        dataSource={measurements}
        columns={columns}
        rowKey="measurementID"
        pagination={{ pageSize: 10 }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default Measurements;