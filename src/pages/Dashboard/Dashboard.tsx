import React from 'react';
import Header from '../../components/Header/Header';
import PageHeader from '../../components/PageHeader/PageHeader';
import DoctorSelector from '../../components/DoctorSelector/DoctorSelector';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <Header />
      <div className="dashboard-content">
        <PageHeader title="Configure Your Doctor" />
        <DoctorSelector />
      </div>
    </div>
  );
};

export default Dashboard;
