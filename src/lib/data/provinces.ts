/**
 * Province codes, names, and default property tax rates for all 10 Canadian provinces.
 *
 * Territories (YT, NT, NU) are excluded from v1 -- small population,
 * different tax structures, limited demand.
 */
import type { ProvinceCode } from '@/types/housing'

/** Full province names keyed by province code */
export const PROVINCE_NAMES: Readonly<Record<ProvinceCode, string>> = {
  AB: 'Alberta',
  BC: 'British Columbia',
  MB: 'Manitoba',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  NS: 'Nova Scotia',
  ON: 'Ontario',
  PE: 'Prince Edward Island',
  QC: 'Quebec',
  SK: 'Saskatchewan',
} as const

/** All 10 province codes as a typed array */
export const PROVINCE_CODES: readonly ProvinceCode[] = [
  'AB',
  'BC',
  'MB',
  'NB',
  'NL',
  'NS',
  'ON',
  'PE',
  'QC',
  'SK',
] as const

/**
 * Default property tax rates by province as a percentage of assessed value.
 *
 * These are province-level approximations. Actual rates vary by municipality.
 * Users can override in the calculator input panel.
 */
export const DEFAULT_PROPERTY_TAX_RATES: Readonly<Record<ProvinceCode, number>> = {
  AB: 0.8,
  BC: 0.5,
  MB: 1.5,
  NB: 1.3,
  NL: 0.9,
  NS: 1.3,
  ON: 1.0,
  PE: 1.0,
  QC: 1.1,
  SK: 1.3,
} as const
