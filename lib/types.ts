// Core types for CFO Helper financial modeling

export type BaseInputs = {
  cash: number // ₹
  monthlyRevenue: number // ₹
  monthlyExpenses: number // ₹ (excl. new deltas)
  teamSize: number
  grossMarginPct: number // 0..1
}

export type Levers = {
  addHires: number // int
  costPerHire: number // ₹/month
  deltaMarketing: number // ₹/month (+/-)
  deltaInfra: number // ₹/month (+/-)
  priceChangePct: number // e.g., +0.10 for +10%
}

export type KPIs = {
  revenue: number
  expenses: number
  payroll: number
  burn: number
  runwayMonths: number
  grossProfit: number
  // New fields for live data
  liveRevenueAdjustment?: number
  liveExpensesAdjustment?: number
  isLiveDataActive?: boolean
}

export type Scenario = {
  base: BaseInputs
  levers: Levers
  timestamp: number
  name?: string
}

export type UsageCounter = {
  scenariosSimulated: number
  reportsExported: number
  lastUpdated: number
}

export type LiveDataState = {
  revenueMultiplier: number
  expensesDelta: number
  lastUpdate: number
  isConnected: boolean
  updateCount: number
}
