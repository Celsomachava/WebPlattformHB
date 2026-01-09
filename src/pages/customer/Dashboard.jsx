import React from 'react';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = ({ user }) => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Portal-Übersicht',
      description: 'Übersicht über alle Ihre Serviceanfragen und deren Status',
      icon: '🏠',
      color: '#e3f2fd',
      path: '/customer/overview'
    },
    {
      title: 'Neue Serviceanfrage',
      description: 'Erstellen Sie eine neue Serviceanfrage für Ihre Anlagen',
      icon: '➕',
      color: '#e8f5e8',
      path: '/customer/service-new'
    },
    {
      title: 'Angebote einsehen',
      description: 'Einsehen und verwalten Sie Ihre erhaltenen Angebote',
      icon: '📋',
      color: '#f3e5f5',
      path: '/customer/offers'
    },
    {
      title: 'Rechnungen einsehen',
      description: 'Zugriff auf alle Ihre Rechnungen und PDF-Downloads',
      icon: '💰',
      color: '#fff8e1',
      path: '/customer/invoices'
    }
  ];

  return (
    <div style={{ 
      marginLeft: '250px', 
      marginTop: '60px',
      minHeight: 'calc(100vh - 60px)',
      background: '#f8f9fa'
    }}>
      {/* Blue header section */}
      <div style={{
        background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        color: 'white',
        padding: '40px 24px',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '600', 
          margin: '0 0 8px 0' 
        }}>
          Kundenportal
        </h1>
        <p style={{ 
          fontSize: '16px', 
          opacity: 0.9, 
          margin: 0 
        }}>
          Service-Management System - Heduschka GmbH
        </p>
        <p style={{ 
          fontSize: '14px', 
          opacity: 0.8, 
          margin: '4px 0 0 0' 
        }}>
          Profil: Kunde
        </p>
      </div>

      {/* Steps bar */}
      <div style={{
        background: 'white',
        padding: '20px 24px',
        borderBottom: '1px solid #e9ecef'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '40px'
        }}>
          {[1, 2, 3, 4, 5].map((step, index) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: index === 0 ? '#007bff' : '#e9ecef',
                color: index === 0 ? 'white' : '#6c757d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {step}
              </div>
              {index < 4 && (
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: '#e9ecef',
                  marginLeft: '20px'
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '40px 24px' }}>
        {/* Welcome section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#007bff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '32px',
            color: 'white'
          }}>
            H
          </div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 8px 0',
            color: '#2c3e50'
          }}>
            Willkommen, {user?.kunden_id}!
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#6c757d',
            margin: 0
          }}>
            Dieser Bereich hilft Ihnen bei der Verwaltung Ihrer Serviceanfragen und Dokumente.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {cards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              style={{
                background: card.color,
                borderRadius: '16px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                fontSize: '32px',
                marginBottom: '16px'
              }}>
                {card.icon}
              </div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 8px 0',
                color: '#2c3e50'
              }}>
                {card.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6c757d',
                margin: 0,
                lineHeight: '1.5'
              }}>
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;