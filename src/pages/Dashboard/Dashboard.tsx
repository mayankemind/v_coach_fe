import React from 'react';
import Header from '../../components/Header/Header';
import PageHeader from '../../components/PageHeader/PageHeader';
import DoctorGrid from '../../components/DoctorGrid/DoctorGrid';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <PageHeader title="Choose your doctor" />
        <DoctorGrid />
      </div>
    </div>
  );
};

export default Dashboard;
