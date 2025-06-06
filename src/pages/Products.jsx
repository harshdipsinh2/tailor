import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const YourComponent = ({ userRole, setShowAddModal }) => {
  return (
    <div>
      {/* ...existing code... */}
      {(userRole === 'admin' || userRole === 'superadmin' || userRole === 'manager') && (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddModal(true)}
        >
          Add Product
        </Button>
      )}
      {/* ...existing code... */}
    </div>
  );
};

export default YourComponent;