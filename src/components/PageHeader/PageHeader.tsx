import React from 'react';
import './PageHeader.css';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div className="page-header">
      <h2>{title}</h2>
    </div>
  );
};

export default PageHeader;
