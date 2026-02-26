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
  advancedMode: {
    label: 'Advanced Mode',
    description:
      'Advanced mode reveals per-account investment return controls (TFSA, RRSP, Non-registered) and additional rate inputs. Use this if you want to model different return expectations for different account types, or if you want granular control over rates like maintenance, appreciation, and inflation. Most users can stick with Simple mode.',
  },
  investmentReturn: {
    label: 'Investment Return',
    description:
      'The expected annual return on your investments as a renter. Historically, Canadian and US stock markets have averaged **6-7% nominal returns** over the long term. This is the master dial that sets returns for all account types (TFSA, RRSP, Non-registered) unless you override them in Advanced mode.',
  },
  tfsaReturn: {
    label: 'TFSA Return',
    description:
      'Expected annual return on investments in your **Tax-Free Savings Account (TFSA)**. Growth and withdrawals are completely tax-free, making this the most tax-efficient account. In Advanced mode, you can override the master investment return if you allocate different assets to your TFSA.',
  },
  rrspReturn: {
    label: 'RRSP Return',
    description:
      'Expected annual return on investments in your **Registered Retirement Savings Plan (RRSP)**. Growth is tax-deferred -- you pay no tax until withdrawal (typically in retirement at a lower tax rate). In Advanced mode, you can set a different return if your RRSP holds different assets than your TFSA.',
  },
  nonRegisteredReturn: {
    label: 'Non-Registered Return',
    description:
      'Expected annual return on investments in a **non-registered (taxable) account**. Capital gains are taxed annually (50% inclusion rate), making this the least tax-efficient account. In Advanced mode, you can model different asset allocations with different expected returns.',
  },
  appreciationRate: {
    label: 'Home Appreciation',
    description:
      'The expected annual rate of home price growth. Historically, Canadian home prices have appreciated at **3-5% annually** over the long term, though this varies significantly by region and time period. This rate affects the home equity you build and the proceeds when you eventually sell.',
    learnMore: '#home-appreciation',
  },
  rentIncreaseRate: {
    label: 'Rent Increase',
    description:
      'The expected annual rent increase. Most provinces have rent control guidelines -- for example, Ontario typically allows **2-3% annual increases** tied to CPI. This affects how much you save each year as a renter compared to a fixed mortgage payment.',
  },
  inflationRate: {
    label: 'Inflation Rate',
    description:
      'The expected annual inflation rate. The Bank of Canada targets **2% inflation**, though actual inflation has varied (3-4% in recent years). Inflation erodes the real value of future dollars, affecting both housing costs and investment returns in real terms.',
  },
  maintenancePercent: {
    label: 'Maintenance Cost',
    description:
      'Annual home maintenance and repairs as a percentage of home value. The rule of thumb is **1-2% annually** -- for a $500K home, that is $5,000-$10,000 per year. This includes HVAC servicing, roof repairs, appliance replacements, landscaping, and other upkeep that renters do not pay.',
  },
  sellingCostsPercent: {
    label: 'Selling Costs',
    description:
      'Transaction costs when you sell the home as a percentage of the sale price. In Canada, this typically includes **realtor commission (5% of sale price)** plus **legal fees, staging, and other closing costs (~1%)**. Total: around 6% of the final sale price.',
  },
  homeInsurance: {
    label: 'Home Insurance',
    description:
      'Annual homeowner insurance premium. This covers property damage, liability, and other risks. Typical cost is **$1,500-$3,000 per year** depending on home value, location, and coverage. Renters pay tenant insurance instead, which is much cheaper (~$200-$400/year).',
  },
  // Result metric tooltips
  renterNetWorth: {
    label: 'Renter Net Worth',
    description:
      'The total value of the renter-investor\'s portfolio at the end of your time horizon. This includes the initial lump sum (what you would have spent on a down payment and closing costs) plus all monthly savings invested over time, with after-tax returns compounded monthly.',
  },
  buyerNetWorth: {
    label: 'Buyer Net Worth',
    description:
      'The homeowner\'s net position at the end of your time horizon after selling. Calculated as: home value (with appreciation) minus remaining mortgage balance minus selling costs (realtor commission + legal fees, typically ~6% of sale price).',
  },
  dollarAdvantage: {
    label: 'Dollar Advantage',
    description:
      'The absolute dollar difference in net worth between the winning and losing strategy at the end of your time horizon. This is the key bottom-line number — how much more wealth the better option produces.',
  },
  percentageAdvantage: {
    label: 'Percentage Advantage',
    description:
      'The dollar advantage expressed as a percentage of the winning strategy\'s final net worth. Helps contextualize whether the dollar difference is significant relative to the total wealth involved.',
  },
  breakEvenYear: {
    label: 'Break-Even Year',
    description:
      'The first year where buying\'s net worth surpasses renting\'s net worth (or vice versa). Before this year, the other strategy is winning. If shown as \'Never\', the winning strategy maintains its lead for the entire time horizon.',
  },
  marginalTaxRate: {
    label: 'Marginal Tax Rate',
    description:
      'Your combined federal + provincial marginal tax rate, auto-calculated from your annual income and province. This rate determines how much tax you pay on investment capital gains in the renting scenario. Capital gains use a 50% inclusion rate, so only half the gain is taxed at this rate.',
  },
}
