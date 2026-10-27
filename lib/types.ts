// Database types matching Supabase schema

export interface Customer {
  id: string
  created_at: string
  updated_at: string
  name: string
  address: string
  tax_id?: string
  registration_id?: string
  email?: string
  phone?: string
  recurring_enabled: boolean
  recurring_frequency?: 'monthly' | 'quarterly' | 'yearly'
  recurring_day?: number
  recurring_service_description?: string
  recurring_amount?: number
  recurring_next_date?: string
  notes?: string
  active: boolean
  user_id: string
}

export interface Invoice {
  id: string
  created_at: string
  updated_at: string
  invoice_number: string
  invoice_year: number
  invoice_sequence: number
  invoice_date: string
  customer_id: string
  customer_name: string
  customer_address: string
  customer_tax_id?: string
  customer_registration_id?: string
  service_description: string
  quantity: number
  unit_price: number
  total_amount: number
  payment_status: 'issued' | 'paid' | 'overdue' | 'cancelled'
  due_date?: string
  paid_date?: string
  notes?: string
  pdf_generated: boolean
  pdf_sent_at?: string
  user_id: string
}

export interface Expense {
  id: string
  created_at: string
  updated_at: string
  expense_date: string
  amount: number
  category: ExpenseCategory
  description: string
  vendor_name?: string
  receipt_url?: string
  notes?: string
  user_id: string
}

export type ExpenseCategory =
  | 'office_supplies'
  | 'software'
  | 'hosting'
  | 'accounting'
  | 'bank_fees'
  | 'insurance'
  | 'travel'
  | 'equipment'
  | 'other'

export interface Settings {
  id: string
  user_id: string
  company_name?: string
  company_address?: string
  company_email?: string
  company_tax_id?: string
  company_registration_id?: string
  company_bank?: string
  company_bank_name?: string
  invoice_prefix?: string
  invoice_footer_text?: string
  notify_overdue_invoices: boolean
  notify_recurring_due: boolean
  created_at: string
  updated_at: string
}

// Form types for creating/updating

export interface CustomerFormData {
  name: string
  address: string
  tax_id?: string
  registration_id?: string
  email?: string
  phone?: string
  recurring_enabled: boolean
  recurring_frequency?: 'monthly' | 'quarterly' | 'yearly'
  recurring_day?: number
  recurring_service_description?: string
  recurring_amount?: number
  notes?: string
}

export interface InvoiceFormData {
  customer_id: string
  invoice_date: string
  service_description: string
  quantity: number
  unit_price: number
  due_date?: string
  notes?: string
}

export interface ExpenseFormData {
  expense_date: string
  amount: number
  category: ExpenseCategory
  description: string
  vendor_name?: string
  notes?: string
}

// Report types

export interface RevenueByPeriod {
  period: string // "2026-01" for monthly, "2026-Q1" for quarterly
  revenue: number
  invoice_count: number
}

export interface RevenueByCustomer {
  customer_id: string
  customer_name: string
  revenue: number
  invoice_count: number
}

export interface ProfitLoss {
  period: string
  revenue: number
  expenses: number
  profit: number
}

// Company details (from env vars)

export interface CompanyDetails {
  name: string
  address: string
  email: string
  tax_id: string
  registration_id: string
  bank: string
  bank_name: string
}

export const DEFAULT_COMPANY_DETAILS: CompanyDetails = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || 'Unify, pisarniške in poslovne storitve, d.o.o.',
  address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || 'Studeno 6A, 4228 Železniki',
  email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || 'jaka.frelih@unify.si',
  tax_id: process.env.NEXT_PUBLIC_COMPANY_TAX_ID || '20260393',
  registration_id: process.env.NEXT_PUBLIC_COMPANY_REGISTRATION || '7179855000',
  bank: process.env.NEXT_PUBLIC_COMPANY_BANK || 'SI56 6100 0001 5473 011',
  bank_name: process.env.NEXT_PUBLIC_COMPANY_BANK_NAME || 'Delavska hranilnica',
}
