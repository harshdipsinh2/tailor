import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Card, Space, Spin, Select, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllUsers, registerUser, updateUser, deleteUser } from "../api/UserApi";
import { getAllBranches } from "../api/AdminApi";
import Password from "antd/es/input/Password";
import { useNavigate } from "react-router-dom";
import { registerEmployee } from "../api/AuthApi"; // <-- Import registerEmployee
import { verifyOTP } from "../api/AuthApi"; // <-- Import verifyOTP

const Employees = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeId, setEmployeeID] = useState("");
  const [show, setShow] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [form] = Form.useForm();
  const userRole = localStorage.getItem("role")?.toLowerCase();

  // --- Add these states for shop/branch filter ---
  const [branches, setBranches] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [otpVisible, setOtpVisible] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [otpForm] = Form.useForm();

  // Fetch branches and set default shop/branch from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const shopId = parseInt(payload.shopId);
    const branchId = parseInt(payload.branchId);

    // Only fetch branches for admin/superadmin
    if (userRole === "admin" || userRole === "superadmin" || userRole === "manager") {
      getAllBranches().then(data => {
        setBranches(data || []);
        const uniqueShops = [
          ...new Map(data.map((b) => [b.ShopId, { label: b.ShopName, value: b.ShopId }])).values()
        ];
        setShopOptions(uniqueShops);
      });
    }

    if (shopId && branchId) {
      setSelectedShopId(shopId);
      setSelectedBranchId(branchId);
      fetchEmployees(shopId, branchId);
    }
  }, [userRole]);

  // Fetch employees when shop/branch changes
  useEffect(() => {
    if (selectedShopId && selectedBranchId) {
      fetchEmployees(selectedShopId, selectedBranchId);
    }
  }, [selectedShopId, selectedBranchId]);

  // --- Update fetchEmployees to accept shopId/branchId ---
  const fetchEmployees = async (shopId, branchId) => {
    setLoading(true);
    try {
      const data = await getAllUsers(shopId, branchId);
      const transformedData = data.map(employee => ({
        id: employee.Id || employee.id || employee.UserID,
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

  // Update the handleDeleteEmployee function
  const handleDeleteEmployee = async (id) => {
    if (!id) {
      message.error("Invalid employee ID");
      return;
    }
    
    try {
      // Add console.log to debug the ID being passed
      // console.log("Deleting employee with ID:", id);
      
      const response = await deleteUser(id);
      if (response) {
        message.success("Employee deleted successfully!");
        fetchEmployees(); // Refresh the list
      } else {
        message.error("Failed to delete employee - no response from server");
      }
    } catch (error) {
      console.error("Delete error:", error);
      message.error(`Failed to delete employee: ${error.message || 'Unknown error'}`);
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

  // --- Add Employee Modal: Shop/Branch dropdowns ---
  // ...existing code...

  // --- Add/Update Employee Submit Handler ---
  const handleAddSubmit = async (values) => {
    try {
      // Attach shopId and branchId from dropdowns
      const payload = {
        ...values,
        shopId: selectedShopId,
        branchId: selectedBranchId,
      };

      // Use registerEmployee for Manager/Tailor, else fallback to registerUser
      if (values.roleName === "Manager" || values.roleName === "Tailor") {
        const result = await registerEmployee(payload);
        if (result) {
          message.success(result.Message || 'Employee registered! OTP sent to email.');
          setRegisteredEmail(values.email);
          setOtpVisible(true); // Show OTP modal
        }
      } else {
        // For Admin, fallback to registerUser (if needed)
        const result = await registerUser(payload);
        if (result) {
          message.success('Employee added successfully!');
          setIsAddModalVisible(false);
          form.resetFields();
          fetchEmployees(selectedShopId, selectedBranchId);
        }
      }
    } catch (error) {
      message.error("Failed to add employee: " + error.message);
    }
  };

  // --- OTP Verification Handler ---
  const handleVerifyOTP = async (otpValues) => {
    try {
      const result = await verifyOTP({
        email: registeredEmail,
        otp: otpValues.otp
      });
      if (result) {
        message.success('OTP verified successfully!');
        setOtpVisible(false);
        setIsAddModalVisible(false);
        form.resetFields();
        otpForm.resetFields();
        fetchEmployees(selectedShopId, selectedBranchId);
      } else {
        message.error('Invalid OTP');
      }
    } catch (error) {
      message.error('OTP verification failed: ' + error.message);
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
            {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'manager' ) && (
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
        {/* --- Shop/Branch Filter Row --- */}
        {(userRole === "admin" || userRole === "superadmin") && (
          <div style={{ marginBottom: 16 }}>
            <Space>
              <Select
                placeholder="Filter by Shop"
                options={shopOptions}
                allowClear
                value={selectedShopId}
                onChange={(value) => {
                  setSelectedShopId(value);
                  setSelectedBranchId(null);
                }}
                style={{ width: 200 }}
              />
              <Select
                placeholder="Select Branch"
                allowClear
                value={selectedBranchId}
                onChange={setSelectedBranchId}
                disabled={!selectedShopId}
                style={{ width: 200 }}
              >
                {branches
                  .filter(branch => branch.ShopId === selectedShopId)
                  .map(branch => (
                    <Select.Option key={branch.BranchId} value={branch.BranchId}>
                      {branch.BranchName}
                    </Select.Option>
                  ))}
              </Select>
              <Button type="primary" onClick={() => fetchEmployees(selectedShopId, selectedBranchId)}>
                Apply Filters
              </Button>
            </Space>
          </div>
        )}
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
              render={(employee) => {
                // Add console.log to debug the employee object
                // console.log("Employee data in actions:", employee);
                
                return (
                  <Space>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => handleEditEmployee(employee.id)}
                    >
                      Edit
                    </Button>
                    <Popconfirm
                      title="Delete Employee"
                      description="Are you sure you want to delete this employee?"
                      onConfirm={() => handleDeleteEmployee(employee.id)}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ danger: true }}
                    >
                      <Button danger icon={<DeleteOutlined />}>
                        Delete
                      </Button>
                    </Popconfirm>
                  </Space>
                );
              }}
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
          {/* --- Shop Dropdown --- */}
          <Form.Item label="Shop" name="shopId" rules={[{ required: true, message: 'Please select a shop' }]}>
            <Select
              placeholder="Select Shop"
              options={shopOptions}
              value={selectedShopId}
              onChange={(value) => {
                setSelectedShopId(value);
                form.setFieldsValue({ shopId: value, branchId: null });
                setSelectedBranchId(null);
              }}
            />
          </Form.Item>
          {/* --- Branch Dropdown --- */}
          <Form.Item label="Branch" name="branchId" rules={[{ required: true, message: 'Please select a branch' }]}>
            <Select
              placeholder="Select Branch"
              value={selectedBranchId}
              onChange={(value) => {
                setSelectedBranchId(value);
                form.setFieldsValue({ branchId: value });
              }}
              disabled={!selectedShopId}
            >
              {branches
                .filter(branch => branch.ShopId === selectedShopId)
                .map(branch => (
                  <Select.Option key={branch.BranchId} value={branch.BranchId}>
                    {branch.BranchName}
                  </Select.Option>
                ))}
            </Select>
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
    {/* Only show "Manager" if NOT logged in as manager */}
    {userRole !== "manager" && (
      <Select.Option value="Manager">Manager</Select.Option>
    )}              <Select.Option value="Tailor">Tailor</Select.Option>
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

      {/* --- OTP Modal for Employee Registration --- */}
      <Modal
        title="OTP Verification"
        open={otpVisible}
        onCancel={() => setOtpVisible(false)}
        footer={null}
        destroyOnClose
      >
        <p>Enter the 6-digit OTP sent to:</p>
        <p style={{ fontWeight: 'bold' }}>{registeredEmail}</p>
        <Form form={otpForm} onFinish={handleVerifyOTP} layout="vertical">
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Please enter OTP' },
              { len: 6, message: 'OTP must be 6 digits' }
            ]}
          >
            <Input placeholder="Enter OTP" maxLength={6} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Verify OTP
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default Employees;