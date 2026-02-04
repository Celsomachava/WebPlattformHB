import React from 'react';

export const RecentOrders = () => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Recent Orders</h3>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e9ecef' }}>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>#</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Product Name</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Product Id</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Quantity</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Price</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Order Time</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Customer</th>
            <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3, 4].map(i => (
            <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>{i}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>Product #{i}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px', color: '#6c757d' }}>0000000{i}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>0{i}</td>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>${50 * i}.00</td>
              <td style={{ padding: '12px 8px', fontSize: '14px', color: '#6c757d' }}>22-08-2018 07:22:18</td>
              <td style={{ padding: '12px 8px', fontSize: '14px' }}>Rachel J. Wicker</td>
              <td style={{ padding: '12px 8px' }}>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '12px', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  backgroundColor: '#d4edda',
                  color: '#155724'
                }}>
                  Delivered
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div style={{ textAlign: 'right', marginTop: '16px' }}>
      <a href="#" style={{ color: '#007bff', fontSize: '14px', textDecoration: 'none' }}>View Details</a>
    </div>
  </div>
);

export const CustomerAcquisition = () => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Customer Acquisition</h3>
    <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
      {[40, 60, 80, 100, 70, 90, 60].map((height, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ 
            width: '100%', 
            height: `${height}%`, 
            background: i % 2 === 0 ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(180deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '4px 4px 0 0'
          }}></div>
          <span style={{ fontSize: '11px', color: '#6c757d' }}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
        </div>
      ))}
    </div>
    <div style={{ marginTop: '20px', display: 'flex', gap: '20px', fontSize: '13px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#667eea' }}></div>
        <span>Returning</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#f093fb' }}></div>
        <span>First Time</span>
      </div>
    </div>
  </div>
);

export const ProductCategory = () => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Product Category</h3>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <svg width="200" height="200" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="80" fill="none" stroke="#667eea" strokeWidth="40" strokeDasharray="251 251" transform="rotate(-90 100 100)" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#f093fb" strokeWidth="40" strokeDasharray="188 251" strokeDashoffset="-251" transform="rotate(-90 100 100)" />
        <circle cx="100" cy="100" r="80" fill="none" stroke="#4facfe" strokeWidth="40" strokeDasharray="125 251" strokeDashoffset="-439" transform="rotate(-90 100 100)" />
      </svg>
    </div>
    <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
      {[
        { label: 'Category 1', value: '250k', color: '#667eea' },
        { label: 'Category 2', value: '180k', color: '#f093fb' },
        { label: 'Category 3', value: '120k', color: '#4facfe' }
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: item.color }}></div>
            <span style={{ fontSize: '14px' }}>{item.label}</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export const TopCampaigns = () => (
  <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
    <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600' }}>Top Performing Campaigns</h3>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '2px solid #e9ecef' }}>
          <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Campaign</th>
          <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Visits</th>
          <th style={{ padding: '12px 8px', textAlign: 'right', fontSize: '13px', fontWeight: '600', color: '#6c757d' }}>Revenue</th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: 'Campaign#1', visits: '58,109', revenue: '$452' },
          { name: 'Campaign#2', visits: '2,789', revenue: '$316' },
          { name: 'Campaign#3', visits: '1,459', revenue: '$251' },
          { name: 'Campaign#4', visits: '5,035', revenue: '$856' },
          { name: 'Campaign#5', visits: '10,000', revenue: '$1000' },
          { name: 'Campaign#6', visits: '10,000', revenue: '$1000' }
        ].map((item, i) => (
          <tr key={i} style={{ borderBottom: '1px solid #f1f3f5' }}>
            <td style={{ padding: '12px 8px', fontSize: '14px' }}>{item.name}</td>
            <td style={{ padding: '12px 8px', fontSize: '14px', textAlign: 'right' }}>{item.visits}</td>
            <td style={{ padding: '12px 8px', fontSize: '14px', textAlign: 'right', fontWeight: '600' }}>{item.revenue}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div style={{ textAlign: 'right', marginTop: '16px' }}>
      <a href="#" style={{ color: '#007bff', fontSize: '14px', textDecoration: 'none' }}>Details</a>
    </div>
  </div>
);
