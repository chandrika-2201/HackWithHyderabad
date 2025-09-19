// Flexprice billing integration for CFO Helper
// Tracks scenario simulations and report exports

export interface BillingEvent {
  eventType: "simulate_scenario" | "export_report"
  userId: string
  timestamp: number
  metadata?: {
    scenarioName?: string
    reportType?: string
    [key: string]: any
  }
}

export interface UsageStats {
  scenariosSimulated: number
  reportsExported: number
  lastUpdated: number
}

class FlexpriceService {
  private static instance: FlexpriceService
  private events: BillingEvent[] = []
  private usageStats: Map<string, UsageStats> = new Map()

  private constructor() {
    // Load existing data from localStorage
    this.loadFromStorage()
  }

  static getInstance(): FlexpriceService {
    if (!FlexpriceService.instance) {
      FlexpriceService.instance = new FlexpriceService()
    }
    return FlexpriceService.instance
  }

  /**
   * Track a scenario simulation event
   */
  trackScenarioSimulation(userId: string, scenarioName?: string): void {
    const event: BillingEvent = {
      eventType: "simulate_scenario",
      userId,
      timestamp: Date.now(),
      metadata: {
        scenarioName: scenarioName || "Unnamed Scenario",
      },
    }

    this.events.push(event)
    this.updateUsageStats(userId, "scenario")
    this.saveToStorage()

    console.log("[v0] Flexprice: Tracked scenario simulation", event)
  }

  /**
   * Track a report export event
   */
  trackReportExport(userId: string, reportType = "PDF"): void {
    const event: BillingEvent = {
      eventType: "export_report",
      userId,
      timestamp: Date.now(),
      metadata: {
        reportType,
      },
    }

    this.events.push(event)
    this.updateUsageStats(userId, "export")
    this.saveToStorage()

    console.log("[v0] Flexprice: Tracked report export", event)
  }

  /**
   * Get usage statistics for a user
   */
  getUserUsage(userId: string): UsageStats {
    return (
      this.usageStats.get(userId) || {
        scenariosSimulated: 0,
        reportsExported: 0,
        lastUpdated: Date.now(),
      }
    )
  }

  /**
   * Get all billing events for a user
   */
  getUserEvents(userId: string): BillingEvent[] {
    return this.events.filter((event) => event.userId === userId)
  }

  /**
   * Reset usage stats for a user (for testing or monthly resets)
   */
  resetUserUsage(userId: string): void {
    this.usageStats.set(userId, {
      scenariosSimulated: 0,
      reportsExported: 0,
      lastUpdated: Date.now(),
    })
    this.saveToStorage()
  }

  /**
   * Get total system-wide usage statistics
   */
  getTotalUsage(): { totalScenarios: number; totalExports: number; totalUsers: number } {
    const scenarioEvents = this.events.filter((e) => e.eventType === "simulate_scenario")
    const exportEvents = this.events.filter((e) => e.eventType === "export_report")
    const uniqueUsers = new Set(this.events.map((e) => e.userId))

    return {
      totalScenarios: scenarioEvents.length,
      totalExports: exportEvents.length,
      totalUsers: uniqueUsers.size,
    }
  }

  private updateUsageStats(userId: string, type: "scenario" | "export"): void {
    const current = this.getUserUsage(userId)

    if (type === "scenario") {
      current.scenariosSimulated++
    } else {
      current.reportsExported++
    }

    current.lastUpdated = Date.now()
    this.usageStats.set(userId, current)
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem("flexprice_events", JSON.stringify(this.events))
      localStorage.setItem("flexprice_usage", JSON.stringify(Array.from(this.usageStats.entries())))
    } catch (error) {
      console.error("[v0] Flexprice: Failed to save to storage", error)
    }
  }

  private loadFromStorage(): void {
    try {
      const eventsData = localStorage.getItem("flexprice_events")
      if (eventsData) {
        this.events = JSON.parse(eventsData)
      }

      const usageData = localStorage.getItem("flexprice_usage")
      if (usageData) {
        const entries = JSON.parse(usageData)
        this.usageStats = new Map(entries)
      }
    } catch (error) {
      console.error("[v0] Flexprice: Failed to load from storage", error)
    }
  }
}

// Export singleton instance
export const FlexpriceTracker = FlexpriceService.getInstance()

// Utility functions for easy integration
export function trackScenarioSave(userId: string, scenarioName?: string): void {
  FlexpriceTracker.trackScenarioSimulation(userId, scenarioName)
}

export function trackReportExport(userId: string, reportType?: string): void {
  FlexpriceTracker.trackReportExport(userId, reportType)
}

export function getUserUsageStats(userId: string): UsageStats {
  return FlexpriceTracker.getUserUsage(userId)
}
