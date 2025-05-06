import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin, Select } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeId, setEmployeeID] = useState("");
  const [show, setShow] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Dummy placeholder employee list (optional)
  const [employees, setEmployees] = useState([]);
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.mobileNo.includes(searchTerm)
  );

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

  const handleDeleteEmployee = (employeeId) => {
    setEmployees(employees.filter((employee) => employee.id !== employeeId));
    message.success("Employee deleted successfully!");
  };

  const handleEditSubmit = (values) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, ...values } : emp))
    );
    message.success("Employee updated successfully!");
    setShow(false);
  };

  const handleAddSubmit = (values) => {
    const newEmployee = {
      ...values,
      id: Date.now().toString(), // simple unique ID
    };
    setEmployees([...employees, newEmployee]);
    message.success("Employee added successfully!");
    setIsAddModalVisible(false);
    form.resetFields();
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
        <Spin spinning={false}>
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
            <Table.Column title="Status" dataIndex="userStatus" key="userStatus" />

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
