# Open Questions for Unify Owners

Questions to clarify before finalizing invoicing solution selection or custom development scope.

**Date:** 27 October 2026  
**Context:** See [ADR-0001](./ADR-0001-buy-vs-build-invoicing.md) and [competitors comparison](./competitors-si-invoicing.md)

---

## 1. Business & Access

### 1.1 Co-Owner Access
- **Q:** Do both co-owners need separate logins to create/view invoices?
- **Why it matters:** 
  - Single-user SaaS plans (Birokrat free tier) may be sufficient if only one person invoices
  - Multi-user plans cost more (Minimax ~15€ vs. Birokrat free)
  - If building custom app, affects auth design

**Decision impact:** Determines whether Birokrat free tier is viable or multi-user plan needed.

---

### 1.2 Invoice Volume Projection
- **Q:** Current volume is "few invoices/year." Specifically:
  - How many invoices were issued in 2025? 2024?
  - Any plans to scale client base or service offerings?
  - Expected volume in 2027? 2028?

- **Why it matters:**
  - If <5 invoices/month → Birokrat free tier covers it permanently (0€ cost)
  - If 5–20/month → Basic paid plans (10–15€/month)
  - If scaling to 50+/month → Custom app or enterprise tools may make sense
  - Affects build vs. buy ROI calculation

**Decision impact:** If volume stays ultra-low, building custom app has negative ROI vs. free/cheap SaaS.

---

## 2. Accounting Workflow

### 2.1 Accountant Export Format
- **Q:** What format does the current accountant prefer for importing invoice data?
  - CSV? (If yes, specific column structure?)
  - Excel?
  - XML?
  - Direct integration with their software (Pantheon, SAOP, other)?
  - PDF only (manual entry)?

- **Why it matters:**
  - Minimax/Birokrat export standard CSV/Excel — need to confirm compatibility
  - If accountant uses Pantheon/SAOP, direct integration may streamline workflow (but may not matter at low volume)
  - Custom app would need to match their exact format

**Action:** Send sample Minimax or Birokrat CSV export to accountant for validation.

**Decision impact:** If accountant can't import Birokrat/Minimax formats, custom export is needed (favors Option B or accountant coordination).

---

### 2.2 Accountant's 2028 E-Invoice Plan
- **Q:** Has the accountant discussed ZIERDED (2028 e-SLOG mandate) with Unify?
  - Are they planning to adopt e-SLOG tools themselves?
  - Do they recommend a specific e-invoice provider?
  - Will they handle e-invoice exchange on Unify's behalf (as service)?

- **Why it matters:**
  - If accountant is handling 2028 compliance (e.g., they adopt a Peppol gateway), Unify may not need to integrate e-SLOG directly
  - If Unify must handle e-invoicing independently, buying a provider with e-SLOG support (Minimax, Birokrat) is safer than building

**Decision impact:** May simplify 2028 planning if accountant takes responsibility.

---

## 3. Tax & Compliance

### 3.1 VAT Registration Plans
- **Q:** Is Unify planning to register for VAT (DDV) in the near future?
  - Current status: NOT registered (Zavezanec za DDV: Ne)
  - Any triggers that would require registration? (Revenue thresholds? EU sales?)

- **Why it matters:**
  - Current invoice templates must NOT include DDV fields
  - If VAT registration is imminent, template logic becomes more complex (DDV breakdown, FURS eDavki integration)
  - Off-the-shelf tools (Minimax, Birokrat) handle VAT/non-VAT switching automatically
  - Custom app would need conditional template logic

**Decision impact:** If VAT registration is planned within 1–2 years, favors buying solution with built-in VAT handling.

---

### 3.2 Compliance Validation
- **Q:** Has the accountant reviewed Slovenian invoice format requirements with Unify?
  - Specifically: Non-VAT clauses, FURS/SPOT compliance, sequential numbering rules?
  - Any special clauses or disclosures required for Unify's industry (business services)?

- **Why it matters:**
  - Ensures any custom-built template or purchased tool meets legal requirements
  - Accountant can validate trial invoice outputs before committing

**Action:** Generate test invoice in Birokrat or Minimax and send to accountant for legal review.

---

## 4. Technical & Learning Goals

### 4.1 Learning vs. Shipping Priority
- **Q:** Is this project primarily about:
  - **(A) Getting compliant invoicing running ASAP** (pragmatic: buy Minimax/Birokrat)
  - **(B) Learning opportunity** (Next.js + Supabase + Slovenian compliance hands-on)
  - **(C) Long-term product vision** (building invoicing into a larger business app ecosystem)

- **Why it matters:**
  - If goal is (A): Buy Birokrat free tier, start invoicing today
  - If goal is (B): Build custom app as learning project (acknowledge ROI is negative at current volume)
  - If goal is (C): Assess whether Unify's business will actually need broader custom tooling

**Decision impact:** Determines whether ADR-0001 Option B (build) is justified despite low volume.

---

### 4.2 Integration with Other Unify Tools
- **Q:** Does Unify use (or plan to build) other internal tools that invoicing should integrate with?
  - CRM? (Customer database)
  - Time tracking? (Link hours to invoices)
  - Project management? (Link projects to invoices)
  - Existing Next.js/Supabase apps by Nejc?

- **Why it matters:**
  - If invoicing is standalone → SaaS tools (Minimax/Birokrat) are simpler
  - If invoicing needs to integrate with custom CRM/time-tracking → Custom app may make sense (but only if those tools exist or are planned)

**Decision impact:** If no custom integrations are needed, SaaS is sufficient. If tight integration is required, revisit Option B.

---

## 5. Budget & Opportunity Cost

### 5.1 Development Time Opportunity Cost
- **Q:** If building custom invoicing app (Option B), what is Nejc's opportunity cost?
  - What else could be built/improved with 2–5 days of dev time?
  - Is Unify's business growth blocked on better invoicing, or is current process "good enough"?

- **Why it matters:**
  - At few invoices/year, even a perfectly built custom app delivers minimal business value vs. Birokrat free tier
  - Opportunity cost lens: Is 5 days of dev time better spent on invoicing or on growing revenue-generating projects?

**Recommendation:** Unless learning is the primary goal, 5 days → revenue projects; 0 days → Birokrat free tier.

---

### 5.2 SaaS Budget Tolerance
- **Q:** Is 10–15€/month (Minimax basic) or 8–12€/month (Birokrat paid) acceptable?
  - Context: Unify currently pays ~350€/year to accountant (~29€/month)
  - Adding 10€/month invoicing tool = ~13% increase in admin costs

- **Why it matters:**
  - Birokrat free tier costs 0€ → clearly optimal if sufficient
  - Even paid tiers are <5% of typical accountant cost → likely immaterial

**Decision impact:** Budget is unlikely to be blocker; prioritize functionality and accountant compatibility.

---

## 6. Accountant Coordination (Action Items)

### 6.1 Trial Validation with Accountant
**Recommended action before finalizing decision:**

1. **Set up Birokrat free account** (no credit card required)
2. **Create test invoice** with Unify details:
   - Unify, pisarniške in poslovne storitve, d.o.o.
   - Studeno 6A, 4228 Železniki
   - Davčna: 20260393, Matična: 7179855000
   - Fictional customer (test recipient)
   - Service description: "Vzdrževanje IT sistemov" or similar
   - Non-VAT template (no DDV fields)
3. **Export CSV** from Birokrat
4. **Send to accountant:**
   - PDF invoice for legal review (format compliance)
   - CSV export for import testing
5. **Ask accountant:**
   - Is invoice format legally compliant? Any missing clauses?
   - Can they import CSV into their accounting system? Any field adjustments needed?
   - Do they recommend Birokrat, Minimax, or something else?

---

### 6.2 Minimax Trial (Alternative)
If accountant requests Minimax trial:
1. Sign up for 30-day free trial (may require credit card)
2. Repeat steps 2–5 above
3. Compare Minimax vs. Birokrat UX and accountant feedback

---

## 7. 2028 E-Invoice Strategy

### 7.1 Early Adoption vs. Deadline Approach
- **Q:** Does Unify want to adopt e-invoicing (e-SLOG) before the 1 Jan 2028 mandate?
  - **Early adoption (2026–2027):** Switch to E-računi.com or Minimax e-račun now
  - **Deadline approach (late 2027):** Stay with PDF invoicing, migrate to e-SLOG in 2027 when tools mature

- **Why it matters:**
  - Early adoption = learning curve + testing now (may be overkill for low volume)
  - Deadline approach = simpler today, one-time migration in 2027

**Recommendation:** Unless Unify's clients demand e-invoices early, wait until 2027. Minimax/Birokrat will have e-SLOG ready by then; no need to rush.

---

### 7.2 Provider Contingency
- **Q:** If chosen SaaS provider (Birokrat, Minimax) fails to deliver e-SLOG compliance by 2028, what's backup plan?
  - Switch providers in 2027? (Most support data export → migration path exists)
  - Contract with e-računi.com as gateway?
  - Let accountant handle e-invoice exchange?

**Decision impact:** Low risk — multiple providers are preparing e-SLOG; switching costs are low at Unify's volume.

---

## Summary: Questions to Answer Before Proceeding

| # | Question | Priority | Blocks Decision |
|---|----------|----------|-----------------|
| 1.1 | Multi-user access needed? | Medium | Birokrat free vs. paid |
| 1.2 | Projected invoice volume? | High | Build vs. buy ROI |
| 2.1 | Accountant export format? | **Critical** | Tool selection |
| 2.2 | Accountant's 2028 e-SLOG plan? | Medium | Compliance strategy |
| 3.1 | VAT registration plans? | Low | Template complexity |
| 3.2 | Accountant reviewed format? | **Critical** | Legal compliance |
| 4.1 | Learning vs. shipping priority? | High | Build justification |
| 4.2 | Integration with other tools? | Low | Custom app scope |
| 5.1 | Dev time opportunity cost? | High | Build vs. buy ROI |
| 5.2 | SaaS budget acceptable? | Low | (Likely non-blocker) |

**Critical path:** Answer **2.1** (accountant format) and **3.2** (legal review) via Birokrat trial → Decide buy vs. build.

---

## Recommended Next Actions

1. ✅ **Immediate:** Set up Birokrat free account and generate test invoice
2. ✅ **This week:** Send test invoice + CSV to accountant for validation
3. ⏳ **Wait for accountant feedback** (likely 1–3 days)
4. ✅ **Based on feedback:**
   - If Birokrat approved → Start using (free tier, 0€ cost)
   - If Minimax requested → Trial 30 days, then subscribe (~10€/month)
   - If neither works → Consult on custom export format → Revisit Option B (build)
5. ⏳ **2027:** Revisit e-SLOG compliance as 2028 deadline approaches

**End state:** Compliant invoicing running, accountant happy, minimal cost/maintenance, 2028-ready.

---

**Questions? Contact:**
- Nejc Bevk (co-owner)
- Accountant: (TBD — coordinate via jaka.frelih@unify.si)
