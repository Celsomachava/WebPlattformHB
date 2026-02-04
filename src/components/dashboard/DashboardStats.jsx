import React from 'react';

const DashboardStats = ({ stats }) => {
  const StatCard = ({ title, value, subtitle, color, trend }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontWeight: '500' }}>
          {title}
        </h3>
        {trend && (
          <span style={{ 
            color: trend.startsWith('+') ? '#28a745' : '#dc3545',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {trend}
          </span>
        )}
      </div>
      <div style={{ fontSize: '32px', fontWeight: '700', color: color || '#2c3e50', marginBottom: '8px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '13px', color: '#6c757d' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
      <StatCard 
        title="Total Revenue" 
        value={`$${stats.totalRevenue || '12099'}`}
        trend="+8.6%"
        color="#667eea"
      />
      <StatCard 
        title="Affiliate Revenue" 
        value={`$${stats.affiliateRevenue || '12099'}`}
        trend="+8.6%"
        color="#f093fb"
      />
      <StatCard 
        title="Refunds" 
        value={stats.refunds || '0.00'}
        subtitle="N/A"
        color="#4facfe"
      />
      <StatCard 
        title="Avg. Revenue Per User" 
        value={`$${stats.avgRevenue || '28000'}`}
        trend="-6.6%"
        color="#feca57"
      />
    </div>
  );
};

export default DashboardStats;
