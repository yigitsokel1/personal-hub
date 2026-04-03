# Tech Debt / Follow-up Notes

## From Sprint 2

### 1. Runtime validation for enum-like fields
Current parser uses type assertions for fields like `status`, `engagementType`, `confidentialityLevel`, and `maturityLevel`.
Need proper runtime guards or schema validation.

Priority: medium

---

### 2. cover object parsing cleanup
`cover.src` currently falls back to an empty string in some cases.
This should be refactored so `cover` is either fully valid or omitted.

Priority: medium

---

### 3. Metadata standardization
Need stronger consistency rules for:
- status
- featured
- updatedAt
- seo overrides

Priority: medium

---
