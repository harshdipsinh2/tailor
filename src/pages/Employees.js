import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { updateEmployee, getAllEmployees, deleteEmployee, registerEmployee } from "../api/Employeesapi";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeId, setEmployeeID] = useState("");
  const [show, setShow] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Move fetchEmployees outside of useEffect
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getAllEmployees();
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format");
      }
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter employees based on search term
  useEffect(() => {
    const filteredData = employees.filter((employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobileNo.includes(searchTerm)
    );
    setFilteredEmployees(filteredData);
  }, [searchTerm, employees]);

  const handleEditEmployee = (employeeId) => {
    setEmployeeID(employeeId);
    const singleEmployee = employees.find((employee) => employee.id === employeeId);
    if (singleEmployee) {
      form.setFieldsValue(singleEmployee);
      setShow(true);
    } else {
      message.error("Employee not found.");
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      await deleteEmployee(employeeId);
      message.success("Employee deleted successfully!");
      setEmployees(employees.filter(employee => employee.id !== employeeId));
    } catch (error) {
      message.error("Failed to delete employee: " + error.message);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateEmployee(employeeId, values);
      message.success("Employee updated successfully!");
      fetchEmployees(); // Refresh the employee list
      setShow(false);
    } catch (error) {
      message.error("Failed to update employee: " + error.message);
    }
  };

  const handleAddSubmit = async (values) => {
    try {
      await registerEmployee(values);
      message.success("Employee added successfully!");
      fetchEmployees(); // Refresh the employee list
      setIsAddModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Failed to add employee: " + error.message);
    }
  };

  const handleStatusChange = async (employeeId, newStatus) => {
    try {
      await updateEmployee(employeeId, { userStatus: newStatus });
      message.success("Status updated successfully!");
      fetchEmployees(); // Refresh the employee list
    } catch (error) {
      message.error("Failed to update status: " + error.message);
    }
  };

  return (
    <div className="employees-container" style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Employee Records</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by Name or Mobile"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
              style={{ width: "250px" }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setIsAddModalVisible(true);
                setEmployeeID("");
                form.resetFields();
              }}
            >
              Add Employee
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredEmployees}
            rowKey="id"
            bordered
            pagination={{ pageSize: 5 }}
            scroll={{ x: "max-content" }}
          >
            <Table.Column title="Name" dataIndex="name" key="name" />
            <Table.Column title="Email" dataIndex="email" key="email" />
            <Table.Column title="Mobile" dataIndex="mobileNo" key="mobileNo" />
            <Table.Column title="Address" dataIndex="address" key="address" />
            <Table.Column title="Role" dataIndex="roleName" key="roleName" />
            <Table.Column
  title="Status"
  key="userStatus"
  render={(employee) => (
    <Select
      defaultValue={employee.userStatus}
      onChange={(value) => handleStatusChange(employee.id, value)}
    >
      <Select.Option value="Available">Available</Select.Option>
      <Select.Option value="Busy">Busy</Select.Option>
    </Select>
  )}
/>

            <Table.Column
              title="Actions"
              key="actions"
              render={(employee) => (
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditEmployee(employee.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteEmployee(employee.id)}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            />
          </Table>
        </Spin>
      </Card>

      <Modal
        title={employeeId ? "Update Employee Details" : "Add Employee"}
        visible={show || isAddModalVisible}
        onCancel={() => {
          setShow(false);
          setIsAddModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={employeeId ? handleEditSubmit : handleAddSubmit}
        >
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Mobile Number" name="mobileNo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: !employeeId }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Role" name="roleName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Status" name="userStatus" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">Submit</Button>
            <Button onClick={() => {
              setShow(false);
              setIsAddModalVisible(false);
              form.resetFields();
            }}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;