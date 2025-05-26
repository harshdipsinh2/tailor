import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllUsers, registerUser, updateUser, deleteUser } from "../api/UserApi";
import Password from "antd/es/input/Password";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeId, setEmployeeID] = useState("");
  const [show, setShow] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();
  const userRole = localStorage.getItem("role")?.toLowerCase();

  // Fetch employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);
  

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      // Transform the data to match the expected case
      const transformedData = data.map(employee => ({
        id: employee.Id || employee.id,
        name: employee.Name,
        email: employee.Email,
        mobileNo: employee.MobileNo,
        Password: employee.Password,
        address: employee.Address,
        roleName: employee.RoleName,
        userStatus: employee.UserStatus,
        isVerified: employee.IsVerified
      }));
      setEmployees(transformedData);
    } catch (error) {
      message.error("Failed to fetch employees: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter employees with null checks
  const filteredEmployees = employees.filter((employee) => {
    if (!employee) return false;
    return (
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.mobileNo?.includes(searchTerm)
    );
  });

  const handleEditEmployee = async (id) => {
    setEmployeeID(id);
    try {
      const singleEmployee = employees.find((employee) => employee.id === id);
      if (singleEmployee) {
        form.setFieldsValue(singleEmployee);
        setShow(true);
      }
    } catch (error) {
      message.error("Failed to fetch employee details: " + error.message);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await deleteUser(id);
      message.success("Employee deleted successfully!");
      fetchEmployees(); // Refresh the list
    } catch (error) {
      message.error("Failed to delete employee: " + error.message);
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await updateUser(employeeId, values);
      message.success("Employee updated successfully!");
      setShow(false);
      form.resetFields();
      fetchEmployees(); // Refresh the list
    } catch (error) {
      message.error("Failed to update employee: " + error.message);
    }
  };

  const handleAddSubmit = async (values) => {
    try {
      await registerUser(values);
      message.success("Employee added successfully!");
      setIsAddModalVisible(false);
      form.resetFields();
      fetchEmployees(); // Refresh the list
    } catch (error) {
      message.error("Failed to add employee: " + error.message);
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
            {userRole === 'admin' && (
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
            )}
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
            <Table.Column 
              title="Name" 
              dataIndex="name" 
              key="name"
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Email" 
              dataIndex="email" 
              key="email"
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Mobile" 
              dataIndex="mobileNo" 
              key="mobileNo"
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Address" 
              dataIndex="address" 
              key="address"
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Role" 
              dataIndex="roleName" 
              key="roleName"
              render={(text) => text || 'N/A'} 
            />
            <Table.Column 
              title="Status" 
              dataIndex="userStatus" 
              key="userStatus"
              render={(text) => text || 'N/A'} 
            />
            <Table.Column
              title="Actions"
              key="actions"
              render={(employee) => (
                <Space>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => handleEditEmployee(employee.id)}  // Changed from employee.employeeId
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title="Delete Employee"
                    description="Are you sure you want to delete this employee?"
                    onConfirm={() => handleDeleteEmployee(employee.id)}  // Changed from employee.employeeId
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            />
          </Table>
        </Spin>
      </Card>

      <Modal
        title={employeeId ? "Update Employee Details" : "Add Employee"}
        open={show || isAddModalVisible}
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
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
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
  <Select>
    <Select.Option value="Admin">Admin</Select.Option>
    <Select.Option value="Manager">Manager</Select.Option>
    <Select.Option value="Tailor">Tailor</Select.Option>
  </Select>
</Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button onClick={() => {
              setShow(false);
              setIsAddModalVisible(false);
              form.resetFields();
            }}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;