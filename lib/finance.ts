// Financial calculation engine for CFO Helper

import type { BaseInputs, Levers, KPIs, LiveDataState } from "./types"

const ELASTICITY = 0.5 // mock: +10% price -> +5% revenue
const BASE_PAYROLL_RATIO = 0.6 // 60% of base expenses considered payroll

/**
 * Core KPI calculation function
 * Computes all financial metrics based on base inputs and lever adjustments
 * Added optional live data integration
 */
export function computeKPIs(base: BaseInputs, lev: Levers, liveData?: LiveDataState): KPIs {
  const basePayroll = BASE_PAYROLL_RATIO * base.monthlyExpenses
  const newHirePayroll = lev.addHires * lev.costPerHire
  const payroll = basePayroll + newHirePayroll

  let adjustedRevenue = base.monthlyRevenue
  let adjustedExpenses = base.monthlyExpenses

  if (liveData && liveData.isConnected) {
    adjustedRevenue = base.monthlyRevenue * liveData.revenueMultiplier
    adjustedExpenses = base.monthlyExpenses + liveData.expensesDelta
  }

  // Apply price elasticity to revenue
  const revenuePrime = adjustedRevenue * (1 + lev.priceChangePct * ELASTICITY)

  // Total expenses including all deltas and live adjustments
  const expenses = adjustedExpenses + lev.deltaMarketing + lev.deltaInfra + newHirePayroll

  // Burn rate (positive = burning cash, negative = profitable)
  const burn = Math.max(expenses - revenuePrime, 0)

  // Runway calculation (avoid division by zero)
  const runwayMonths = base.cash / Math.max(burn, 1)

  // Gross profit calculation with partial new hire cost allocation
  const grossProfit = revenuePrime * base.grossMarginPct - (lev.deltaMarketing + lev.deltaInfra + newHirePayroll * 0.5)

  return {
    revenue: revenuePrime,
    expenses,
    payroll,
    burn,
    runwayMonths,
    grossProfit,
    liveRevenueAdjustment: liveData ? adjustedRevenue - base.monthlyRevenue : 0,
    liveExpensesAdjustment: liveData ? liveData.expensesDelta : 0,
    isLiveDataActive: liveData?.isConnected || false,
  }
}

/**
 * Project cash flow over 12 months
 * Returns array of cash balances for each month
 * Added live data support
 */
export function projectCash12(base: BaseInputs, kpis: KPIs, liveData?: LiveDataState): number[] {
  const months = 12
  const arr = new Array(months).fill(0)
  arr[0] = base.cash

  for (let i = 1; i < months; i++) {
    const netCashFlow = kpis.revenue - kpis.expenses
    arr[i] = Math.max(0, arr[i - 1] + netCashFlow)
  }

  return arr
}

/**
 * Generate narrative summary of financial impact
 * Added live data impact to narrative
 */
export function generateNarrative(
  baseBefore: BaseInputs,
  leversBefore: Levers,
  leversAfter: Levers,
  liveData?: LiveDataState,
): string {
  const kpisBefore = computeKPIs(baseBefore, leversBefore)
  const kpisAfter = computeKPIs(baseBefore, leversAfter, liveData)

  const hireDelta = leversAfter.addHires - leversBefore.addHires
  const marketingDelta = leversAfter.deltaMarketing - leversBefore.deltaMarketing
  const runwayChange = kpisAfter.runwayMonths - kpisBefore.runwayMonths

  let narrative = ""

  if (liveData && liveData.isConnected && liveData.updateCount > 0) {
    const revenueImpact = (liveData.revenueMultiplier - 1) * 100
    if (Math.abs(revenueImpact) > 1) {
      narrative += `Live data shows revenue ${revenueImpact > 0 ? "increased" : "decreased"} by ${Math.abs(revenueImpact).toFixed(1)}%. `
    }

    if (Math.abs(liveData.expensesDelta) > 1000) {
      narrative += `Expenses ${liveData.expensesDelta > 0 ? "increased" : "decreased"} by ${formatCompactCurrency(Math.abs(liveData.expensesDelta))} from live data. `
    }
  }

  if (hireDelta !== 0) {
    const payrollImpact = hireDelta * leversAfter.costPerHire
    narrative += `${hireDelta > 0 ? "Hiring" : "Reducing"} ${Math.abs(hireDelta)} ${Math.abs(hireDelta) === 1 ? "person" : "people"} ${hireDelta > 0 ? "adds" : "saves"} ${formatCompactCurrency(Math.abs(payrollImpact))}/mo in payroll. `
  }

  if (marketingDelta !== 0) {
    narrative += `Marketing spend ${marketingDelta > 0 ? "increases" : "decreases"} by ${formatCompactCurrency(Math.abs(marketingDelta))}/mo. `
  }

  narrative += `Cash runway changes from ${kpisBefore.runwayMonths.toFixed(1)} to ${kpisAfter.runwayMonths.toFixed(1)} months`

  if (runwayChange > 0) {
    narrative += ` (+${runwayChange.toFixed(1)} months).`
  } else if (runwayChange < 0) {
    narrative += ` (${runwayChange.toFixed(1)} months).`
  } else {
    narrative += " (no change)."
  }

  return narrative
}

/**
 * Format currency for Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format large numbers with K/L suffixes
 */
export function formatCompactCurrency(amount: number): string {
  if (amount >= 10000000) {
    // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`
  } else if (amount >= 100000) {
    // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`
  } else if (amount >= 1000) {
    // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`
  }
  return formatCurrency(amount)
}

// TODO: Persist scenarios to DB (future)
// TODO: Export PDF of scenario
// TODO: Flexprice billing events
// TODO: Pathway live data ingestion
