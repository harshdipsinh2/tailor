import React, { useEffect, useState } from 'react';
import { Table, Card, Tag, Space, message } from 'antd';
import { getAllSmsHistory } from '../api/TwilioApi';

const SmsHistory = () => {
  const [loading, setLoading] = useState(false);
  const [smsLogs, setSmsLogs] = useState([]);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'OrderID',
      key: 'orderId',
    },
    {
      title: 'Message',
      dataIndex: 'Message',
      key: 'message',
      width: '30%',
    },
    {
      title: 'Type',
      dataIndex: 'SmsType',
      key: 'type',
      render: (type) => (
        <Tag color={
          type === 'PreCompletion' ? 'blue' :
          type === 'Completion' ? 'green' :
          type === 'Delayed' ? 'orange' : 'default'
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Sent At',
      dataIndex: 'SentAt',
      key: 'sentAt',
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(b.SentAt) - new Date(a.SentAt),
    }
  ];

  useEffect(() => {
    const fetchSmsLogs = async () => {
      setLoading(true);
      try {
        const data = await getAllSmsHistory();
        setSmsLogs(data);
      } catch (error) {
        message.error('Failed to load SMS history');
      } finally {
        setLoading(false);
      }
    };

    fetchSmsLogs();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <Card title="SMS History">
        <Table 
          dataSource={smsLogs}
          columns={columns}
          rowKey="TwilioSmsID"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default SmsHistory;