import React, { useState, useEffect } from 'react';
import { Calendar as AntCalendar, Badge, Card, Spin, message, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { getAllOrders } from '../api/AdminApi';
import "../Css/Calendar.css";

const Calendar = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      // Transform the data to ensure consistent date format
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
    // Match orders with the selected date
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
              <Badge 
                status="success" 
                text={`Completed (${completedOrders.length})`}
                style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#52c41a',
                  fontWeight: 'bold'
                }}
              />
            </Tooltip>
          </li>
        )}
        {completedOrders.map((item, index) => (
          <li key={`completed-${index}`}>
            <Tooltip title={`Delivery Time: ${dayjs(item.completionDate).format('HH:mm')}`}>
              <Badge 
                status="success"
                text={item.customerName}
                style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              />
            </Tooltip>
          </li>
        ))}
        {pendingOrders.length > 0 && (
          <li style={{ marginTop: '4px', marginBottom: '4px' }}>
            <Tooltip title="Pending Orders" color="#1890ff">
              <Badge 
                status="processing" 
                text={`Pending (${pendingOrders.length})`}
                style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  color: '#1890ff',
                  fontWeight: 'bold'
                }}
              />
            </Tooltip>
          </li>
        )}
        {pendingOrders.map((item, index) => (
          <li key={`pending-${index}`}>
            <Tooltip title={`Delivery Time: ${dayjs(item.completionDate).format('HH:mm')}`}>
              <Badge 
                status="processing"
                text={item.customerName}
                style={{ 
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              />
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