/**
 * Tooltip content for all calculator inputs.
 *
 * Content is stored as TypeScript objects (not JSON, not hardcoded JSX) per ARCH-03.
 * Descriptions support markdown for rich formatting (bold, links, bullet lists).
 * Consumed by generic Tooltip components and available for future AI context.
 */

export interface TooltipContent {
  /** Display label for the input */
  label: string
  /** Markdown-formatted description */
  description: string
  /** Optional anchor link to an explainer section */
  learnMore?: string
}

export const tooltips: Record<string, TooltipContent> = {
  purchasePrice: {
    label: 'Purchase Price',
    description:
      'The total price you would pay for the home. This is the **listing price** or your **offer amount**, not the mortgage amount. In Canada, the median home price varies significantly by city -- from ~$400K in Calgary to $1M+ in Vancouver.',
  },
  downPaymentPercent: {
    label: 'Down Payment',
    description:
      'The percentage of the purchase price you pay upfront. In Canada, the **minimum is 5%** for homes under $500K, **10%** for the portion between $500K and $1M, and **20%** for homes over $1M. Below 20% requires [CMHC mortgage insurance](#cmhc), which adds to your costs.',
    learnMore: '#cmhc',
  },
  mortgageRate: {
    label: 'Mortgage Rate',
    description:
      'Your annual mortgage interest rate. Canadian mortgages use **semi-annual compounding**, which means the effective rate is slightly higher than the posted rate. Most Canadians choose a 5-year fixed term, which is renewed at maturity.',
    learnMore: '#semi-annual-compounding',
  },
  amortizationYears: {
    label: 'Amortization Period',
    description:
      'The total number of years to pay off the mortgage. The Canadian standard is **25 years**. With less than 20% down, the maximum amortization is 25 years. With 20%+ down, some lenders offer up to 30 years, which lowers monthly payments but increases total interest paid.',
  },
  monthlyRent: {
    label: 'Monthly Rent',
    description:
      'The monthly rent you would pay as a renter for a comparable home. This is the **total rent**, not your share if splitting. Annual rent increases are assumed at the provincial guideline rate (typically 2-3% in Ontario).',
  },
  province: {
    label: 'Province',
    description:
      'Your Canadian province determines **land transfer tax rates**, **provincial tax brackets** for investment gains, and other regional costs. Each province has different tax structures that significantly affect the rent-vs-buy comparison.',
    learnMore: '#land-transfer-tax',
  },
  timeHorizon: {
    label: 'Time Horizon',
    description:
      'How many years you plan to compare renting vs. buying. A longer horizon generally favours buying (more time for home equity to build), while a shorter horizon often favours renting (upfront buying costs are amortized over fewer years). **5-10 years** is typical for most decisions.',
  },
  firstTimeBuyer: {
    label: 'First-Time Home Buyer',
    description:
      'First-time buyers in Canada may qualify for several benefits: the **First-Time Home Buyer Tax Credit** ($10,000 federal credit), **FHSA withdrawals** (tax-free up to $40K), **HBP RRSP withdrawals** (up to $60,000), and **land transfer tax rebates** in some provinces.',
  },
  annualIncome: {
    label: 'Annual Income',
    description:
      'Your gross annual income before tax. This is used to estimate the **marginal tax rate** on investment gains in the renting scenario. Higher income means higher taxes on capital gains and dividends, which affects the renter-investor comparison.',
    learnMore: '#marginal-tax-rates',
  },
}
