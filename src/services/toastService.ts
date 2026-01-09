class ToastService {
  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '4px',
      color: 'white',
      fontWeight: '500',
      zIndex: '9999',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'success' ? '#28a745' : 
                      type === 'error' ? '#dc3545' : '#007bff'
    });

    document.body.appendChild(toast);

    // Animate in
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 10);

    // Remove after duration
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, duration);
  }

  showOfflineSaved() {
    this.show('📱 Saved offline - will sync when online', 'info', 4000);
  }

  showSyncSuccess() {
    this.show('✅ Synced successfully', 'success');
  }

  showSyncError() {
    this.show('❌ Sync failed - saved offline', 'error');
  }
}

export const toastService = new ToastService();