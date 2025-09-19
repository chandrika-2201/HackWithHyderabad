// Local storage utilities for CFO Helper scenarios

import type { Scenario } from "./types"

const STORAGE_KEY = "cfo-helper-scenarios"
const CURRENT_SCENARIO_KEY = "cfo-helper-current"

/**
 * Save scenario to localStorage
 */
export function saveScenario(scenario: Scenario): void {
  try {
    const scenarios = getStoredScenarios()
    const newScenario = {
      ...scenario,
      timestamp: Date.now(),
    }

    scenarios.unshift(newScenario)

    // Keep only last 10 scenarios
    const trimmed = scenarios.slice(0, 10)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
    localStorage.setItem(CURRENT_SCENARIO_KEY, JSON.stringify(newScenario))
  } catch (error) {
    console.warn("Failed to save scenario to localStorage:", error)
  }
}

/**
 * Load current scenario from localStorage
 */
export function loadCurrentScenario(): Scenario | null {
  try {
    const stored = localStorage.getItem(CURRENT_SCENARIO_KEY)
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.warn("Failed to load current scenario from localStorage:", error)
    return null
  }
}

/**
 * Get all stored scenarios
 */
export function getStoredScenarios(): Scenario[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.warn("Failed to load scenarios from localStorage:", error)
    return []
  }
}

/**
 * Clear all stored scenarios
 */
export function clearStoredScenarios(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(CURRENT_SCENARIO_KEY)
  } catch (error) {
    console.warn("Failed to clear scenarios from localStorage:", error)
  }
}
