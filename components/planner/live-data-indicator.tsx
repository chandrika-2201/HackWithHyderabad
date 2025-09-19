"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Activity, Wifi, WifiOff, TrendingUp, TrendingDown, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { PathwayData, subscribeToLiveData, triggerDataUpdate, type LiveDataState } from "@/lib/pathway"
import { formatCompactCurrency } from "@/lib/finance"
import { formatDistanceToNow } from "date-fns"

interface LiveDataIndicatorProps {
  onDataUpdate?: (liveData: LiveDataState) => void
}

export function LiveDataIndicator({ onDataUpdate }: LiveDataIndicatorProps) {
  const [liveData, setLiveData] = useState<LiveDataState>(() => PathwayData.getCurrentData())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToLiveData((data) => {
      setLiveData(data)
      onDataUpdate?.(data)
    })

    return unsubscribe
  }, [onDataUpdate])

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    triggerDataUpdate()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleToggleConnection = () => {
    if (liveData.isConnected) {
      PathwayData.disconnect()
    } else {
      PathwayData.connect()
    }
  }

  const handleResetData = () => {
    PathwayData.resetToBaseline()
  }

  const revenueChange = (liveData.revenueMultiplier - 1) * 100
  const hasSignificantChanges = Math.abs(revenueChange) > 1 || Math.abs(liveData.expensesDelta) > 1000

  return (
    <TooltipProvider>
      <Card
        className={`transition-all duration-300 ${liveData.isConnected ? "border-primary/50 bg-primary/5" : "border-muted"}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Live Data Feed
              {liveData.isConnected ? (
                <Badge variant="default" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  Disconnected
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleManualRefresh}
                    disabled={!liveData.isConnected || isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Trigger manual data update</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" onClick={handleToggleConnection}>
                    {liveData.isConnected ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{liveData.isConnected ? "Disconnect" : "Connect"} live data feed</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <CardDescription>Real-time financial data from Pathway integration</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {liveData.isConnected ? (
            <>
              {/* Data Impact Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Revenue Impact</span>
                    {Math.abs(revenueChange) > 1 &&
                      (revenueChange > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      ))}
                  </div>
                  <div className="text-lg font-semibold">
                    {revenueChange > 0 ? "+" : ""}
                    {revenueChange.toFixed(1)}%
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Expense Impact</span>
                    {Math.abs(liveData.expensesDelta) > 1000 &&
                      (liveData.expensesDelta > 0 ? (
                        <TrendingUp className="h-3 w-3 text-red-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-green-500" />
                      ))}
                  </div>
                  <div className="text-lg font-semibold">
                    {liveData.expensesDelta > 0 ? "+" : ""}
                    {formatCompactCurrency(liveData.expensesDelta)}
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-3 w-3" />
                  <span>Updates: {liveData.updateCount}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {hasSignificantChanges ? (
                    <>
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                      <span>Active changes</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Stable</span>
                    </>
                  )}
                </div>
              </div>

              {/* Last Update */}
              <div className="text-xs text-muted-foreground">
                Last update: {formatDistanceToNow(liveData.lastUpdate, { addSuffix: true })}
              </div>

              {/* Reset Button */}
              {hasSignificantChanges && (
                <Button variant="outline" size="sm" onClick={handleResetData} className="w-full bg-transparent">
                  Reset to Baseline
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <WifiOff className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">Live data feed is disconnected</p>
              <Button onClick={handleToggleConnection} size="sm">
                <Wifi className="mr-2 h-4 w-4" />
                Connect to Pathway
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
