import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Space,
  Card,
  message,
  Input,
  Spin
} from 'antd';
import {
  SyncOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { getAllOrders, updateOrderApproval } from '../../api/AdminApi';
import dayjs from 'dayjs';

const { Option } = Select;

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  const rejectionReasons = [
    "Insufficient materials available",
    "Insufficient time to complete the order",
    "Health issues prevent taking new orders",
    "Currently on personal leave",
    "Pearsonal reasons",
    "Other... "
  ];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();

      // Filter only orders with pending approval
      const pendingOrders = data.filter(order => order.ApprovalStatus === 'Pending');
      setOrders(pendingOrders);
      setFilteredOrders(pendingOrders);
    } catch (error) {
      message.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Add search filter functionality
  useEffect(() => {
    const filtered = orders.filter(order =>
      order.CustomerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.ProductName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleManageOrder = (record) => {
    setSelectedOrder(record);
    form.resetFields();
    setShowModal(true);
  };

  const handleSubmit = async (values) => {
    try {
      const approvalData = {
        ApprovalStatus: values.approvalStatus,
        RejectionReason: values.approvalStatus === 'Rejected' ? values.rejectionReason : null
      };

      await updateOrderApproval(selectedOrder.OrderID, approvalData);
      message.success('Order status updated successfully');
      setShowModal(false);
      fetchOrders();
    } catch (error) {
      message.error('Failed to update order status');
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
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a, b) => dayjs(a.CompletionDate).unix() - dayjs(b.CompletionDate).unix()
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<SyncOutlined />}
          onClick={() => handleManageOrder(record)}
        >
          Manage Order
        </Button>
      )
    }
  ];

  return (
    <div>
      <Card
        title={<h2>Manage Orders</h2>}
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
        style={{ margin: '24px 0' }}
      >
        <Spin spinning={loading}>
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="OrderID"
            bordered
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
      </Card>

      <Modal
        title="Manage Order"
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="approvalStatus"
            label="Approval Status"
            rules={[{ required: true, message: 'Please select approval status' }]}
          >
            <Select>
              <Option value="Approved">Approved</Option>
              <Option value="Rejected">Rejected</Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.approvalStatus !== currentValues.approvalStatus
            }
          >
            {({ getFieldValue }) =>
              getFieldValue('approvalStatus') === 'Rejected' && (
                <Form.Item
                  name="rejectionReason"
                  label="Rejection Reason"
                  rules={[{ required: true, message: 'Please select rejection reason' }]}
                >
                  <Select>
                    {rejectionReasons.map((reason, index) => (
                      <Option key={index} value={reason}>{reason}</Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                Submit
              </Button>
              <Button onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageOrders;
