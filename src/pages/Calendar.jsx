import React, { useState, useEffect } from 'react';
import {
  Calendar as AntCalendar,
  Badge,
  Card,
  Spin,
  message,
  Tooltip,
  Row,
  Col,
  Select,
  Button
} from 'antd';
import dayjs from 'dayjs';
import { getAllOrders, getAllBranches } from '../api/AdminApi';
import '../Css/Calendar.css';

const Calendar = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [branches, setBranches] = useState([]);
  const [shopOptions, setShopOptions] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  const role = localStorage.getItem('role');

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      const shopId = parseInt(payload.shopId);
      const branchId = parseInt(payload.branchId);

      if (role === 'Admin' || role === 'SuperAdmin') {
        try {
          const data = await getAllBranches();
          setBranches(data || []);
          const uniqueShops = [
            ...new Map(data.map((b) => [b.ShopId, { label: b.ShopName, value: b.ShopId }])).values()
          ];
          setShopOptions(uniqueShops);
        } catch (err) {
          message.error("Failed to load branches");
        }
      }

      if (shopId && branchId) {
        setSelectedShopId(shopId);
        setSelectedBranchId(branchId);
        fetchOrders(shopId, branchId);
      }
    };

    init();
  }, []);

  const fetchOrders = async (shopId, branchId) => {
    setLoading(true);
    try {
      const data = await getAllOrders(shopId, branchId);
      const formattedOrders = data.map(order => ({
        ...order,
        completionDate: order.CompletionDate || order.completionDate,
        customerName: order.CustomerName || order.customerName,
        orderStatus: order.OrderStatus || order.orderStatus
      }));
      setOrders(formattedOrders);
    } catch (error) {
      message.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getListData = (value) => {
    return orders.filter(order => {
      const completionDate = dayjs(order.completionDate);
      return completionDate.isSame(value, 'day');
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    const completedOrders = listData.filter(item => item.orderStatus?.toLowerCase() === 'completed');
    const pendingOrders = listData.filter(item => item.orderStatus?.toLowerCase() === 'pending');

    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {completedOrders.length > 0 && (
          <li style={{ marginBottom: '4px' }}>
            <Tooltip title="Completed Orders" color="#52c41a">
              <Badge status="success" text={`Completed (${completedOrders.length})`} style={{ color: '#52c41a', fontWeight: 'bold' }} />
            </Tooltip>
          </li>
        )}
        {completedOrders.map((item, index) => (
          <li key={`completed-${index}`}>
            <Tooltip title={`Delivery Time: ${dayjs(item.completionDate).format('HH:mm')}`}>
              <Badge status="success" text={item.customerName} />
            </Tooltip>
          </li>
        ))}
        {pendingOrders.length > 0 && (
          <li style={{ marginTop: '4px', marginBottom: '4px' }}>
            <Tooltip title="Pending Orders" color="#1890ff">
              <Badge status="processing" text={`Pending (${pendingOrders.length})`} style={{ color: '#1890ff', fontWeight: 'bold' }} />
            </Tooltip>
          </li>
        )}
        {pendingOrders.map((item, index) => (
          <li key={`pending-${index}`}>
            <Tooltip title={`Delivery Time: ${dayjs(item.completionDate).format('HH:mm')}`}>
              <Badge status="processing" text={item.customerName} />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0 }}>Order Delivery Calendar</h2>
            <div>
              <Badge status="success" text="Completed" style={{ marginRight: '12px' }} />
              <Badge status="processing" text="Pending" />
            </div>
          </div>
        }
        bordered={false}
      >
        {(role === 'Admin' || role === 'SuperAdmin') && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Select
                placeholder="Filter by Shop"
                options={shopOptions}
                allowClear
                value={selectedShopId}
                onChange={(value) => {
                  setSelectedShopId(value);
                  setSelectedBranchId(null);
                }}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={6}>
              <Select
                placeholder="Select Branch"
                allowClear
                value={selectedBranchId}
                onChange={setSelectedBranchId}
                disabled={!selectedShopId}
                style={{ width: '100%' }}
              >
                {branches
                  .filter(branch => branch.ShopId === selectedShopId)
                  .map(branch => (
                    <Select.Option key={branch.BranchId} value={branch.BranchId}>
                      {branch.BranchName}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col>
              <Button type="primary" onClick={() => fetchOrders(selectedShopId, selectedBranchId)}>
                Apply Filters
              </Button>
            </Col>
          </Row>
        )}

        <Spin spinning={loading}>
          <AntCalendar
            cellRender={dateCellRender}
            mode="month"
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          />
        </Spin>
      </Card>
    </div>
  );
};

export default Calendar;
