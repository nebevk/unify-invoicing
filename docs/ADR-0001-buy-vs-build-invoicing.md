# ADR-0001: Buy vs. Build Invoicing Solution for Unify d.o.o.

**Status:** ✅ Accepted — Option B (Build Custom App)  
**Date Created:** 27 October 2026  
**Date Accepted:** 27 October 2026  
**Decision Makers:** Nejc Bevk (co-owner)  
**Consulted:** Accountant (pending integration validation)

## Context

Unify, pisarniške in poslovne storitve, d.o.o. is a Slovenian company with minimal invoicing needs:

- **Volume:** Few maintenance invoices per year
- **Current Process:** Manual or through accountant (~350€/year)
- **Goal:** **Eliminate the 350€/year accountant cost** by handling books internally
- **VAT Status:** Currently NOT VAT-registered (Zavezanec za DDV: Ne)
- **Operations:** Mostly idle; simple business structure (ideal for self-service bookkeeping)

The company needs a lightweight invoicing and simple bookkeeping solution that:
1. Complies with Slovenian legal requirements (invoice format, record-keeping)
2. **Replaces day-to-day accounting firm work** (since volume is tiny)
3. Provides visibility into revenue, expenses, and basic financials
4. Prepares for mandatory 2028 e-invoicing requirements

**Out of scope:** Complex statutory filings, annual tax returns (may still require professional help or FURS eDavki direct filing). This app covers operational invoicing and simple books for a micro firm, not replacing every legal/tax filing requirement.

## Problem Statement

Should Unify invest in building a custom invoicing application, purchase an off-the-shelf Slovenian solution, or continue with the hybrid manual/accountant approach?

## Decision Drivers

- **Low volume:** Building custom software for a handful of invoices/year has high opportunity cost
- **Compliance complexity:** Slovenian invoicing laws are specific and changing (e-SLOG 2.0 by 2028)
- **Maintenance burden:** Custom applications require ongoing updates for legal/tax changes
- **Accountant integration:** Solution must export data the accountant can import
- **Cost sensitivity:** At current volume, expensive solutions don't make economic sense
- **2028 deadline:** Mandatory structured B2B e-invoicing via e-SLOG 2.0 / EN 16931 from 1 Jan 2028

## Slovenian Legal Requirements

### Current Requirements (ZDDV-1 / FURS / SPOT)

Every invoice must contain ([source](https://spot.gov.si/en/info/accountancy/invoicing)):

- Date of issue
- Sequential invoice number
- Full issuer name and address (Unify, pisarniške in poslovne storitve, d.o.o., Studeno 6A, 4228 Železniki)
- Tax ID (Davčna: 20260393) and Registration Number (Matična: 7179855000)
- Full recipient name and address
- Description of goods/services
- Amounts (unit price, quantity, total)
- **DDV (VAT) fields:** Only required when company becomes VAT-registered (currently NOT applicable)

Since Unify is not VAT-registered, invoices must:
- **NOT include DDV breakdown lines**
- Include clause: *"Zavezanec ni identificiran za namene DDV"* or equivalent
- Show only net amounts

### 2028 E-Invoice Mandate (ZIERDED)

**Law adopted:** 23 October 2025 ([source](https://www.gov.si/novice/2025-10-23-drzavni-zbor-sprejel-zakon-o-izmenjavi-elektronskih-racunov-in-drugih-elektronskih-dokumentov/))  
**Effective date:** 1 January 2028  
**Scope:** Mandatory structured B2B e-invoicing for entities in the Slovenian Business Register

Key points ([source](https://epos.si/en/news/slovenian-national-assembly-adopts-zierded-mandatory-b2b-e-invoicing-from-1-january-2028)):

- **PDF is NOT an e-invoice** under ZIERDED
- Must use **e-SLOG 2.0** format (aligned with EN 16931 European standard)
- Exchange via:
  - Registered e-invoice providers
  - Peppol network
  - Direct integration (not simple email)
- Until 1 Jan 2028: Paper/PDF with recipient consent remains legal
- After 1 Jan 2028: Mandatory compliance or use a gateway provider

**Implication:** Any custom-built solution must integrate with e-SLOG 2.0 or use a gateway by 2028. Off-the-shelf Slovenian solutions (Minimax, Birokrat) are already preparing this compliance.

## Options Considered

### Option A: Buy Off-the-Shelf Slovenian Solution

Purchase a commercial invoicing SaaS product designed for the Slovenian market.

**Examples:**
- Minimax (cloud invoicing, e-račun support)
- Birokrat (lightweight, e-račun ready)
- E-računi.com (specialized e-invoice provider)
- Pantheon, SAOP (enterprise-grade, overkill for Unify)

**Pros:**
- ✅ Pre-built compliance with Slovenian law (ZDDV-1, FURS)
- ✅ E-SLOG 2.0 / 2028 compliance roadmap already handled
- ✅ Automatic legal/tax updates (no maintenance)
- ✅ Accountant-friendly exports (CSV, XML, direct integrations)
- ✅ Immediate availability (no development time)
- ✅ Likely cheaper than dev time for low volume

**Cons:**
- ❌ Recurring subscription cost (though likely small for low volume)
- ❌ Less control over UX and features
- ❌ Data stored with third party (though reputable providers)
- ❌ No learning opportunity for custom development

**Estimated Cost:** 5–20€/month for basic plans (see [competitors-si-invoicing.md](./competitors-si-invoicing.md))

**Best for:** Companies prioritizing compliance and minimal maintenance over control.

### Option B: Build Custom Lightweight Application

Develop a thin custom invoicing app tailored to Unify's needs.

**Proposed Stack:**
- **Frontend/Backend:** Next.js (matches Nejc's existing apps)
- **Database:** Supabase (PostgreSQL, auth, real-time)
- **PDF Generation:** jsPDF, react-pdf, or Puppeteer
- **Hosting:** Vercel
- **E-invoice Gateway:** Integration with e-SLOG provider by 2028 (e.g., e-računi API, Peppol gateway)

**V0 Scope (Minimal Viable Product):**

**Primary Goal:** Replace the 350€/year accountant for day-to-day operations (not statutory filings).

In scope:
- **Invoices:**
  - Invoice list (paginated, searchable, filterable by status/date/client)
  - Sequential invoice numbering (auto-increment, no gaps per year)
  - Quick invoice creation workflow (streamlined form, minimal clicks)
  - Invoice form with Unify details pre-filled
  - PDF generation with correct non-VAT template (SI-legal format)
  - Invoice sending: Email PDF directly from app (or download)
  - Payment status tracking (issued, paid, overdue)
  
- **Clients:**
  - Customer database (name, address, tax ID)
  - Recurring invoices: Client templates with recurring schedules (monthly, quarterly, yearly)
  - Client history (all invoices per client)
  
- **Simple Bookkeeping (to avoid accountant):**
  - **Expense tracking:** Record business expenses (date, amount, category, description, receipt upload)
  - **Revenue reporting:** Yearly report by period (monthly/quarterly) and by client
  - **Basic P&L view:** Total revenue vs. total expenses by period
  - **Export for tax filing:** CSV/Excel exports for annual tax return preparation
  
- **Access:**
  - Basic auth (single user or co-owner access)
  - Supabase Auth for security

**Out of scope (v0):**
- Multi-currency or multi-country
- Payroll (if needed, separate tool or accountant)
- Full double-entry bookkeeping / general ledger
- **Statutory filings:** Annual tax returns (can still use FURS eDavki or professional for this)
- VAT reporting (not applicable until VAT-registered)
- E-invoice sending via e-SLOG (deferred until 2028 compliance phase)
- Mobile native app (responsive web is sufficient)
- Multi-company support
- Advanced analytics/dashboards beyond basic reports

**Note on Statutory Compliance:** This app handles operational invoicing and simple bookkeeping suitable for a micro firm. Complex statutory filings (annual tax returns, business registry updates) may still require professional help or direct FURS eDavki submission. Research needed to confirm which filings can be self-served with app exports vs. require professional assistance.

**Pros:**
- ✅ Full control over features and UX
- ✅ Learning opportunity (Next.js, Supabase, Slovenian compliance)
- ✅ Can tailor exactly to Unify's minimal needs
- ✅ No recurring SaaS fees (only Vercel/Supabase free tiers likely sufficient)
- ✅ Extensible if needs grow

**Cons:**
- ❌ Development time investment (even minimal app is several days)
- ❌ Ongoing maintenance for tax law changes
- ❌ Must build or integrate e-SLOG gateway by 2028 (non-trivial)
- ❌ Legal risk if invoice format becomes non-compliant
- ❌ **Economically inefficient** at current low volume (dev time > annual invoicing value)
- ❌ Testing/validation burden (accountant must verify output format)

**Estimated Cost:**
- Development: 2–5 days × opportunity cost
- Maintenance: ~1 day/year for updates
- E-SLOG integration (2028): Unknown, likely complex

**Best for:** Companies that value control, learning, or plan to scale invoicing significantly.

### Option C: Hybrid — Manual/Accountant + Minimal Tooling

Continue current approach but add lightweight tooling for PDF generation only.

**Approach:**
- Use free invoice templates (Google Docs, Excel, or Slovenian templates)
- Send PDFs manually (legal until 2028)
- Accountant handles bookkeeping
- Switch to commercial e-invoice provider in 2027 when 2028 deadline approaches

**Pros:**
- ✅ Zero development time now
- ✅ Accountant already familiar with workflow
- ✅ Defers 2028 compliance decision until providers mature
- ✅ Cheapest option for current low volume

**Cons:**
- ❌ Manual work (though minimal at current volume)
- ❌ No digital invoice archive
- ❌ Harder to track payment status systematically
- ❌ Still needs migration to e-SLOG solution by 2028

**Estimated Cost:** 0€ development + existing 350€/year accountant

**Best for:** Companies with very low volume that prioritize zero upfront investment.

## Recommendation

**Lean toward Option A (Buy) or Option C (Hybrid), unless learning/control is a primary goal.**

### Reasoning:

1. **Volume economics:** A few invoices/year doesn't justify custom development time. Even at a low 20€/month SaaS cost (240€/year), that's comparable to 1–2 hours of opportunity cost saved annually.

2. **Compliance risk mitigation:** Slovenian invoicing law is specific (non-VAT clauses, 2028 e-SLOG mandate). Commercial providers handle this by default; custom apps require ongoing legal monitoring.

3. **2028 e-SLOG integration:** Off-the-shelf providers (Minimax, Birokrat) are already building e-SLOG 2.0 compliance. A custom app would need a gateway integration, which is non-trivial.

4. **Accountant workflow:** Commercial tools have standard CSV/XML exports accountants expect. Custom formats require coordination and testing.

5. **Maintenance burden:** Custom apps need updates for tax law changes, security patches, framework upgrades. At Unify's scale, this overhead exceeds the value delivered.

### If choosing to build (Option B):

Only recommended if:
- **Learning goal:** Nejc wants hands-on experience with Next.js + Supabase + Slovenian compliance
- **Future scale:** Plans to expand invoicing volume significantly
- **Control priority:** Strong preference for owning the full stack

In that case, build the V0 scope above but **plan for e-SLOG gateway integration by 2027** (do not delay until December 2027).

### Recommended Action:

1. **Review [competitors-si-invoicing.md](./competitors-si-invoicing.md)** comparison
2. **Trial Minimax or Birokrat** (both have free tiers or trials)
3. **Confirm with accountant:** Which export format do they prefer? (CSV, XML, direct API?)
4. **If satisfied with trial:** Subscribe to basic plan (~10€/month)
5. **If not satisfied:** Revisit Option B with accountant's export specs

This approach gets compliant invoicing running in days, not weeks, and defers the 2028 e-SLOG complexity to specialists.

## Compliance Disclaimer

⚠️ **This is research, not legal or accounting advice.** All invoice format and tax compliance decisions should be confirmed with Unify's accountant or a Slovenian tax advisor. The e-SLOG 2.0 requirements cited are based on October 2026 public information and may evolve before the 1 January 2028 deadline.

## References

- [SPOT.gov.si: Accountancy and Invoicing](https://spot.gov.si/en/info/accountancy/invoicing)
- [Slovenian Government: ZIERDED Adoption Announcement (23 Oct 2025)](https://www.gov.si/novice/2025-10-23-drzavni-zbor-sprejel-zakon-o-izmenjavi-elektronskih-racunov-in-drugih-elektronskih-dokumentov/)
- [ePOS: ZIERDED Analysis (1 Jan 2028 Mandate)](https://epos.si/en/news/slovenian-national-assembly-adopts-zierded-mandatory-b2b-e-invoicing-from-1-january-2028)
- [Minimax.si](https://www.minimax.si/)
- [Birokrat.si](https://www.birokrat.si/)
- [E-računi.com](https://www.e-racuni.com/)

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 27 Oct 2026 | ADR created, status: Proposed | Research phase complete, awaiting owner decision |
| 27 Oct 2026 | ✅ **ACCEPTED: Option B (Build)** | Owner prioritizes learning, control, and tailored UX for Unify's minimal needs |

## Decision Rationale (Accepted)

Nejc has chosen **Option B (Build Custom App)** based on:

1. **Cost savings:** Eliminate 350€/year accountant by handling books internally (ROI positive if app works)
2. **Simplicity for micro firm:** Few transactions/year makes self-service viable (not overwhelming)
3. **Full control:** Tailored exactly to Unify's workflow, not generic SaaS bloat
4. **Learning opportunity:** Hands-on experience with Next.js + Supabase + Slovenian compliance
5. **No recurring SaaS fees:** Leverage free tiers (Vercel, Supabase)
6. **All-in-one:** Invoicing + simple bookkeeping in one tool (vs. buying multiple products)

**Key insight:** At Unify's tiny volume, doing books yourself with a custom tool can be **faster and cheaper** than coordinating with an accountant or learning complex SaaS products designed for larger companies.

**Acknowledged trade-offs:**
- Development time investment (3–7 days for V0 with bookkeeping features)
- Ongoing maintenance responsibility (legal/tax updates)
- Must plan e-SLOG gateway integration by 2027 for 2028 compliance
- **Risk:** If Unify scales significantly or becomes VAT-registered, may eventually need professional accounting help anyway

---

**Implementation Status:**

- [x] ADR accepted with self-service bookkeeping goal
- [x] Next.js + TypeScript + Tailwind + Supabase project scaffolded
- [ ] Supabase schema (customers, invoices, recurring_templates, expenses tables)
- [ ] Invoice list UI with pagination, search, and filters
- [ ] Quick invoice creation workflow (streamlined form)
- [ ] Invoice form with Unify details pre-filled
- [ ] Sequential invoice numbering logic (by year)
- [ ] Customer management (CRUD)
- [ ] Recurring invoice templates and schedule logic
- [ ] **Expense tracking:** Form to log business expenses (date, amount, category, description)
- [ ] **Expense list:** View all expenses, filter by date/category
- [ ] **Revenue report:** Yearly view by period (monthly/quarterly) and by client
- [ ] **Basic P&L:** Total revenue vs. expenses by period (simple profit/loss view)
- [ ] PDF generation (non-VAT template with Slovenian compliance)
- [ ] Email sending integration (send invoice PDFs)
- [ ] Payment status tracking (issued, paid, overdue)
- [ ] **Tax export:** CSV/Excel exports for annual tax filing preparation
- [ ] Basic authentication (Supabase Auth)
- [ ] Deployment to Vercel
- [ ] Production Supabase instance setup

**Post-V0 (Future):**
- [ ] Receipt/document upload for expenses (proof of purchase)
- [ ] VAT support (if/when Unify becomes VAT-registered)
- [ ] E-SLOG 2.0 gateway integration (2027-2028)
- [ ] Research: Which statutory filings can be self-served with app data vs. require professional help

**Future Work (Post-V0):**
- [ ] E-SLOG 2.0 gateway integration (by 2027 for 2028 mandate)
- [ ] Multi-user access for co-owners (if needed)
- [ ] Mobile-responsive optimizations
- [ ] Advanced reporting/analytics
