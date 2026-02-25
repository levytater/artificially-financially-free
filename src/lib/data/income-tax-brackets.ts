/**
 * 2025 Canadian federal and provincial income tax brackets.
 *
 * Used by the income tax module to calculate combined marginal tax rates
 * for estimating capital gains tax on investment returns.
 *
 * All rates are expressed as decimals (0.15 = 15%).
 * Bracket ranges use `from` (inclusive) and `to` (exclusive, Infinity for last).
 * Reuses the TaxBracket interface from housing types (same { from, to, rate } format).
 *
 * Sources:
 * - Federal: Fidelity.ca 2025 Canadian income tax brackets
 * - Provincial: Fidelity.ca, cross-verified with Wealthsimple and TaxTips.ca
 * - All values are 2025 tax year figures
 *
 * Note: The federal lowest bracket was reduced from 15% to 14% effective July 1, 2025.
 * We use the standard published 15% rate as this is a forward-looking estimation tool,
 * not a tax filing calculator.
 */
import type { ProvinceCode, TaxBracket } from '@/types/housing'

// ---------------------------------------------------------------------------
// Federal Tax Brackets (2025)
// ---------------------------------------------------------------------------

export const FEDERAL_TAX_BRACKETS: readonly TaxBracket[] = [
  { from: 0, to: 57375, rate: 0.15 },
  { from: 57375, to: 114750, rate: 0.205 },
  { from: 114750, to: 177882, rate: 0.26 },
  { from: 177882, to: 253414, rate: 0.29 },
  { from: 253414, to: Infinity, rate: 0.33 },
] as const

// ---------------------------------------------------------------------------
// Provincial Tax Brackets (2025) — All 10 Provinces
// ---------------------------------------------------------------------------

export const PROVINCIAL_TAX_BRACKETS: Readonly<Record<ProvinceCode, readonly TaxBracket[]>> = {
  // -------------------------------------------------------------------------
  // Alberta — 5 brackets (10% to 15%)
  // -------------------------------------------------------------------------
  AB: [
    { from: 0, to: 151234, rate: 0.10 },
    { from: 151234, to: 181481, rate: 0.12 },
    { from: 181481, to: 241974, rate: 0.13 },
    { from: 241974, to: 362961, rate: 0.14 },
    { from: 362961, to: Infinity, rate: 0.15 },
  ],

  // -------------------------------------------------------------------------
  // British Columbia — 7 brackets (5.06% to 20.50%)
  // -------------------------------------------------------------------------
  BC: [
    { from: 0, to: 49279, rate: 0.0506 },
    { from: 49279, to: 98560, rate: 0.077 },
    { from: 98560, to: 113158, rate: 0.105 },
    { from: 113158, to: 137407, rate: 0.1229 },
    { from: 137407, to: 186306, rate: 0.147 },
    { from: 186306, to: 259829, rate: 0.168 },
    { from: 259829, to: Infinity, rate: 0.205 },
  ],

  // -------------------------------------------------------------------------
  // Manitoba — 3 brackets (10.80% to 17.40%)
  // -------------------------------------------------------------------------
  MB: [
    { from: 0, to: 47564, rate: 0.108 },
    { from: 47564, to: 101200, rate: 0.1275 },
    { from: 101200, to: Infinity, rate: 0.174 },
  ],

  // -------------------------------------------------------------------------
  // New Brunswick — 4 brackets (9.40% to 19.50%)
  // -------------------------------------------------------------------------
  NB: [
    { from: 0, to: 51306, rate: 0.094 },
    { from: 51306, to: 102614, rate: 0.14 },
    { from: 102614, to: 190060, rate: 0.16 },
    { from: 190060, to: Infinity, rate: 0.195 },
  ],

  // -------------------------------------------------------------------------
  // Newfoundland and Labrador — 8 brackets (8.70% to 21.80%)
  // -------------------------------------------------------------------------
  NL: [
    { from: 0, to: 44192, rate: 0.087 },
    { from: 44192, to: 88382, rate: 0.145 },
    { from: 88382, to: 157792, rate: 0.158 },
    { from: 157792, to: 220910, rate: 0.178 },
    { from: 220910, to: 282214, rate: 0.198 },
    { from: 282214, to: 564429, rate: 0.208 },
    { from: 564429, to: 1128858, rate: 0.213 },
    { from: 1128858, to: Infinity, rate: 0.218 },
  ],

  // -------------------------------------------------------------------------
  // Nova Scotia — 5 brackets (8.79% to 21.00%)
  // -------------------------------------------------------------------------
  NS: [
    { from: 0, to: 30507, rate: 0.0879 },
    { from: 30507, to: 61015, rate: 0.1495 },
    { from: 61015, to: 95883, rate: 0.1667 },
    { from: 95883, to: 154650, rate: 0.175 },
    { from: 154650, to: Infinity, rate: 0.21 },
  ],

  // -------------------------------------------------------------------------
  // Ontario — 5 brackets (5.05% to 13.16%)
  // Note: Ontario surtax not modeled in v1 (see RESEARCH.md Open Questions)
  // -------------------------------------------------------------------------
  ON: [
    { from: 0, to: 52886, rate: 0.0505 },
    { from: 52886, to: 105775, rate: 0.0915 },
    { from: 105775, to: 150000, rate: 0.1116 },
    { from: 150000, to: 220000, rate: 0.1216 },
    { from: 220000, to: Infinity, rate: 0.1316 },
  ],

  // -------------------------------------------------------------------------
  // Prince Edward Island — 5 brackets (9.50% to 19.00%)
  // -------------------------------------------------------------------------
  PE: [
    { from: 0, to: 33328, rate: 0.095 },
    { from: 33328, to: 64656, rate: 0.1347 },
    { from: 64656, to: 105000, rate: 0.166 },
    { from: 105000, to: 140000, rate: 0.1762 },
    { from: 140000, to: Infinity, rate: 0.19 },
  ],

  // -------------------------------------------------------------------------
  // Quebec — 4 brackets (14.00% to 25.75%)
  // Note: Quebec abatement (16.5% federal reduction) not modeled in v1
  // (see RESEARCH.md Open Questions)
  // -------------------------------------------------------------------------
  QC: [
    { from: 0, to: 53255, rate: 0.14 },
    { from: 53255, to: 106495, rate: 0.19 },
    { from: 106495, to: 129590, rate: 0.24 },
    { from: 129590, to: Infinity, rate: 0.2575 },
  ],

  // -------------------------------------------------------------------------
  // Saskatchewan — 3 brackets (10.50% to 14.50%)
  // -------------------------------------------------------------------------
  SK: [
    { from: 0, to: 53463, rate: 0.105 },
    { from: 53463, to: 152750, rate: 0.125 },
    { from: 152750, to: Infinity, rate: 0.145 },
  ],
} as const
