// Default values and mock data for CFO Helper

import type { BaseInputs, Levers } from "./types"

export const DEFAULT_BASE: BaseInputs = {
  cash: 1000000, // ₹10,00,000
  monthlyRevenue: 350000, // ₹3.5L
  monthlyExpenses: 300000, // ₹3L
  teamSize: 6,
  grossMarginPct: 0.65,
}

export const DEFAULT_LEVERS: Levers = {
  addHires: 0,
  costPerHire: 50000,
  deltaMarketing: 0,
  deltaInfra: 0,
  priceChangePct: 0,
}

// Predefined scenarios for quick testing
export const PRESET_SCENARIOS = {
  "Aggressive Growth": {
    addHires: 3,
    costPerHire: 60000,
    deltaMarketing: 100000,
    deltaInfra: 25000,
    priceChangePct: 0.15,
  },
  "Lean Mode": {
    addHires: 0,
    costPerHire: 45000,
    deltaMarketing: -20000,
    deltaInfra: -10000,
    priceChangePct: -0.05,
  },
  Conservative: {
    addHires: 1,
    costPerHire: 50000,
    deltaMarketing: 25000,
    deltaInfra: 5000,
    priceChangePct: 0.05,
  },
} as const
