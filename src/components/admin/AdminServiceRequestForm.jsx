import React from 'react';
import ServiceRequestForm from '../customer/form/ServiceRequestForm';

const AdminServiceRequestForm = ({ user }) => {
  return (
    <div style={{ marginLeft: '10px', marginTop: '60px', padding: '30px', maxWidth: 'calc(100vw - 260px)', background: '#f5f7fa', minHeight: 'calc(100vh - 60px)' }}>
      <ServiceRequestForm user={user} />
    </div>
  );
};

export default AdminServiceRequestForm;
