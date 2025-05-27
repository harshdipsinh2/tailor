import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Space, 
  message, 
  Tag,
  Spin,
  Select,
  Button,
  Modal,
  Form
} from 'antd';
import { SearchOutlined, SyncOutlined } from '@ant-design/icons';
import { getRejectedOrders, reassignOrder } from '../api/AdminApi';
import { getAllUsers } from '../api/UserApi';
import dayjs from 'dayjs';

const { Option } = Select;

const RejectedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [reassignModalVisible, setReassignModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reassignLoading, setReassignLoading] = useState(false);

  const fetchRejectedOrders = async () => {
    setLoading(true);
    try {
      const data = await getRejectedOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      message.error('Failed to fetch rejected orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      const formattedUsers = data.map(user => ({
        value: user.UserID,
        label: user.Name || user.name || user.FullName || user.fullName,
        isVerified: user.IsVerified ?? false
      }));
      // Filter only verified tailors if needed
      const tailors = formattedUsers.filter(user => user.isVerified);
      setUsers(tailors);
    } catch (error) {
      message.error('Failed to fetch tailors');
    }
  };

  useEffect(() => {
    fetchRejectedOrders();
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order => 
      order.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleReassign = (record) => {
    setSelectedOrder(record);
    setSelectedUser(null);
    setReassignModalVisible(true);
  };

  const handleReassignSubmit = async () => {
    if (!selectedUser) {
      message.warning('Please select a tailor');
      return;
    }

    setReassignLoading(true);
    try {
      await reassignOrder(selectedOrder.OrderID, { AssignedTo: selectedUser });
      message.success('Order reassigned successfully');
      setReassignModalVisible(false);
      fetchRejectedOrders(); // Refresh the list
    } catch (error) {
      message.error('Failed to reassign order');
    } finally {
      setReassignLoading(false);
    }
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'CustomerName',
      key: 'customerName',
      sorter: (a, b) => a.CustomerName.localeCompare(b.CustomerName)
    },
    {
      title: 'Product',
      dataIndex: 'ProductName',
      key: 'productName'
    },
    {
      title: 'Order Date',
      dataIndex: 'OrderDate',
      key: 'orderDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Completion Date',
      dataIndex: 'CompletionDate',
      key: 'completionDate',
      render: (date) => dayjs(date).format('DD/MM/YYYY')
    },
    {
      title: 'Rejection Reason',
      dataIndex: 'RejectionReason',
      key: 'rejectionReason',
      render: (reason) => (
        <Tag color="red">{reason || 'No reason provided'}</Tag>
      )
    },
    {
      title: 'Assigned To',
      dataIndex: 'AssignedToName',
      key: 'assignedTo'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<SyncOutlined />}
          onClick={() => handleReassign(record)}
        >
          Reassign
        </Button>
      )
    }
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Card
        title={<h2 style={{ margin: 0 }}>Rejected Orders</h2>}
        extra={
          <Space>
            <Input
              placeholder="Search by customer or product"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: 250 }}
            />
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="OrderID"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </Spin>
      </Card>

      <Modal
        title="Reassign Order"
        open={reassignModalVisible}
        onOk={handleReassignSubmit}
        onCancel={() => setReassignModalVisible(false)}
        confirmLoading={reassignLoading}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <p>Order Details:</p>
            <p>Customer: {selectedOrder?.CustomerName}</p>
            <p>Product: {selectedOrder?.ProductName}</p>
          </div>
          <Form.Item
            label="Assign To"
            required
            validateStatus={!selectedUser ? 'error' : ''}
            help={!selectedUser ? 'Please select a tailor' : ''}
          >
            <Select
              style={{ width: '100%' }}
              placeholder="Select tailor to assign"
              value={selectedUser}
              onChange={setSelectedUser}
              showSearch
              allowClear
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={users}
            />
          </Form.Item>
        </Space>
      </Modal>
    </div>
  );
};

export default RejectedOrders;