import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/Admin/LoginForm';
import AdminDashboard from '../../components/Admin/AdminDashboard';
import Navbar from '../../components/Navbar/Navbar';
import './Admin.css';

const Admin: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="admin">
      <Navbar />
      <div className="admin-container">
        {user ? <AdminDashboard /> : <LoginForm />}
      </div>
    </div>
  );
};

export default Admin;