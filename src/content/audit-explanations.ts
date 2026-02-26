/**
 * Explanatory content for audit breakdown table column headers.
 *
 * Each entry provides a short label and detailed description for
 * the year-by-year audit table in the Math Breakdown tab.
 */

export interface AuditTooltipContent {
  label: string
  description: string
}

/**
 * Column explanations for the audit breakdown table.
 * Used to generate tooltips and table headers.
 */
export const auditExplanations: Record<string, AuditTooltipContent> = {
  year: {
    label: 'Year',
    description:
      'The year number in your time horizon (Year 1 = first year after purchase/starting to rent).',
  },
  homeValue: {
    label: 'Home Value',
    description:
      "The property's market value at year end, growing at your home appreciation rate compounded annually.",
  },
  mortgageBalance: {
    label: 'Mortgage Balance',
    description:
      'Outstanding mortgage principal at year end. Decreases each year as principal payments are made.',
  },
  homeEquity: {
    label: 'Home Equity',
    description:
      "Home Value minus Mortgage Balance. This is what you'd receive if you sold (before selling costs).",
  },
  annualAppreciation: {
    label: 'Annual Appreciation',
    description:
      'Increase in home value during the year due to appreciation rate.',
  },
  mortgagePayment: {
    label: 'Mortgage Payment',
    description:
      'Total mortgage principal and interest paid during the year. After the mortgage is paid off, this drops to $0.',
  },
  propertyTax: {
    label: 'Property Tax',
    description:
      "Annual property tax based on the start-of-year home value and your province's property tax rate.",
  },
  maintenance: {
    label: 'Maintenance',
    description:
      "Annual maintenance and repair costs as a percentage of home value. Renters don't pay this.",
  },
  totalBuyerCost: {
    label: 'Total Buyer Cost',
    description:
      'All homeowner costs for the year: mortgage payment + property tax + maintenance + home insurance.',
  },
  annualRent: {
    label: 'Annual Rent',
    description:
      'Total rent paid during the year. Increases annually at your specified rent increase rate.',
  },
  monthlySavings: {
    label: 'Monthly Savings',
    description:
      'Monthly difference between buyer costs and rent. This amount is invested by the renter each month. Clamped to $0 minimum (no portfolio withdrawals).',
  },
  portfolioBalance: {
    label: 'Portfolio Balance',
    description:
      "Renter-investor's total investment portfolio value at year end, including lump sum growth plus monthly contribution compounding.",
  },
  netWorthDifference: {
    label: 'Net Worth Diff',
    description:
      'Renter net worth minus buyer net worth (with selling costs). Positive = renting ahead, negative = buying ahead.',
  },
  buyerCumulativeCost: {
    label: 'Cumulative Buyer Cost',
    description:
      'Running total of all homeowner costs since purchase (mortgage + property tax + maintenance + insurance).',
  },
  renterCumulativeRent: {
    label: 'Cumulative Rent',
    description: 'Running total of all rent payments since Year 1.',
  },
  buyerEquityNetOfSelling: {
    label: 'Buyer Equity (net of selling)',
    description:
      'Home equity minus estimated selling costs (realtor commission + legal + mortgage discharge). This is the buyer net worth.',
  },
}
