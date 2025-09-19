"use client"

import { useState, useEffect, useCallback } from "react"
import { subscribeToLiveData, type LiveDataState } from "@/lib/pathway"

export function useLiveData() {
  const [liveData, setLiveData] = useState<LiveDataState | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToLiveData((data) => {
      setLiveData(data)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  const refreshData = useCallback(() => {
    // Trigger a manual refresh if needed
    // This could call PathwayData.triggerUpdate() if we want manual refresh capability
  }, [])

  return {
    liveData,
    isLoading,
    isConnected: liveData?.isConnected || false,
    refreshData,
  }
}
