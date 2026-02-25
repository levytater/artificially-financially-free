/**
 * Canadian mortgage payment and amortization schedule calculations.
 *
 * Uses Canadian semi-annual compounding (not US monthly compounding).
 * The effective monthly rate is: (1 + annualRate/2)^(1/6) - 1
 *
 * All arithmetic uses Decimal.js to avoid floating-point errors in
 * financial calculations.
 */
import { Decimal, effectiveMonthlyRate } from '@/lib/decimal'
import type { MonthlyPaymentBreakdown } from '@/types/housing'

/**
 * Calculate the monthly mortgage payment using Canadian semi-annual compounding.
 *
 * Formula: PMT = (r_m * P) / (1 - (1 + r_m)^(-n))
 * Where r_m = (1 + annualRate/2)^(1/6) - 1
 *
 * @param principal - Mortgage principal amount (e.g., 480000)
 * @param annualRatePercent - Annual interest rate as percentage (e.g., 5.5 for 5.5%)
 * @param amortizationYears - Amortization period in years (e.g., 25)
 * @returns Monthly payment as a Decimal
 */
export function calculateMonthlyPayment(
  principal: Decimal,
  annualRatePercent: Decimal,
  amortizationYears: Decimal
): Decimal {
  const totalMonths = amortizationYears.mul(12)

  // Edge case: 0% interest rate
  if (annualRatePercent.isZero()) {
    return principal.div(totalMonths)
  }

  const rm = effectiveMonthlyRate(annualRatePercent.toNumber())
  const n = totalMonths

  // PMT = (r_m * P) / (1 - (1 + r_m)^(-n))
  const numerator = rm.mul(principal)
  const denominator = new Decimal(1).minus(
    rm.plus(1).pow(n.neg())
  )

  return numerator.div(denominator)
}

/**
 * Generate a complete month-by-month amortization schedule.
 *
 * Each entry shows the payment, principal portion, interest portion,
 * and remaining balance. The final payment is adjusted to zero out
 * the balance exactly.
 *
 * @param principal - Mortgage principal amount
 * @param annualRatePercent - Annual interest rate as percentage (e.g., 5.5 for 5.5%)
 * @param amortizationYears - Amortization period in years
 * @returns Array of MonthlyPaymentBreakdown entries
 */
export function generateAmortizationSchedule(
  principal: Decimal,
  annualRatePercent: Decimal,
  amortizationYears: Decimal
): MonthlyPaymentBreakdown[] {
  const totalMonths = amortizationYears.mul(12).toNumber()
  const monthlyPayment = calculateMonthlyPayment(
    principal,
    annualRatePercent,
    amortizationYears
  )

  const isZeroRate = annualRatePercent.isZero()
  const rm = isZeroRate
    ? new Decimal(0)
    : effectiveMonthlyRate(annualRatePercent.toNumber())

  const schedule: MonthlyPaymentBreakdown[] = []
  let balance = principal

  for (let month = 1; month <= totalMonths; month++) {
    const interest = balance.mul(rm)
    let principalPortion: Decimal
    let payment: Decimal

    if (month === totalMonths) {
      // Final payment: adjust to zero out remaining balance exactly
      principalPortion = balance
      payment = balance.plus(interest)
    } else {
      payment = monthlyPayment
      principalPortion = payment.minus(interest)
    }

    balance = balance.minus(principalPortion)

    schedule.push({
      month,
      payment,
      principal: principalPortion,
      interest,
      remainingBalance: balance,
    })
  }

  return schedule
}

/** Yearly mortgage summary aggregate */
export interface YearlyMortgageSummary {
  year: number
  totalPayment: Decimal
  totalPrincipal: Decimal
  totalInterest: Decimal
  endBalance: Decimal
}

/**
 * Aggregate a monthly amortization schedule into yearly summaries.
 *
 * Year N covers months (N-1)*12+1 through N*12.
 *
 * @param schedule - Monthly amortization schedule from generateAmortizationSchedule
 * @returns Array of yearly summaries
 */
export function calculateYearlyMortgageSummary(
  schedule: MonthlyPaymentBreakdown[]
): YearlyMortgageSummary[] {
  const totalYears = Math.ceil(schedule.length / 12)
  const yearly: YearlyMortgageSummary[] = []

  for (let year = 1; year <= totalYears; year++) {
    const startIdx = (year - 1) * 12
    const endIdx = Math.min(year * 12, schedule.length)
    const monthsInYear = schedule.slice(startIdx, endIdx)

    let totalPayment = new Decimal(0)
    let totalPrincipal = new Decimal(0)
    let totalInterest = new Decimal(0)

    for (const entry of monthsInYear) {
      totalPayment = totalPayment.plus(entry.payment)
      totalPrincipal = totalPrincipal.plus(entry.principal)
      totalInterest = totalInterest.plus(entry.interest)
    }

    yearly.push({
      year,
      totalPayment,
      totalPrincipal,
      totalInterest,
      endBalance: monthsInYear[monthsInYear.length - 1].remainingBalance,
    })
  }

  return yearly
}
