/**
 * Land transfer tax (LTT) brackets for all 10 Canadian provinces.
 *
 * Sources:
 * - Ontario: ontario.ca Land Transfer Tax Act
 * - BC: gov.bc.ca Property Transfer Tax
 * - Quebec: Standard provincial brackets (municipal variation exists; Montreal has higher tiers)
 * - Manitoba: gov.mb.ca Land Transfer Tax
 * - New Brunswick: Flat 1%
 * - Nova Scotia: Municipal deed transfer tax (Halifax default 1.5%)
 * - PEI: Flat 1% with FTHB full exemption
 * - Newfoundland: Registration fee structure ($100 base + $0.40 per $100 over $500)
 * - Alberta: No LTT (registration fees only)
 * - Saskatchewan: No LTT (title transfer fee only)
 *
 * All bracket rates are expressed as decimals (0.01 = 1%).
 * Bracket ranges use `from` (inclusive) and `to` (exclusive, Infinity for last).
 */
import type { ProvinceCode, ProvinceLttConfig } from '@/types/housing'

/**
 * LTT configuration for every province.
 *
 * For provinces without a true LTT (AB, SK, NL), we model the registration
 * fee structure as brackets with a note. The calculation function will handle
 * the base-fee + per-unit logic for NL, AB, and SK separately.
 */
export const LTT_CONFIG: Readonly<Record<ProvinceCode, ProvinceLttConfig>> = {
  // -------------------------------------------------------------------------
  // Ontario -- 5 marginal brackets + FTHB rebate up to $4,000
  // -------------------------------------------------------------------------
  ON: {
    brackets: [
      { from: 0, to: 55000, rate: 0.005 },
      { from: 55000, to: 250000, rate: 0.01 },
      { from: 250000, to: 400000, rate: 0.015 },
      { from: 400000, to: 2000000, rate: 0.02 },
      { from: 2000000, to: Infinity, rate: 0.025 },
    ],
    fthbRebate: {
      maxRebate: 4000,
      fullExemptionUpTo: 368333,
    },
  },

  // -------------------------------------------------------------------------
  // British Columbia -- 4 brackets + FTHB exemption up to $835K
  // The 5% rate above $3M is 3% general + 2% additional residential
  // -------------------------------------------------------------------------
  BC: {
    brackets: [
      { from: 0, to: 200000, rate: 0.01 },
      { from: 200000, to: 2000000, rate: 0.02 },
      { from: 2000000, to: 3000000, rate: 0.03 },
      { from: 3000000, to: Infinity, rate: 0.05 },
    ],
    fthbRebate: {
      maxRebate: 8000,
      fullExemptionUpTo: 835000,
      partialExemptionUpTo: 860000,
    },
  },

  // -------------------------------------------------------------------------
  // Quebec -- Standard provincial "welcome tax" (droits de mutation) brackets
  // Note: Quebec thresholds are indexed annually by CPI. Values are for 2025-2026.
  // Municipal variation exists -- Montreal has higher tiers above ~$500K.
  // For v1, we use the standard provincial brackets.
  // -------------------------------------------------------------------------
  QC: {
    brackets: [
      { from: 0, to: 61500, rate: 0.005 },
      { from: 61500, to: 307800, rate: 0.01 },
      { from: 307800, to: Infinity, rate: 0.015 },
    ],
    fthbRebate: null,
  },

  // -------------------------------------------------------------------------
  // Manitoba -- 5 brackets (first $30K exempt), no FTHB rebate
  // Additional registration fee ~$70 not modeled separately.
  // -------------------------------------------------------------------------
  MB: {
    brackets: [
      { from: 0, to: 30000, rate: 0 },
      { from: 30000, to: 90000, rate: 0.005 },
      { from: 90000, to: 150000, rate: 0.01 },
      { from: 150000, to: 200000, rate: 0.015 },
      { from: 200000, to: Infinity, rate: 0.02 },
    ],
    fthbRebate: null,
  },

  // -------------------------------------------------------------------------
  // New Brunswick -- Flat 1% of purchase price, no FTHB rebate
  // -------------------------------------------------------------------------
  NB: {
    brackets: [{ from: 0, to: Infinity, rate: 0.01 }],
    fthbRebate: null,
  },

  // -------------------------------------------------------------------------
  // Nova Scotia -- Municipal deed transfer tax, varies by municipality.
  // Using Halifax rate (1.5%) as default -- most NS transactions are in Halifax.
  // No FTHB rebate.
  // -------------------------------------------------------------------------
  NS: {
    brackets: [{ from: 0, to: Infinity, rate: 0.015 }],
    fthbRebate: null,
  },

  // -------------------------------------------------------------------------
  // Prince Edward Island -- Flat 1% with FTHB full exemption
  // -------------------------------------------------------------------------
  PE: {
    brackets: [{ from: 0, to: Infinity, rate: 0.01 }],
    fthbRebate: {
      maxRebate: Infinity, // Full exemption -- entire LTT is rebated
      fullExemptionUpTo: Infinity, // No purchase price cap for FTHB exemption
    },
  },

  // -------------------------------------------------------------------------
  // Newfoundland & Labrador -- Registration fee, not a true LTT
  // $100 base + $0.40 per $100 of value over $500. Max fee $5,000.
  // Modeled as a single bracket for the marginal calculator.
  // The $100 base fee + $500 threshold is handled in the LTT calculation function.
  // -------------------------------------------------------------------------
  NL: {
    brackets: [{ from: 500, to: Infinity, rate: 0.004 }],
    fthbRebate: null,
  },

  // -------------------------------------------------------------------------
  // Alberta -- No LTT. Registration fees only.
  // Property transfer: $50 + $5 per $5,000 of property value
  // Mortgage registration: $50 + $5 per $5,000 of mortgage value
  // Modeled as 0% bracket; actual fee calculated in the LTT function.
  // -------------------------------------------------------------------------
  AB: {
    brackets: [{ from: 0, to: Infinity, rate: 0 }],
    fthbRebate: null,
  },

  // -------------------------------------------------------------------------
  // Saskatchewan -- No LTT. Title transfer fee only.
  // $25 for first $6,300; 0.4% on amounts over $6,300.
  // Modeled as 0% bracket; actual fee calculated in the LTT function.
  // -------------------------------------------------------------------------
  SK: {
    brackets: [{ from: 0, to: Infinity, rate: 0 }],
    fthbRebate: null,
  },
} as const
