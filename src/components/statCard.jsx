import React from 'react';


export default function StatCard({ iconClass, title, value, specialStyle = {} }) {
  return (
    <div className="dashboard-card" style={specialStyle}>
      <i className={iconClass}></i>
      <div>
        <h3>{title}</h3>
        <span>{value}</span>
      </div>
    </div>
  );
}
