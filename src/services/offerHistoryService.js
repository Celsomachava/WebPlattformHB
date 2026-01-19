export const offerHistoryService = {
  async createVersion(offerId, changes, userId) {
    const version = {
      id: crypto.randomUUID(),
      offer_id: offerId,
      version_number: await this.getNextVersionNumber(offerId),
      changes,
      created_by: userId,
      created_at: Date.now()
    };
    
    const history = JSON.parse(localStorage.getItem('offer_history') || '[]');
    history.push(version);
    localStorage.setItem('offer_history', JSON.stringify(history));
    
    return version;
  },

  async getNextVersionNumber(offerId) {
    const history = JSON.parse(localStorage.getItem('offer_history') || '[]');
    const versions = history.filter(v => v.offer_id === offerId);
    return versions.length + 1;
  },

  async getHistory(offerId) {
    const history = JSON.parse(localStorage.getItem('offer_history') || '[]');
    return history.filter(v => v.offer_id === offerId).sort((a, b) => b.created_at - a.created_at);
  }
};

export const invoiceHistoryService = {
  async createVersion(invoiceId, changes, userId) {
    const version = {
      id: crypto.randomUUID(),
      invoice_id: invoiceId,
      version_number: await this.getNextVersionNumber(invoiceId),
      changes,
      created_by: userId,
      created_at: Date.now()
    };
    
    const history = JSON.parse(localStorage.getItem('invoice_history') || '[]');
    history.push(version);
    localStorage.setItem('invoice_history', JSON.stringify(history));
    
    return version;
  },

  async getNextVersionNumber(invoiceId) {
    const history = JSON.parse(localStorage.getItem('invoice_history') || '[]');
    const versions = history.filter(v => v.invoice_id === invoiceId);
    return versions.length + 1;
  },

  async getHistory(invoiceId) {
    const history = JSON.parse(localStorage.getItem('invoice_history') || '[]');
    return history.filter(v => v.invoice_id === invoiceId).sort((a, b) => b.created_at - a.created_at);
  }
};
