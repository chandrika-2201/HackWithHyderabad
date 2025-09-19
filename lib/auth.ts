"use client"

// Mock authentication system using localStorage
import { FlexpriceTracker, getUserUsageStats } from "./flexprice"

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  plan: "free" | "pro"
  usageCount: number
  maxUsage: number
  scenariosSimulated: number
  reportsExported: number
}

export interface AuthState {
  user: User | null
  isLoading: boolean
}

const STORAGE_KEY = "cfo_helper_auth"
const USAGE_KEY = "cfo_helper_usage"

export class MockAuth {
  private static instance: MockAuth
  private listeners: ((state: AuthState) => void)[] = []
  private state: AuthState = { user: null, isLoading: false }

  static getInstance(): MockAuth {
    if (!MockAuth.instance) {
      MockAuth.instance = new MockAuth()
    }
    return MockAuth.instance
  }

  constructor() {
    this.loadUser()
  }

  private loadUser() {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const user = JSON.parse(stored)
        this.syncFlexpriceUsage(user)
        this.state.user = user
        this.notifyListeners()
      } catch (error) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  private syncFlexpriceUsage(user: User) {
    const flexpriceStats = getUserUsageStats(user.id)
    user.scenariosSimulated = flexpriceStats.scenariosSimulated
    user.reportsExported = flexpriceStats.reportsExported
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.state))
  }

  subscribe(listener: (state: AuthState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  getState(): AuthState {
    return this.state
  }

  async signUp(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true
    this.notifyListeners()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUsers = this.getStoredUsers()
    if (existingUsers.some((u) => u.email === email)) {
      this.state.isLoading = false
      this.notifyListeners()
      return { success: false, error: "User already exists" }
    }

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      createdAt: new Date().toISOString(),
      plan: "free",
      usageCount: 0,
      maxUsage: 10,
      scenariosSimulated: 0,
      reportsExported: 0,
    }

    // Store user
    existingUsers.push(user)
    localStorage.setItem("cfo_helper_users", JSON.stringify(existingUsers))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))

    this.state.user = user
    this.state.isLoading = false
    this.notifyListeners()

    return { success: true }
  }

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    this.state.isLoading = true
    this.notifyListeners()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const existingUsers = this.getStoredUsers()
    const user = existingUsers.find((u) => u.email === email)

    if (!user) {
      this.state.isLoading = false
      this.notifyListeners()
      return { success: false, error: "User not found" }
    }

    this.syncFlexpriceUsage(user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    this.state.user = user
    this.state.isLoading = false
    this.notifyListeners()

    return { success: true }
  }

  async signOut(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY)
    this.state.user = null
    this.notifyListeners()
  }

  incrementUsage(): void {
    if (this.state.user) {
      this.state.user.usageCount += 1
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.user))

      // Update in users list too
      const existingUsers = this.getStoredUsers()
      const userIndex = existingUsers.findIndex((u) => u.id === this.state.user!.id)
      if (userIndex !== -1) {
        existingUsers[userIndex] = this.state.user
        localStorage.setItem("cfo_helper_users", JSON.stringify(existingUsers))
      }

      this.notifyListeners()
    }
  }

  trackScenarioSimulation(scenarioName?: string): void {
    if (this.state.user) {
      FlexpriceTracker.trackScenarioSimulation(this.state.user.id, scenarioName)
      this.syncFlexpriceUsage(this.state.user)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.user))
      this.notifyListeners()
    }
  }

  trackReportExport(reportType?: string): void {
    if (this.state.user) {
      FlexpriceTracker.trackReportExport(this.state.user.id, reportType)
      this.syncFlexpriceUsage(this.state.user)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state.user))
      this.notifyListeners()
    }
  }

  private getStoredUsers(): User[] {
    const stored = localStorage.getItem("cfo_helper_users")
    return stored ? JSON.parse(stored) : []
  }
}

// React hook for using auth
import { useState, useEffect } from "react"

export function useAuth(): AuthState & {
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
  incrementUsage: () => void
  trackScenarioSimulation: (scenarioName?: string) => void
  trackReportExport: (reportType?: string) => void
} {
  const [state, setState] = useState<AuthState>(() => MockAuth.getInstance().getState())

  useEffect(() => {
    const auth = MockAuth.getInstance()
    const unsubscribe = auth.subscribe(setState)
    return unsubscribe
  }, [])

  const auth = MockAuth.getInstance()

  return {
    ...state,
    signUp: auth.signUp.bind(auth),
    signIn: auth.signIn.bind(auth),
    signOut: auth.signOut.bind(auth),
    incrementUsage: auth.incrementUsage.bind(auth),
    trackScenarioSimulation: auth.trackScenarioSimulation.bind(auth),
    trackReportExport: auth.trackReportExport.bind(auth),
  }
}
