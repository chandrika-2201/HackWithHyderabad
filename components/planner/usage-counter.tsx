"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, FileText, TrendingUp, Clock } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { formatDistanceToNow } from "date-fns"
import { FlexpriceTracker } from "@/lib/flexprice"

export function UsageCounter() {
  const { user } = useAuth()

  if (!user) return null

  const scenarioProgress = (user.scenariosSimulated / 50) * 100 // Assume 50 scenarios per month limit
  const exportProgress = (user.reportsExported / user.maxUsage) * 100

  const totalUsage = FlexpriceTracker.getTotalUsage()
  const userEvents = FlexpriceTracker.getUserEvents(user.id)
  const lastActivity = userEvents.length > 0 ? Math.max(...userEvents.map((e) => e.timestamp)) : Date.now()

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <BarChart3 className="h-5 w-5" />
          Usage Statistics
        </CardTitle>
        <CardDescription>Track your scenario simulations and report exports</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Scenario Simulations */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Scenarios Simulated</span>
            </div>
            <Badge variant="secondary">{user.scenariosSimulated} total</Badge>
          </div>
          <Progress value={Math.min(scenarioProgress, 100)} className="h-2" />
          <p className="text-xs text-muted-foreground">{user.scenariosSimulated} scenarios created this month</p>
        </div>

        {/* Report Exports */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Reports Exported</span>
            </div>
            <Badge variant={user.reportsExported >= user.maxUsage ? "destructive" : "secondary"}>
              {user.reportsExported}/{user.maxUsage}
            </Badge>
          </div>
          <Progress value={exportProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {user.maxUsage - user.reportsExported} exports remaining this month
          </p>
        </div>

        {/* Activity Summary */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Last Activity</span>
              </div>
              <p className="font-medium">{formatDistanceToNow(lastActivity, { addSuffix: true })}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                <BarChart3 className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">Plan</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {user.plan.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Billing Events Summary */}
        <div className="pt-2 text-xs text-muted-foreground">
          <p>Billing events tracked: {userEvents.length} total</p>
          <p>
            System-wide: {totalUsage.totalScenarios} scenarios, {totalUsage.totalExports} exports
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
