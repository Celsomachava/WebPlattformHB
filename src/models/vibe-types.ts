// VIBE Architecture - Core Data Models

// Authentication & Users
export interface User {
  id: string;
  customer_id: string;
  role: Role;
  name: string;
  email?: string;
  created_at: number;
}

export enum Role {
  ADMIN = 'ADMIN_001',
  CUSTOMER = 'KUNDE_XXX',
  TECHNICIAN = 'TECH_XXX'
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Form System
export interface FormSchema {
  id: string;
  version: number;
  title: string;
  sections: FormSection[];
  rules: ConditionalRule[];
  validation: ValidationRule[];
  metadata: FormMetadata;
}

export interface FormSection {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
  conditions?: ConditionExpression;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'select' | 'file' | 'date' | 'checkbox';
  label: string;
  required: boolean;
  validation?: FieldValidation;
  options?: SelectOption[];
  conditions?: ConditionExpression;
}

// Business Entities
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: Address;
  created_at: number;
}

export interface Installation {
  id: string;
  customer_id: string;
  type: string;
  location: string;
  qr_code?: string;
  created_at: number;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  installation_id: string;
  type: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
  status: ServiceStatus;
  created_at: number;
}

export enum ServiceStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

// Sync & Storage
export interface SyncItem {
  id: string;
  type: 'form' | 'attachment' | 'deletion';
  data: any;
  priority: 'high' | 'normal' | 'low';
  retryCount: number;
  lastAttempt?: number;
  created_at: number;
}

export interface EncryptedData {
  data: number[];
  iv: number[];
  keyId: string;
}

// Supporting Types
export interface Address {
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ConditionalRule {
  fieldId: string;
  operator: 'equals' | 'contains' | 'not_empty';
  value: any;
}

export interface ConditionExpression {
  rules: ConditionalRule[];
  operator: 'AND' | 'OR';
}

export interface ValidationRule {
  fieldId: string;
  type: 'required' | 'email' | 'min_length' | 'max_length';
  value?: any;
  message: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  message?: string;
}

export interface FormMetadata {
  created_by: string;
  created_at: number;
  updated_at: number;
  published_at?: number;
  version_notes?: string;
}

// Billing & Invoicing Models
export interface AngebotPosition {
  id: string;
  type: 'artikel' | 'leistung' | 'arbeitszeit' | 'anfahrt' | 'filter' | 'pauschale';
  beschreibung: string;
  menge: number;
  einzelpreis: number;
  gesamtpreis: number;
}

export interface Angebot {
  id: string;
  nummer: string;
  kunden_id: string;
  service_anfrage_id?: string;
  positionen: AngebotPosition[];
  rabatt_prozent: number;
  netto: number;
  mwst_prozent: number;
  mwst_betrag: number;
  brutto: number;
  status: 'entwurf' | 'versendet' | 'angenommen' | 'abgelehnt' | 'abgelaufen';
  gueltig_bis: string;
  created_at: number;
  updated_at: number;
  version: number;
}

export interface Rechnung {
  id: string;
  nummer: string;
  angebot_id?: string;
  kunden_id: string;
  positionen: AngebotPosition[];
  netto: number;
  mwst_prozent: number;
  mwst_betrag: number;
  brutto: number;
  status: 'offen' | 'bezahlt' | 'ueberfaellig' | 'storniert';
  zahlungsbedingungen: string;
  faellig_am: string;
  bezahlt_am?: string;
  created_at: number;
  updated_at: number;
}

export interface DatevExport {
  debitor: string;
  rechnungsnummer: string;
  rechnungsdatum: string;
  nettobetrag: number;
  mwst: number;
  bruttobetrag: number;
  sachkonto: string;
  kostenstelle?: string;
}

export interface BillingDraft {
  id: string;
  type: 'angebot' | 'rechnung';
  data: Partial<Angebot | Rechnung>;
  created_at: number;
  synced: boolean;
}