import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Card,
  Spin
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { getAllBranches, addBranch } from "../../api/AdminApi";

const Branch = () => {
  const role = localStorage.getItem("role");
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const showMessage = (type, content) => {
    messageApi.open({ type, content });
  };

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const data = await getAllBranches();
      setBranches(data);
    } catch (error) {
      showMessage("error", error.message || "Failed to load branches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  
  const handleAddBranch = async (values) => {
    try {
      await addBranch({
        BranchName: values.branchName,
        Location: values.location
      });
      showMessage("success", "Branch added successfully");
      setShowModal(false);
      form.resetFields();
      fetchBranches();
    } catch (error) {
      showMessage("error", error.message || "Failed to add branch");
    }
  };

  const columns = [
    {
      title: "Branch Name",
      dataIndex: "BranchName",
      key: "BranchName"
    },
    {
      title: "Location",
      dataIndex: "Location",
      key: "Location"
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (date) => new Date(date).toLocaleDateString()
    },
    // ...(role === "Admin" || role === "SuperAdmin"
    //   ? [
    //       {
    //         title: "Actions",
    //         key: "actions",
    //         render: (_, record) => (
    //           <Button
    //             danger
    //             icon={<DeleteOutlined />}
    //             onClick={() => handleDeleteBranch(record.BranchId)}
    //           >
    //             Delete
    //           </Button>
    //         )
    //       }
    //     ]
    //   : [])
  ];

//   const handleDeleteBranch = async (id) => {
//     try {
//       await deleteBranch(id);
//       showMessage("success", "Branch deleted successfully");
//       fetchBranches();
//     } catch (error) {
//       showMessage("error", error.message || "Failed to delete branch");
//     }
//   };

  return (
    <div style={{ padding: "20px" }}>
      {contextHolder}
      <Card
        title={<h2>Branch Records</h2>}
        extra={
          (role === "Admin" || role === "SuperAdmin") && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowModal(true)}
            >
              Add Branch
            </Button>
          )
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={branches}
            columns={columns}
            rowKey="BranchId"
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>

      <Modal
        title="Add Branch"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddBranch}>
          <Form.Item
            label="Branch Name"
            name="branchName"
            rules={[{ required: true, message: "Please enter branch name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please enter location" }]}
          >
            <Input />
          </Form.Item>

          <Space style={{ marginTop: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={() => setShowModal(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Branch;
