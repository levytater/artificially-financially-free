/**
 * Mortgage calculation tests with bank-verified scenarios.
 *
 * Uses Canadian semi-annual compounding formula:
 *   r_m = (1 + annualRate/2)^(1/6) - 1
 *   PMT = (r_m * P) / (1 - (1 + r_m)^(-n))
 *
 * Expected values computed from the semi-annual compounding formula
 * and cross-checked against RBC mortgage calculator.
 */
import { describe, it, expect } from 'vitest'
import Decimal from 'decimal.js'
import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  calculateYearlyMortgageSummary,
} from '@/lib/calculations/mortgage'

describe('calculateMonthlyPayment', () => {
  it('$480,000 at 5.5% for 25 years -- ~$2,929.88/month', () => {
    const payment = calculateMonthlyPayment(
      new Decimal(480000),
      new Decimal(5.5),
      new Decimal(25)
    )
    // Within $1 tolerance -- verified via Canadian semi-annual compounding formula
    expect(payment.toNumber()).toBeCloseTo(2929.88, 0)
  })

  it('$300,000 at 4.5% for 25 years -- ~$1,660.42/month', () => {
    const payment = calculateMonthlyPayment(
      new Decimal(300000),
      new Decimal(4.5),
      new Decimal(25)
    )
    expect(payment.toNumber()).toBeCloseTo(1660.42, 0)
  })

  it('$800,000 at 6.0% for 30 years -- ~$4,758.59/month', () => {
    const payment = calculateMonthlyPayment(
      new Decimal(800000),
      new Decimal(6.0),
      new Decimal(30)
    )
    expect(payment.toNumber()).toBeCloseTo(4758.59, 0)
  })

  it('$200,000 at 3.5% for 20 years -- ~$1,157.33/month', () => {
    const payment = calculateMonthlyPayment(
      new Decimal(200000),
      new Decimal(3.5),
      new Decimal(20)
    )
    expect(payment.toNumber()).toBeCloseTo(1157.33, 0)
  })

  it('0% interest rate -- payment = principal / total months', () => {
    const payment = calculateMonthlyPayment(
      new Decimal(240000),
      new Decimal(0),
      new Decimal(20)
    )
    // 240000 / (20 * 12) = 1000
    expect(payment.toNumber()).toBe(1000)
  })
})

describe('generateAmortizationSchedule', () => {
  const principal = new Decimal(480000)
  const rate = new Decimal(5.5)
  const years = new Decimal(25)

  it('produces 300 entries (25 * 12)', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    expect(schedule).toHaveLength(300)
  })

  it('first month: interest portion > principal portion', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    expect(schedule[0].interest.greaterThan(schedule[0].principal)).toBe(true)
  })

  it('last month: remaining balance = $0.00', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    const last = schedule[schedule.length - 1]
    expect(last.remainingBalance.toNumber()).toBe(0)
  })

  it('sum of all principal payments = original principal', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    const totalPrincipal = schedule.reduce(
      (sum, entry) => sum.plus(entry.principal),
      new Decimal(0)
    )
    // Should equal original principal within 1 cent
    expect(totalPrincipal.minus(principal).abs().toNumber()).toBeLessThan(0.01)
  })

  it('all monthly payments are equal (except possibly last)', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    const regularPayment = schedule[0].payment
    // All except last should match
    for (let i = 1; i < schedule.length - 1; i++) {
      expect(schedule[i].payment.equals(regularPayment)).toBe(true)
    }
  })

  it('month 1 interest = principal * effective monthly rate', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    // Effective monthly rate for 5.5% semi-annual compounding
    const rm = new Decimal(5.5).div(100).div(2).plus(1).pow(new Decimal(1).div(6)).minus(1)
    const expectedInterest = principal.mul(rm)
    expect(
      schedule[0].interest.minus(expectedInterest).abs().toNumber()
    ).toBeLessThan(0.01)
  })

  it('works with 0% interest rate', () => {
    const schedule = generateAmortizationSchedule(
      new Decimal(120000),
      new Decimal(0),
      new Decimal(10)
    )
    expect(schedule).toHaveLength(120)
    expect(schedule[0].interest.toNumber()).toBe(0)
    expect(schedule[0].principal.toNumber()).toBe(1000) // 120000/120
    expect(schedule[schedule.length - 1].remainingBalance.toNumber()).toBe(0)
  })
})

describe('calculateYearlyMortgageSummary', () => {
  const principal = new Decimal(480000)
  const rate = new Decimal(5.5)
  const years = new Decimal(25)

  it('returns yearly aggregates with correct year count', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    const yearly = calculateYearlyMortgageSummary(schedule)
    expect(yearly).toHaveLength(25)
  })

  it('year 1: sum of months 1-12 for P&I split', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    const yearly = calculateYearlyMortgageSummary(schedule)

    // Sum the first 12 months manually
    let expectedPrincipal = new Decimal(0)
    let expectedInterest = new Decimal(0)
    let expectedPayment = new Decimal(0)
    for (let i = 0; i < 12; i++) {
      expectedPrincipal = expectedPrincipal.plus(schedule[i].principal)
      expectedInterest = expectedInterest.plus(schedule[i].interest)
      expectedPayment = expectedPayment.plus(schedule[i].payment)
    }

    expect(yearly[0].year).toBe(1)
    expect(yearly[0].totalPrincipal.minus(expectedPrincipal).abs().toNumber()).toBeLessThan(0.01)
    expect(yearly[0].totalInterest.minus(expectedInterest).abs().toNumber()).toBeLessThan(0.01)
    expect(yearly[0].totalPayment.minus(expectedPayment).abs().toNumber()).toBeLessThan(0.01)
  })

  it('year 25 (last): remaining balance = $0.00', () => {
    const schedule = generateAmortizationSchedule(principal, rate, years)
    const yearly = calculateYearlyMortgageSummary(schedule)
    const lastYear = yearly[yearly.length - 1]
    expect(lastYear.endBalance.toNumber()).toBe(0)
  })
})
