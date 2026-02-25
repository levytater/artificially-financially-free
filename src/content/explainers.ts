/**
 * Explainer content for financial concepts used in the calculator.
 *
 * Content is stored as TypeScript objects with markdown body text per ARCH-03.
 * Each explainer links to related inputs via the relatedInputs array.
 * Consumed by Explainer components and available for future AI context.
 */

export interface ExplainerContent {
  /** Display title for the explainer */
  title: string
  /** URL-friendly slug for anchor links */
  slug: string
  /** Markdown-formatted body text */
  body: string
  /** Keys into the tooltips record for related inputs */
  relatedInputs: string[]
}

export const explainers: Record<string, ExplainerContent> = {
  cmhc: {
    title: 'CMHC Mortgage Insurance',
    slug: 'cmhc',
    body: `When your down payment is **less than 20%** of the purchase price, Canadian lenders require mortgage default insurance (commonly called "CMHC insurance," though Sagen and Canada Guaranty also provide it).

## Premium Rates

The insurance premium is a percentage of the mortgage amount (not the purchase price):

- **5% - 9.99% down:** 4.00% of mortgage
- **10% - 14.99% down:** 3.10% of mortgage
- **15% - 19.99% down:** 2.80% of mortgage

The premium is typically added to your mortgage balance, meaning you pay interest on it over the full amortization period.

## Example

On a $500,000 home with 10% down ($50,000):
- Mortgage: $450,000
- CMHC premium: $450,000 x 3.10% = **$13,950**
- Total mortgage with insurance: $463,950

**Note:** Provincial sales tax (PST) applies to the CMHC premium in some provinces (Ontario: 8%, Quebec: 9%).`,
    relatedInputs: ['downPaymentPercent', 'purchasePrice'],
  },

  'semi-annual-compounding': {
    title: 'Canadian Semi-Annual Compounding',
    slug: 'semi-annual-compounding',
    body: `Canadian mortgages are unique: by law, fixed-rate mortgages must use **semi-annual compounding**, not monthly compounding used in the US and most other countries.

## What This Means

The posted annual rate is compounded twice per year, then converted to a monthly payment rate. The formula:

**Effective monthly rate = (1 + annual_rate / 2) ^ (1/6) - 1**

## Impact

For a 5.5% posted rate:
- **Monthly compounding** (US style): 5.5% / 12 = 0.4583% per month
- **Semi-annual compounding** (Canadian): (1 + 0.055/2)^(1/6) - 1 = 0.4532% per month

The Canadian method results in a **slightly lower effective rate**, meaning Canadian borrowers pay slightly less interest than the posted rate would suggest under monthly compounding.

This calculator automatically applies semi-annual compounding to all mortgage calculations.`,
    relatedInputs: ['mortgageRate'],
  },

  'opportunity-cost': {
    title: 'Opportunity Cost: Renting + Investing the Difference',
    slug: 'opportunity-cost',
    body: `The core insight of rent-vs-buy analysis is **opportunity cost**: money spent on buying a home could alternatively be invested in the stock market.

## The Renter-Investor Strategy

A renter who invests the difference between renting and owning costs -- including the down payment, closing costs, property tax, maintenance, and the mortgage premium over rent -- may end up wealthier than a homeowner.

## What Gets Invested

1. **Down payment** -- invested on day one instead of locked in home equity
2. **Closing costs** -- land transfer tax, legal fees, inspection (saved by renting)
3. **Monthly surplus** -- when total ownership costs exceed rent, the difference is invested
4. **Maintenance and property tax** -- ongoing costs that renters avoid

## Why It Matters

Most "rent vs buy" calculators ignore opportunity cost entirely, making buying look artificially better. This calculator models the renter as an active investor to give a fair comparison.

**Important:** Investment returns are not guaranteed. Historical stock market returns average ~7% nominal, but individual results vary significantly.`,
    relatedInputs: ['monthlyRent', 'purchasePrice', 'downPaymentPercent'],
  },

  'land-transfer-tax': {
    title: 'Land Transfer Tax by Province',
    slug: 'land-transfer-tax',
    body: `Land transfer tax (LTT) is a one-time tax paid when you purchase property. Each province has different rates and brackets.

## Key Provincial Rates

- **Ontario:** Progressive brackets from 0.5% to 2.5% (Toronto adds a **municipal LTT** on top)
- **British Columbia:** Progressive brackets from 1% to 5% (foreign buyer surcharge may apply)
- **Alberta:** No land transfer tax (uses a flat property registration fee instead)
- **Quebec:** "Welcome tax" (droits de mutation) with progressive brackets from 0.5% to 3%

## First-Time Buyer Rebates

Several provinces offer LTT rebates for first-time buyers:
- **Ontario:** Up to $4,000 rebate (full rebate on homes up to $368,000)
- **Toronto:** Up to $4,475 additional municipal rebate
- **BC:** Reduced or eliminated LTT on homes under $835,000 for first-time buyers
- **PEI:** Full exemption for first-time buyers on homes under $200,000

Toggle "First-Time Home Buyer" in the calculator to see the impact of these rebates.`,
    relatedInputs: ['province', 'purchasePrice', 'firstTimeBuyer'],
  },

  'marginal-tax-rates': {
    title: 'How Investment Gains Are Taxed',
    slug: 'marginal-tax-rates',
    body: `When a renter invests the money they save by not buying, the investment gains are subject to tax. The tax rate depends on your **marginal tax bracket** and the **type of gain**.

## Types of Investment Income

- **Capital gains:** Only **50% of the gain is taxable** (the "inclusion rate"). If you're in a 40% marginal bracket, you effectively pay 20% tax on capital gains.
- **Canadian dividends:** Receive a **dividend tax credit** that reduces the effective tax rate. The gross-up and credit mechanism means eligible dividends are taxed at lower effective rates.
- **Interest income:** Taxed at your **full marginal rate** (no preferential treatment).

## Tax-Sheltered Accounts

Investment gains inside **TFSA**, **RRSP**, or **FHSA** accounts are taxed differently:
- **TFSA:** All gains are **completely tax-free**
- **RRSP:** Gains grow tax-deferred; taxed as income on withdrawal
- **FHSA:** Tax-deductible contributions + tax-free withdrawal for home purchase

This calculator estimates taxes based on your annual income and province, applying the appropriate federal and provincial marginal rates to investment returns.`,
    relatedInputs: ['annualIncome', 'province'],
  },
}
