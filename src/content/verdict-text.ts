/**
 * Verdict explanation templates for the rent-vs-buy comparison result.
 *
 * Templates use {{placeholder}} syntax for dynamic values that will be
 * filled in by Phase 5 (Verdict & Results Display).
 *
 * Content stored as TypeScript objects per ARCH-03.
 */

export interface VerdictTextContent {
  /** Scenario identifier */
  scenario: string
  /** Short headline for the verdict card */
  headline: string
  /** Summary template with {{placeholders}} for dynamic values */
  summary: string
  /** Key factors that drive this verdict */
  factors: string[]
}

export const verdictText: Record<string, VerdictTextContent> = {
  'rent-wins': {
    scenario: 'rent-wins',
    headline: 'Renting Comes Out Ahead',
    summary:
      'Over {{timeHorizon}} years, renting and investing the difference leaves you **{{advantage}}** better off than buying. The renter-investor ends up with a net worth of **{{renterNetWorth}}** compared to the homeowner\'s **{{buyerNetWorth}}**.',
    factors: [
      'High purchase price relative to rent makes the monthly cost gap large enough that investing the difference wins',
      'Opportunity cost of the **{{downPayment}}** down payment invested at **{{returnRate}}%** grows significantly over {{timeHorizon}} years',
      'Upfront buying costs (land transfer tax, closing costs) of **{{closingCosts}}** are a drag on the buyer from day one',
      'Property tax and maintenance costs of **{{annualOwnershipCosts}}/year** reduce the homeowner\'s effective return',
      'At a **{{mortgageRate}}%** mortgage rate, total interest paid over the amortization is substantial',
    ],
  },

  'buy-wins': {
    scenario: 'buy-wins',
    headline: 'Buying Comes Out Ahead',
    summary:
      'Over {{timeHorizon}} years, buying builds **{{advantage}}** more wealth than renting and investing. The homeowner ends up with a net worth of **{{buyerNetWorth}}** compared to the renter-investor\'s **{{renterNetWorth}}**.',
    factors: [
      'Monthly ownership costs are close to rent, leaving the renter little surplus to invest',
      'Home appreciation of **{{appreciationRate}}%** per year compounds on the full property value, not just the down payment (leveraged return)',
      'Mortgage principal paydown builds equity with every payment -- forced savings the renter must actively replicate',
      'After {{mortgagePaidOff}} years, the mortgage is paid off and housing costs drop significantly',
      'The homeowner\'s **{{homeEquity}}** in equity is tax-free (principal residence exemption), while the renter\'s investment gains are taxable',
    ],
  },
}
