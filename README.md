# Unify Invoicing Solution

Documentation and research repository for **Unify, pisarniške in poslovne storitve, d.o.o.** invoicing requirements.

## Company Information

- **Name:** Unify, pisarniške in poslovne storitve, d.o.o.
- **Address:** Studeno 6A, 4228 Železniki
- **Contact:** jaka.frelih@unify.si
- **Tax ID (Davčna):** 20260393
- **Registration (Matična):** 7179855000
- **Registered:** 17.11.2016
- **Bank Account:** TRR SI56 6100 0001 5473 011 (Delavska hranilnica)
- **VAT Status:** NOT VAT-registered (Zavezanec za DDV: Ne)

## Current Status

**🚧 In Development** — Custom invoicing and simple bookkeeping application.

**Decision:** Build custom app to replace 350€/year accountant. See [ADR-0001](./docs/ADR-0001-buy-vs-build-invoicing.md) for rationale.

**Features (V0):**
- ✅ SI-legal invoices (non-VAT format, sequential numbering)
- ✅ PDF generation with Slovenian invoice template
- ✅ Recurring client invoices (monthly/quarterly/yearly)
- ✅ Expense tracking (9 categories)
- ✅ Revenue reports (yearly, by period, by client)
- ✅ Basic P&L (profit/loss view)
- ✅ Payment status tracking (issued, paid, overdue, cancelled)
- ✅ CSV exports for tax filing (invoices + expenses)
- ✅ Customer management with recurring templates
- ✅ Authentication with Supabase Auth
- ✅ Responsive UI with Slovenian labels

**Not replacing:** Complex statutory filings or annual tax returns (may still need FURS eDavki or professional help for those).

## Business Context

- **Volume:** Few maintenance invoices per year
- **Previous Costs:** ~350€/year paid to external accountant
- **Goal:** **Eliminate accountant cost** by handling invoicing and simple bookkeeping internally
- **Operations:** Mostly idle; perfect for self-service micro-business accounting

## Repository Contents

- **[docs/ADR-0001-buy-vs-build-invoicing.md](./docs/ADR-0001-buy-vs-build-invoicing.md)** — Architecture Decision Record analyzing buy vs. build options
- **[docs/competitors-si-invoicing.md](./docs/competitors-si-invoicing.md)** — Comparison of Slovenian invoicing solutions
- **[docs/questions-for-owners.md](./docs/questions-for-owners.md)** — Open questions for business owners

## Proposed Stack (If Building)

Should the decision be made to build a custom solution, the recommended stack aligns with Nejc's existing applications:

- **Framework:** Next.js (React)
- **Database/Backend:** Supabase
- **Hosting:** Vercel
- **PDF Generation:** jsPDF or similar
- **Compliance:** e-SLOG 2.0 gateway integration (required by 2028)

## Critical Compliance Dates

⚠️ **1 January 2028:** Mandatory structured B2B e-invoicing comes into effect in Slovenia per ZIERDED law.

## Local Development Setup

This Origin repository is the **source of truth** for documentation and ADRs. 

**Nejc's workflow:**
1. Clone this repo to local machine: `C:\Users\Nejc\Desktop\dev\unify-invoicing`
2. Work locally in that directory
3. Commit and push changes back to this Origin repo
4. Origin remains the remote for documentation, decisions, and (if building) code

**To clone locally (on Nejc's Asus):**

```bash
# Navigate to dev folder
cd C:\Users\Nejc\Desktop\dev

# Clone this repository
origin repo clone <repo-url> unify-invoicing
# or: git clone <repo-url> unify-invoicing

cd unify-invoicing
```

All documentation edits, ADR updates, and future code (if Option B is chosen) should be synced between the local working copy and this Origin repo.

## How to Run

### Prerequisites

1. **Node.js 20+** and npm
2. **Supabase account:** https://supabase.com (free tier is sufficient)
3. **Git** (for cloning and pushing changes)

### Setup Instructions

1. **Clone the repository locally** (on Nejc's Asus):

```bash
cd C:\Users\Nejc\Desktop\dev
git clone https://origin.cursor.com/git/nejc-bevk/tmp-5c643679ab153d76.git unify-invoicing
cd unify-invoicing
```

2. **Install dependencies:**

```bash
npm install
```

3. **Set up Supabase:**

- Create a new project at https://supabase.com/dashboard
- Go to SQL Editor and run the schema from `docs/database-schema.md`:
  - Copy tables (customers, invoices, expenses)
  - Copy RLS policies
  - Copy functions (get_next_invoice_number, update_updated_at)
  - Copy triggers
- Go to Settings → API to get your project URL and anon key

4. **Configure environment variables:**

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Company details (already filled with Unify's data, but can override)
NEXT_PUBLIC_COMPANY_NAME="Unify, pisarniške in poslovne storitve, d.o.o."
NEXT_PUBLIC_COMPANY_ADDRESS="Studeno 6A, 4228 Železniki"
NEXT_PUBLIC_COMPANY_EMAIL=jaka.frelih@unify.si
NEXT_PUBLIC_COMPANY_TAX_ID=20260393
NEXT_PUBLIC_COMPANY_REGISTRATION=7179855000
NEXT_PUBLIC_COMPANY_BANK=SI56 6100 0001 5473 011
NEXT_PUBLIC_COMPANY_BANK_NAME="Delavska hranilnica"
```

5. **Run the development server:**

```bash
npm run dev
```

6. **Open in browser:**

Navigate to http://localhost:43123

7. **Create your account:**

- Click "Registracija" on the login page
- Use a real email (Supabase sends confirmation)
- Or for testing, enable email confirmation bypass in Supabase dashboard

### First-Time Usage

1. Add a customer (stranka)
2. Create an invoice for that customer
3. Download PDF or mark as paid
4. Add business expenses (stroški)
5. View reports to see P&L

### Deployment (Optional)

Deploy to Vercel for production:

```bash
npm install -g vercel
vercel
```

Link to Supabase production project and add environment variables in Vercel dashboard.

## Next Steps

1. Review ADR-0001 and make buy vs. build decision
2. If buying: Select provider and set up account
3. If building: Initialize Next.js + Supabase project
4. Coordinate with accountant on integration requirements
5. Plan 2028 e-invoice compliance strategy

## License

Private repository for Unify d.o.o. internal use.
