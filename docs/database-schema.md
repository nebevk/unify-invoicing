# Database Schema

Supabase PostgreSQL schema for Unify Invoicing App.

## Tables

### `customers`

Client/customer records with recurring invoice templates.

```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Basic info
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  tax_id TEXT, -- Davčna številka (optional for individuals)
  registration_id TEXT, -- Matična številka
  email TEXT,
  phone TEXT,
  
  -- Recurring invoice settings (optional)
  recurring_enabled BOOLEAN DEFAULT FALSE,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('monthly', 'quarterly', 'yearly')),
  recurring_day INTEGER, -- Day of month to generate (1-28)
  recurring_service_description TEXT,
  recurring_amount DECIMAL(10, 2),
  recurring_next_date DATE,
  
  -- Metadata
  notes TEXT,
  active BOOLEAN DEFAULT TRUE,
  
  -- User association (for multi-user future)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_recurring_next_date ON customers(recurring_next_date) WHERE recurring_enabled = TRUE;
```

### `invoices`

Invoice records with SI-legal fields (non-VAT format for Unify).

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Invoice identification
  invoice_number TEXT NOT NULL UNIQUE, -- Sequential: YYYY-001, YYYY-002, etc.
  invoice_year INTEGER NOT NULL,
  invoice_sequence INTEGER NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Customer reference
  customer_id UUID REFERENCES customers(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL, -- Denormalized for PDF generation
  customer_address TEXT NOT NULL,
  customer_tax_id TEXT,
  customer_registration_id TEXT,
  
  -- Invoice items (simplified - single service line for V0)
  service_description TEXT NOT NULL,
  quantity DECIMAL(10, 2) DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL, -- quantity * unit_price
  
  -- Payment tracking
  payment_status TEXT NOT NULL DEFAULT 'issued' CHECK (payment_status IN ('issued', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_date DATE,
  
  -- Metadata
  notes TEXT,
  pdf_generated BOOLEAN DEFAULT FALSE,
  pdf_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- User association
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  CONSTRAINT unique_invoice_number_per_year UNIQUE (invoice_year, invoice_sequence)
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date DESC);
CREATE INDEX idx_invoices_payment_status ON invoices(payment_status);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
```

### `expenses`

Business expense tracking (to replace accountant for simple books).

```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Expense details
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'office_supplies', 'software', 'hosting', 'accounting', 
    'bank_fees', 'insurance', 'travel', 'equipment', 'other'
  )),
  description TEXT NOT NULL,
  vendor_name TEXT,
  
  -- Receipt/proof
  receipt_url TEXT, -- Future: Supabase Storage URL
  
  -- Metadata
  notes TEXT,
  
  -- User association
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_expense_date ON expenses(expense_date DESC);
CREATE INDEX idx_expenses_category ON expenses(category);
```

### `settings` (Optional - for V0, use env vars)

Application settings (future: multi-user, custom templates, etc.).

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Company details (override defaults)
  company_name TEXT,
  company_address TEXT,
  company_email TEXT,
  company_tax_id TEXT,
  company_registration_id TEXT,
  company_bank TEXT,
  company_bank_name TEXT,
  
  -- Invoice settings
  invoice_prefix TEXT DEFAULT '', -- e.g., "UNI-" for UNI-2026-001
  invoice_footer_text TEXT,
  
  -- Notifications
  notify_overdue_invoices BOOLEAN DEFAULT TRUE,
  notify_recurring_due BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)

Enable RLS on all tables and restrict to authenticated users:

```sql
-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own data
CREATE POLICY "Users can view own customers" ON customers
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own customers" ON customers
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own customers" ON customers
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own customers" ON customers
  FOR DELETE USING (auth.uid() = user_id);

-- Repeat for invoices
CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Repeat for expenses
CREATE POLICY "Users can view own expenses" ON expenses
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY "Users can insert own expenses" ON expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY "Users can update own expenses" ON expenses
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY "Users can delete own expenses" ON expenses
  FOR DELETE USING (auth.uid() = user_id);
```

## Functions

### `get_next_invoice_number(year INTEGER)`

Generate the next sequential invoice number for a given year.

```sql
CREATE OR REPLACE FUNCTION get_next_invoice_number(year INTEGER)
RETURNS TEXT AS $$
DECLARE
  next_seq INTEGER;
  user_uuid UUID;
BEGIN
  user_uuid := auth.uid();
  
  SELECT COALESCE(MAX(invoice_sequence), 0) + 1
  INTO next_seq
  FROM invoices
  WHERE invoice_year = year AND user_id = user_uuid;
  
  RETURN year || '-' || LPAD(next_seq::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### `update_updated_at()`

Trigger function to automatically update `updated_at` timestamp.

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## Setup Instructions

1. Create a new Supabase project: https://supabase.com/dashboard
2. Go to SQL Editor
3. Copy and paste each section above (tables, RLS, functions, triggers)
4. Run the SQL
5. Copy the project URL and anon key to `.env.local`
6. Test connection: `npm run dev` and check Supabase logs

## Data Migrations (Future)

For production changes, use Supabase migrations:

```bash
supabase migration new add_feature_name
# Edit the generated SQL file
supabase db push
```

## Notes

- **Non-VAT design:** No `vat_rate`, `vat_amount`, or `net_amount` fields (Unify is not VAT-registered)
- **Single-line items:** V0 uses single service description per invoice (sufficient for Unify's simple services)
- **Recurring logic:** App will check `customers.recurring_next_date` daily and auto-generate invoices
- **Sequential numbering:** Enforced at DB level with unique constraint + function
- **User isolation:** RLS ensures multi-user support in future (currently single user expected)

## Example Data

```sql
-- Example customer
INSERT INTO customers (name, address, tax_id, email, user_id)
VALUES (
  'Example Client d.o.o.',
  'Glavni trg 1, 1000 Ljubljana',
  '12345678',
  'client@example.com',
  auth.uid()
);

-- Example invoice
INSERT INTO invoices (
  invoice_number, invoice_year, invoice_sequence, invoice_date,
  customer_id, customer_name, customer_address,
  service_description, unit_price, total_amount,
  payment_status, user_id
)
VALUES (
  '2026-001', 2026, 1, '2026-10-27',
  '<customer_uuid>', 'Example Client d.o.o.', 'Glavni trg 1, 1000 Ljubljana',
  'IT maintenance services - October 2026', 350.00, 350.00,
  'issued', auth.uid()
);

-- Example expense
INSERT INTO expenses (expense_date, amount, category, description, vendor_name, user_id)
VALUES (
  '2026-10-01', 15.00, 'hosting', 'Vercel Pro plan - October', 'Vercel Inc.', auth.uid()
);
```
