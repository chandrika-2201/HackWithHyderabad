// Pathway integration for live financial data updates
// Simulates real-time data feeds for expenses and revenue

export interface PathwayDataUpdate {
  type: "revenue" | "expenses" | "market_data"
  value: number
  timestamp: number
  source: string
  confidence: number // 0-1 scale
}

export interface LiveDataState {
  revenueMultiplier: number // Applied to base revenue
  expensesDelta: number // Added to base expenses
  lastUpdate: number
  isConnected: boolean
  updateCount: number
}

class PathwayService {
  private static instance: PathwayService
  private liveData: LiveDataState = {
    revenueMultiplier: 1.0,
    expensesDelta: 0,
    lastUpdate: Date.now(),
    isConnected: false,
    updateCount: 0,
  }
  private subscribers: Array<(data: LiveDataState) => void> = []
  private updateInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.startMockDataFeed()
  }

  static getInstance(): PathwayService {
    if (!PathwayService.instance) {
      PathwayService.instance = new PathwayService()
    }
    return PathwayService.instance
  }

  /**
   * Subscribe to live data updates
   */
  subscribe(callback: (data: LiveDataState) => void): () => void {
    this.subscribers.push(callback)

    // Immediately send current state
    callback(this.liveData)

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  /**
   * Get current live data state
   */
  getCurrentData(): LiveDataState {
    return { ...this.liveData }
  }

  /**
   * Manually trigger a data update (for testing)
   */
  triggerUpdate(): void {
    this.generateMockUpdate()
  }

  /**
   * Connect to Pathway data feed
   */
  connect(): void {
    this.liveData.isConnected = true
    this.notifySubscribers()
    console.log("[v0] Pathway: Connected to live data feed")
  }

  /**
   * Disconnect from Pathway data feed
   */
  disconnect(): void {
    this.liveData.isConnected = false
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
    this.notifySubscribers()
    console.log("[v0] Pathway: Disconnected from live data feed")
  }

  /**
   * Reset data to baseline
   */
  resetToBaseline(): void {
    this.liveData = {
      revenueMultiplier: 1.0,
      expensesDelta: 0,
      lastUpdate: Date.now(),
      isConnected: this.liveData.isConnected,
      updateCount: 0,
    }
    this.notifySubscribers()
  }

  private startMockDataFeed(): void {
    // Connect automatically
    this.connect()

    // Generate updates every 15-30 seconds
    this.updateInterval = setInterval(
      () => {
        if (this.liveData.isConnected) {
          this.generateMockUpdate()
        }
      },
      15000 + Math.random() * 15000,
    ) // 15-30 seconds
  }

  private generateMockUpdate(): void {
    const updateTypes = ["revenue", "expenses", "market_data"] as const
    const updateType = updateTypes[Math.floor(Math.random() * updateTypes.length)]

    // Generate realistic but noticeable changes
    switch (updateType) {
      case "revenue":
        // Revenue changes: -5% to +8%
        const revenueChange = (Math.random() - 0.4) * 0.13 // Slightly positive bias
        this.liveData.revenueMultiplier = Math.max(0.8, Math.min(1.2, this.liveData.revenueMultiplier + revenueChange))
        break

      case "expenses":
        // Expense changes: -₹10K to +₹25K
        const expenseChange = (Math.random() - 0.3) * 35000 // Slightly positive bias
        this.liveData.expensesDelta = Math.max(-50000, Math.min(100000, this.liveData.expensesDelta + expenseChange))
        break

      case "market_data":
        // Market-driven changes affect both
        const marketImpact = (Math.random() - 0.5) * 0.06
        this.liveData.revenueMultiplier = Math.max(0.8, Math.min(1.2, this.liveData.revenueMultiplier + marketImpact))
        break
    }

    this.liveData.lastUpdate = Date.now()
    this.liveData.updateCount++

    console.log(`[v0] Pathway: Generated ${updateType} update`, {
      revenueMultiplier: this.liveData.revenueMultiplier.toFixed(3),
      expensesDelta: this.liveData.expensesDelta,
      updateCount: this.liveData.updateCount,
    })

    this.notifySubscribers()
  }

  private notifySubscribers(): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(this.liveData)
      } catch (error) {
        console.error("[v0] Pathway: Error notifying subscriber", error)
      }
    })
  }
}

// Export singleton instance
export const PathwayData = PathwayService.getInstance()

// Utility functions for easy integration
export function subscribeToLiveData(callback: (data: LiveDataState) => void): () => void {
  return PathwayData.subscribe(callback)
}

export function getCurrentLiveData(): LiveDataState {
  return PathwayData.getCurrentData()
}

export function triggerDataUpdate(): void {
  PathwayData.triggerUpdate()
}
