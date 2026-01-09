import React, { useState, useEffect } from 'react';
import { syncService } from '../../services/syncService';

const SyncStatusIndicator = () => {
  const [status, setStatus] = useState('online');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleStatusChange = (newStatus) => {
      setStatus(newStatus);
      setIsVisible(true);
      
      // Hide after 3 seconds for success states
      if (newStatus === 'synced' || newStatus === 'online') {
        setTimeout(() => setIsVisible(false), 3000);
      }
    };

    syncService.addListener(handleStatusChange);
    
    // Initial status
    const initialStatus = syncService.getStatus();
    setStatus(initialStatus.isOnline ? 'online' : 'offline');

    return () => {
      syncService.removeListener(handleStatusChange);
    };
  }, []);

  if (!isVisible && status === 'online') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'offline':
        return { color: '#dc3545', text: 'Offline', icon: '📴' };
      case 'syncing':
        return { color: '#ffc107', text: 'Synchronisiert...', icon: '🔄' };
      case 'synced':
        return { color: '#28a745', text: 'Synchronisiert', icon: '✅' };
      case 'sync-error':
        return { color: '#dc3545', text: 'Sync-Fehler', icon: '❌' };
      default:
        return { color: '#28a745', text: 'Online', icon: '🟢' };
    }
  };

  const config = getStatusConfig();

  return (
    <div style={{
      position: 'fixed',
      top: '70px',
      right: '20px',
      background: config.color,
      color: 'white',
      padding: '8px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500',
      zIndex: 1001,
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      animation: status === 'syncing' ? 'pulse 1.5s infinite' : 'none'
    }}>
      <span>{config.icon}</span>
      {config.text}
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SyncStatusIndicator;