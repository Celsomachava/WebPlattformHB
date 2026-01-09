// Security utilities for Heduschka PWA
export const security = {
  // Basic input sanitization
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  },

  // Validate file types for photo uploads
  validateFileType: (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return allowedTypes.includes(file.type);
  },

  // Validate file size (5MB max)
  validateFileSize: (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
  },

  // Basic DSGVO compliance check
  validateDSGVO: (formData) => {
    return formData.rechtliches?.datenschutz_zustimmung === true &&
           formData.rechtliches?.agb_akzeptiert === true;
  },

  // Encrypt sensitive data for local storage (basic implementation)
  encryptSensitive: (data) => {
    // For MVP: basic obfuscation, not real encryption
    try {
      return btoa(JSON.stringify(data));
    } catch (error) {
      console.warn('Encryption failed:', error);
      return data;
    }
  },

  // Decrypt sensitive data
  decryptSensitive: (encryptedData) => {
    try {
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.warn('Decryption failed:', error);
      return encryptedData;
    }
  }
};