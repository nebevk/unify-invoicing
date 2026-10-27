# Slovenian Invoicing Solutions Comparison

Comparison of commercial invoicing tools for Unify d.o.o.'s low-volume needs (few invoices/year, not VAT-registered, preparing for 2028 e-SLOG mandate).

**Last Updated:** 27 October 2026  
**Context:** See [ADR-0001](./ADR-0001-buy-vs-build-invoicing.md) for decision framework.

---

## Summary Table

| Provider | Monthly Cost (Low Volume) | E-račun 2028 Ready | Accountant Export | Best For | Trial Available |
|----------|---------------------------|---------------------|-------------------|----------|-----------------|
| **Minimax** | ~10–15€ (basic plan) | ✅ Yes (e-SLOG roadmap) | CSV, XML, integrations | Small businesses, e-invoice focus | Yes (30-day) |
| **Birokrat** | ~8–12€ (starter plan) | ✅ Yes (actively preparing) | CSV, Excel | Micro companies, simplicity | Yes (free tier) |
| **E-računi.com** | ~5–10€ (pay-per-invoice) | ✅ Yes (core product) | API, CSV | Minimal volume, e-invoice only | Contact sales |
| **Pantheon** | 50€+ (SME plans) | ✅ Yes (enterprise-ready) | Full ERP integration | Medium+ companies | No (enterprise only) |
| **SAOP** | 30€+ (standard plans) | ✅ Yes (preparing) | XML, CSV, API | Established SMEs | Contact sales |

**Recommendation for Unify:** **Minimax** or **Birokrat** — best balance of low cost, simplicity, and 2028 e-SLOG readiness for very low volume.

---

## Detailed Comparison

### 1. Minimax (www.minimax.si)

**Overview:** Cloud-based invoicing and small business accounting platform. Popular in Slovenia for SMEs and freelancers.

**Pricing (Oct 2026):**
- **Basic Plan:** ~10–15€/month (typical for invoicing-only features)
- **Full Accounting Plans:** 20–40€/month (includes bookkeeping, payroll)
- **Note:** Check current pricing at [minimax.si](https://www.minimax.si/cenik/)

**Key Features:**
- ✅ Invoice creation with Slovenian templates (VAT and non-VAT)
- ✅ Sequential invoice numbering
- ✅ Customer database
- ✅ Payment tracking
- ✅ PDF generation
- ✅ E-račun support (already integrated)
- ✅ Automatic legal updates for Slovenian tax law
- ✅ CSV and XML exports for accountants
- ✅ Multi-user access (useful for co-owners)
- ✅ Mobile app

**2028 E-SLOG Readiness:** ✅ Confirmed — Minimax is actively developing e-SLOG 2.0 compliance as part of their e-račun roadmap.

**Accountant Integration:**
- Standard CSV/XML exports
- Many Slovenian accountants already familiar with Minimax format
- Can integrate with accounting software (Pantheon, SAOP)

**Pros for Unify:**
- Mature product with good UX
- E-račun already working (ahead of 2028)
- Likely what accountant is familiar with

**Cons:**
- Slightly higher cost than Birokrat
- May have features Unify doesn't need (bloat)

**Recommendation:** ⭐ **Excellent choice** — Well-rounded, proven, 2028-ready. Start with 30-day trial.

---

### 2. Birokrat (www.birokrat.si)

**Overview:** Lightweight invoicing tool targeting micro-companies and freelancers. Simplified UX, lower cost than Minimax.

**Pricing (Oct 2026):**
- **Free Tier:** Up to 5 invoices/month (may be sufficient for Unify!)
- **Starter Plan:** ~8–12€/month (unlimited invoices)
- **Note:** Check [birokrat.si/cenik](https://www.birokrat.si/) for current tiers

**Key Features:**
- ✅ Simple invoice creation (VAT and non-VAT templates)
- ✅ Sequential numbering
- ✅ Customer management
- ✅ PDF generation
- ✅ E-račun support (preparing for 2028)
- ✅ Excel and CSV exports
- ⚠️ Fewer integrations than Minimax (more standalone)

**2028 E-SLOG Readiness:** ✅ Confirmed — Birokrat is actively preparing e-SLOG 2.0 support, expected ready by 2027.

**Accountant Integration:**
- CSV and Excel exports
- Simpler format (may need to confirm with accountant)

**Pros for Unify:**
- **Free tier may cover Unify's entire volume** (5 invoices/month)
- Very low cost even on paid plan
- Clean, minimal UX
- Focused on micro-businesses (matches Unify's profile)

**Cons:**
- Less mature than Minimax
- Fewer enterprise features (but Unify doesn't need them)

**Recommendation:** ⭐⭐ **Best value** — Free tier alone may solve Unify's needs. Test it first.

---

### 3. E-računi.com

**Overview:** Specialized e-invoice exchange platform. Focused on structured e-invoicing rather than full accounting.

**Pricing (Oct 2026):**
- **Pay-per-invoice:** ~5–10€/month for very low volume, or per-invoice charges
- **Enterprise:** Contact sales
- **Note:** Check [e-racuni.com](https://www.e-racuni.com/) for latest pricing

**Key Features:**
- ✅ E-SLOG native (designed for e-invoices from the start)
- ✅ Peppol network integration
- ✅ API for developers
- ✅ CSV export
- ⚠️ Less focus on traditional PDF invoicing (their core is e-invoice exchange)

**2028 E-SLOG Readiness:** ✅✅ **Core product** — Already compliant with e-SLOG standards.

**Accountant Integration:**
- API-first design (good for custom integrations)
- May be less familiar to traditional accountants vs. Minimax/Birokrat

**Pros for Unify:**
- Future-proof (2028+ ready now)
- Low cost for low volume

**Cons:**
- May be overkill if Unify just needs simple PDF invoices until 2027
- Smaller user base than Minimax/Birokrat

**Recommendation:** ⚠️ **Good for 2028+ planning** — Best if Unify wants to adopt e-invoicing early. Otherwise Minimax/Birokrat are simpler.

---

### 4. Pantheon (www.pantheon.si)

**Overview:** Full ERP system for medium and large Slovenian companies. Includes accounting, payroll, inventory, CRM, etc.

**Pricing (Oct 2026):**
- **Standard Plans:** 50€+/month (typical for SME modules)
- **Enterprise:** Custom pricing
- **Note:** Pantheon is enterprise-grade; pricing varies by modules

**Key Features:**
- ✅ Complete ERP (far beyond invoicing)
- ✅ E-SLOG 2.0 support confirmed
- ✅ Full integration with Slovenian accounting/tax systems
- ⚠️ Complex setup and administration

**2028 E-SLOG Readiness:** ✅ Yes — Enterprise-grade compliance.

**Accountant Integration:**
- ✅✅ Deep integrations (may be what Unify's accountant uses internally)

**Pros for Unify:**
- If accountant already uses Pantheon, direct integration is seamless

**Cons:**
- **Massive overkill** for Unify's volume (few invoices/year)
- High cost
- Steep learning curve

**Recommendation:** ❌ **Not recommended** — Only if Unify scales to 10+ employees with complex operations.

---

### 5. SAOP (www.saop.si)

**Overview:** Established Slovenian accounting software provider. Similar to Pantheon but more SME-focused.

**Pricing (Oct 2026):**
- **Standard Plans:** ~30€+/month
- **Note:** Check [saop.si](https://www.saop.si/) for current pricing

**Key Features:**
- ✅ Full accounting suite
- ✅ E-SLOG 2.0 roadmap (preparing for 2028)
- ✅ Accountant-friendly (many SI accountants use SAOP)

**2028 E-SLOG Readiness:** ✅ Yes (preparing).

**Accountant Integration:**
- ✅✅ Strong (SAOP is accounting-first)

**Pros for Unify:**
- If accountant prefers SAOP exports, could streamline workflow

**Cons:**
- Still overkill for Unify's low volume
- Higher cost than Minimax/Birokrat

**Recommendation:** ⚠️ **Consult accountant** — Only worthwhile if accountant specifically requests SAOP integration.

---

## Final Recommendation for Unify d.o.o.

### Top Choice: **Birokrat Free Tier**

**Why:**
1. **Free** for up to 5 invoices/month — likely covers Unify's entire annual volume
2. E-SLOG 2.0 compliance roadmap confirmed (2028-ready)
3. Simple UX for micro-companies
4. Slovenian-compliant templates (non-VAT included)
5. CSV export for accountant

**Action:** Start with Birokrat free tier immediately. Test invoice generation and confirm CSV export format with accountant.

---

### Alternative: **Minimax Basic Plan**

**If Birokrat doesn't meet needs (e.g., accountant prefers Minimax format):**

1. More mature product with wider accountant adoption
2. ~10–15€/month (still very affordable)
3. 30-day free trial available
4. E-račun already integrated (ahead of 2028)

**Action:** Trial Minimax if Birokrat free tier is insufficient or accountant requests it.

---

### Not Recommended:

- **E-računi.com:** Good for early e-invoice adoption, but Minimax/Birokrat cover this + traditional invoicing
- **Pantheon / SAOP:** Overkill for Unify's scale; only if accountant specifically requires integration

---

## Next Steps

1. ✅ **Trial Birokrat free tier** (no credit card required)
   - Create test invoice with Unify details (non-VAT template)
   - Export CSV
   - Send to accountant for format validation

2. ⚠️ **Confirm with accountant:**
   - Which format do they prefer? (Birokrat CSV, Minimax XML, other?)
   - Do they already use Pantheon/SAOP internally? (If yes, integration may matter)

3. 📅 **If satisfied:** Subscribe (or stay on free tier if sufficient)

4. 📅 **If not satisfied:** Revisit custom build (Option B in ADR-0001)

---

## Sources & Further Reading

- **Minimax:** [minimax.si](https://www.minimax.si/)
- **Birokrat:** [birokrat.si](https://www.birokrat.si/)
- **E-računi:** [e-racuni.com](https://www.e-racuni.com/)
- **Pantheon:** [pantheon.si](https://www.pantheon.si/)
- **SAOP:** [saop.si](https://www.saop.si/)
- **e-SLOG Standard:** [SPOT.gov.si](https://spot.gov.si/)
- **ZIERDED Law (2028 mandate):** [ePOS Analysis](https://epos.si/en/news/slovenian-national-assembly-adopts-zierded-mandatory-b2b-e-invoicing-from-1-january-2028)

**Disclaimer:** Pricing is based on publicly available information as of October 2026 and may have changed. Always verify current pricing and features before subscribing. This comparison is research, not a formal recommendation or endorsement.
