// Enhanced scenario management with named scenarios and history
import type { BaseInputs, Levers, KPIs } from "./types"

export interface SavedScenario {
  id: string
  name: string
  description?: string
  baseInputs: BaseInputs
  levers: Levers
  kpis: KPIs
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface ScenarioComparison {
  baseline: SavedScenario
  current: SavedScenario
  differences: {
    kpiChanges: Record<string, { baseline: number; current: number; change: number; changePercent: number }>
    leverChanges: Record<string, { baseline: number; current: number; change: number }>
  }
}

const SCENARIOS_KEY = "cfo_helper_scenarios"
const CURRENT_SCENARIO_KEY = "cfo_helper_current_scenario"

export class ScenarioManager {
  static getAllScenarios(): SavedScenario[] {
    try {
      const stored = localStorage.getItem(SCENARIOS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error loading scenarios:", error)
      return []
    }
  }

  static saveScenario(scenario: Omit<SavedScenario, "id" | "createdAt" | "updatedAt">): SavedScenario {
    const scenarios = this.getAllScenarios()
    const now = new Date().toISOString()

    const savedScenario: SavedScenario = {
      ...scenario,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: now,
      updatedAt: now,
    }

    scenarios.push(savedScenario)
    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))

    return savedScenario
  }

  static updateScenario(id: string, updates: Partial<SavedScenario>): SavedScenario | null {
    const scenarios = this.getAllScenarios()
    const index = scenarios.findIndex((s) => s.id === id)

    if (index === -1) return null

    scenarios[index] = {
      ...scenarios[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios))
    return scenarios[index]
  }

  static deleteScenario(id: string): boolean {
    const scenarios = this.getAllScenarios()
    const filtered = scenarios.filter((s) => s.id !== id)

    if (filtered.length === scenarios.length) return false

    localStorage.setItem(SCENARIOS_KEY, JSON.stringify(filtered))
    return true
  }

  static getScenario(id: string): SavedScenario | null {
    const scenarios = this.getAllScenarios()
    return scenarios.find((s) => s.id === id) || null
  }

  static saveCurrentScenario(baseInputs: BaseInputs, levers: Levers, kpis: KPIs): void {
    const currentScenario = {
      baseInputs,
      levers,
      kpis,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem(CURRENT_SCENARIO_KEY, JSON.stringify(currentScenario))
  }

  static getCurrentScenario(): { baseInputs: BaseInputs; levers: Levers; kpis: KPIs; timestamp: string } | null {
    try {
      const stored = localStorage.getItem(CURRENT_SCENARIO_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Error loading current scenario:", error)
      return null
    }
  }

  static compareScenarios(baseline: SavedScenario, current: SavedScenario): ScenarioComparison {
    const kpiChanges: Record<string, any> = {}
    const leverChanges: Record<string, any> = {}

    // Compare KPIs
    const kpiKeys = ["monthlyBurnRate", "cashRunwayMonths", "grossProfit", "monthlyRevenue"] as const
    kpiKeys.forEach((key) => {
      const baselineValue = baseline.kpis[key] as number
      const currentValue = current.kpis[key] as number
      const change = currentValue - baselineValue
      const changePercent = baselineValue !== 0 ? (change / baselineValue) * 100 : 0

      kpiChanges[key] = {
        baseline: baselineValue,
        current: currentValue,
        change,
        changePercent,
      }
    })

    // Compare Levers
    const leverKeys = Object.keys(baseline.levers) as (keyof Levers)[]
    leverKeys.forEach((key) => {
      const baselineValue = baseline.levers[key]
      const currentValue = current.levers[key]
      const change = currentValue - baselineValue

      leverChanges[key] = {
        baseline: baselineValue,
        current: currentValue,
        change,
      }
    })

    return {
      baseline,
      current,
      differences: {
        kpiChanges,
        leverChanges,
      },
    }
  }

  static getRecentScenarios(limit = 5): SavedScenario[] {
    return this.getAllScenarios()
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
  }

  static searchScenarios(query: string): SavedScenario[] {
    const scenarios = this.getAllScenarios()
    const lowercaseQuery = query.toLowerCase()

    return scenarios.filter(
      (scenario) =>
        scenario.name.toLowerCase().includes(lowercaseQuery) ||
        scenario.description?.toLowerCase().includes(lowercaseQuery) ||
        scenario.tags?.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
    )
  }

  static exportScenarios(): string {
    const scenarios = this.getAllScenarios()
    return JSON.stringify(scenarios, null, 2)
  }

  static importScenarios(jsonData: string): { success: boolean; imported: number; errors: string[] } {
    try {
      const importedScenarios = JSON.parse(jsonData) as SavedScenario[]
      const existingScenarios = this.getAllScenarios()
      const errors: string[] = []
      let imported = 0

      importedScenarios.forEach((scenario, index) => {
        try {
          // Validate scenario structure
          if (!scenario.name || !scenario.baseInputs || !scenario.levers || !scenario.kpis) {
            errors.push(`Scenario ${index + 1}: Missing required fields`)
            return
          }

          // Check for duplicates
          const exists = existingScenarios.some((existing) => existing.name === scenario.name)
          if (exists) {
            errors.push(`Scenario "${scenario.name}": Already exists`)
            return
          }

          // Add unique ID and timestamps
          const newScenario: SavedScenario = {
            ...scenario,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: scenario.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          existingScenarios.push(newScenario)
          imported++
        } catch (error) {
          errors.push(`Scenario ${index + 1}: ${error instanceof Error ? error.message : "Invalid format"}`)
        }
      })

      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(existingScenarios))

      return {
        success: imported > 0,
        imported,
        errors,
      }
    } catch (error) {
      return {
        success: false,
        imported: 0,
        errors: ["Invalid JSON format"],
      }
    }
  }
}
