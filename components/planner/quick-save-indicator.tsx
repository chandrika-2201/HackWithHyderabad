"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from "lucide-react"
import { loadCurrentScenario } from "@/lib/storage"

export function QuickSaveIndicator() {
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    // Check for existing saved scenario on mount
    const saved = loadCurrentScenario()
    if (saved) {
      setLastSaved(new Date(saved.timestamp))
    }

    // Listen for storage changes to update indicator
    const handleStorageChange = () => {
      const saved = loadCurrentScenario()
      if (saved) {
        setLastSaved(new Date(saved.timestamp))
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  if (!lastSaved) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        No saves yet
      </Badge>
    )
  }

  const timeAgo = getTimeAgo(lastSaved)

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <CheckCircle className="h-3 w-3 text-green-600" />
      Saved {timeAgo}
    </Badge>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}
