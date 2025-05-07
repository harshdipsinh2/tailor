import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <p> GO back </p>
    </div>
  );
};

export default Unauthorized;
