"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react"
import type { BaseInputs, Levers } from "@/lib/types"
import { generateNarrative, computeKPIs } from "@/lib/finance"
import { DEFAULT_LEVERS } from "@/lib/mock"

interface SummaryNarrativeProps {
  baseInputs: BaseInputs
  levers: Levers
}

export function SummaryNarrative({ baseInputs, levers }: SummaryNarrativeProps) {
  const narrative = generateNarrative(baseInputs, DEFAULT_LEVERS, levers)
  const currentKPIs = computeKPIs(baseInputs, levers)
  const baselineKPIs = computeKPIs(baseInputs, DEFAULT_LEVERS)

  // Determine overall impact
  const runwayChange = currentKPIs.runwayMonths - baselineKPIs.runwayMonths
  const profitChange = currentKPIs.grossProfit - baselineKPIs.grossProfit

  let overallImpact: "positive" | "negative" | "neutral" = "neutral"
  if (runwayChange > 0.5 || profitChange > 10000) {
    overallImpact = "positive"
  } else if (runwayChange < -0.5 || profitChange < -10000) {
    overallImpact = "negative"
  }

  const impactConfig = {
    positive: {
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-100",
      badge: "Positive Impact",
      badgeVariant: "default" as const,
      badgeGradient: "bg-gradient-to-r from-green-500 to-emerald-500",
    },
    negative: {
      icon: TrendingDown,
      color: "text-red-600",
      bgColor: "bg-gradient-to-br from-red-50 to-rose-100",
      badge: "Negative Impact",
      badgeVariant: "destructive" as const,
      badgeGradient: "bg-gradient-to-r from-red-500 to-rose-500",
    },
    neutral: {
      icon: MessageSquare,
      color: "text-slate-600",
      bgColor: "bg-gradient-to-br from-slate-50 to-blue-100",
      badge: "Neutral Impact",
      badgeVariant: "secondary" as const,
      badgeGradient: "bg-gradient-to-r from-slate-500 to-blue-500",
    },
  }

  const config = impactConfig[overallImpact]
  const IconComponent = config.icon

  // Risk assessment
  const isHighRisk = currentKPIs.runwayMonths < 3
  const isMediumRisk = currentKPIs.runwayMonths < 6 && currentKPIs.runwayMonths >= 3

  return (
    <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-sm">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          Impact Summary
        </CardTitle>
        <CardDescription>Plain language explanation of your financial scenario changes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main narrative */}
        <div
          className={`p-4 rounded-lg ${config.bgColor} border border-white/20 shadow-sm transition-all duration-300 hover:shadow-md`}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-full bg-white/50 shadow-sm`}>
              <IconComponent className={`h-5 w-5 mt-0.5 ${config.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-sm leading-relaxed text-slate-700">{narrative}</p>
            </div>
          </div>
        </div>

        {/* Impact badges */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={config.badgeVariant}
            className={`${config.badgeGradient} text-white border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105`}
          >
            {config.badge}
          </Badge>
          {isHighRisk && (
            <Badge
              variant="destructive"
              className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 transition-all duration-300 hover:scale-105"
            >
              <AlertTriangle className="h-3 w-3" />
              High Risk
            </Badge>
          )}
          {isMediumRisk && (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-orange-300 text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-yellow-50 transition-all duration-300 hover:scale-105"
            >
              <AlertTriangle className="h-3 w-3" />
              Medium Risk
            </Badge>
          )}
          {currentKPIs.grossProfit < 0 && (
            <Badge
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 transition-all duration-300 hover:scale-105"
            >
              Unprofitable
            </Badge>
          )}
          {currentKPIs.burn === 0 && (
            <Badge
              variant="default"
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105"
            >
              Cash Positive
            </Badge>
          )}
        </div>

        {/* Key insights */}
        <div className="space-y-2 text-sm text-muted-foreground">
          {levers.addHires > 0 && (
            <p className="flex items-start gap-2 p-2 rounded bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 transition-all duration-300 hover:shadow-sm">
              <span className="text-blue-500 font-bold">•</span>
              Adding {levers.addHires} {levers.addHires === 1 ? "hire" : "hires"} increases monthly expenses by ₹
              {(levers.addHires * levers.costPerHire).toLocaleString("en-IN")}
            </p>
          )}
          {levers.deltaMarketing !== 0 && (
            <p className="flex items-start gap-2 p-2 rounded bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 transition-all duration-300 hover:shadow-sm">
              <span className="text-purple-500 font-bold">•</span>
              Marketing spend {levers.deltaMarketing > 0 ? "increase" : "reduction"} of ₹
              {Math.abs(levers.deltaMarketing).toLocaleString("en-IN")} per month
            </p>
          )}
          {levers.priceChangePct !== 0 && (
            <p className="flex items-start gap-2 p-2 rounded bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 transition-all duration-300 hover:shadow-sm">
              <span className="text-green-500 font-bold">•</span>
              Price change of {(levers.priceChangePct * 100).toFixed(0)}% affects revenue by{" "}
              {(levers.priceChangePct * 50).toFixed(1)}% (elasticity applied)
            </p>
          )}
          {currentKPIs.runwayMonths < 6 && (
            <p className="flex items-start gap-2 p-2 rounded bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 font-medium transition-all duration-300 hover:shadow-sm">
              <span className="text-red-500 font-bold">⚠️</span>
              Consider reducing expenses or increasing revenue to extend runway
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
