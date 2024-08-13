import React from 'react';
import AdminDashboard from './AdminDashboard';

function UserDashboard() {
  return (
    <AdminDashboard showEditDelete={false} isUserDashboard={true}/>
  );
}

export default UserDashboard;
