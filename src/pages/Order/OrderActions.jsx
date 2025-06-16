import React from 'react';
import {Table, Button, Modal, Form, Input, Space, Spin,Card, Select, DatePicker, message, Popconfirm,Tag
} from "antd";
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined, DollarOutlined, SyncOutlined
} from "@ant-design/icons";


const OrderActions = React.memo(({ record, role, onDelete, onPayment, onUpdateStatus }) => {
  const isPaid = record.PaymentStatus === 'Completed';
  const isApproved = record.ApprovalStatus === 'Approved';

  return (
    <Space>
      {(role === 'Admin' || role === 'Manager' || role === 'SuperAdmin') && (
        <>
          <Popconfirm
            title="Delete Order"
            description="Are you sure you want to delete this order?"
            onConfirm={() => onDelete(record.OrderID)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>

          <Popconfirm
            title="Make Payment"
            description="Do you want to proceed to payment?"
            onConfirm={() => onPayment(record.OrderID)}
            okText="Yes"
            cancelText="No"
            disabled={isPaid}
          >
            <Button
              type="primary"
              icon={<DollarOutlined />}
              disabled={isPaid}
              style={{
                opacity: isPaid ? 0.5 : 1,
                cursor: isPaid ? 'not-allowed' : 'pointer'
              }}
            >
              {isPaid ? 'Paid' : 'Pay'}
            </Button>
          </Popconfirm>
        </>
      )}

      <Button
        type="dashed"
        icon={<SyncOutlined />}
        onClick={() => onUpdateStatus(record)}
        disabled={role === 'Tailor' && !isApproved}
        style={{
          opacity: (role === 'Tailor' && !isApproved) ? 0.5 : 1,
          cursor: (role === 'Tailor' && !isApproved) ? 'not-allowed' : 'pointer'
        }}
      >
        Update Status
      </Button>
    </Space>
  );
});
