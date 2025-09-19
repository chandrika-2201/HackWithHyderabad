"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { FooterDisclaimer } from "@/components/footer-disclaimer"
import { PlannerForm } from "@/components/planner/planner-form"
import { KpiCards } from "@/components/planner/kpi-cards"
import { SummaryNarrative } from "@/components/planner/summary-narrative"
import { CashProjectionChart } from "@/components/charts/cash-projection-chart"
import { RevenueVsBurnChart } from "@/components/charts/revenue-vs-burn-chart"
import { ExportButton } from "@/components/planner/export-button"
import { UsageCounter } from "@/components/planner/usage-counter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { BaseInputs, Levers } from "@/lib/types"
import { DEFAULT_BASE, DEFAULT_LEVERS } from "@/lib/mock"
import { computeKPIs } from "@/lib/finance"
import { useAuth } from "@/lib/auth"
import { ScenarioManager } from "@/lib/scenario-manager"
import { LogIn, UserPlus, Zap, Shield } from "lucide-react"
import { QuickSaveIndicator } from "@/components/planner/quick-save-indicator"

export default function PlannerPage() {
  const [baseInputs, setBaseInputs] = useState<BaseInputs>(DEFAULT_BASE)
  const [levers, setLevers] = useState<Levers>(DEFAULT_LEVERS)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const kpis = useMemo(() => computeKPIs(baseInputs, levers), [baseInputs, levers])

  useEffect(() => {
    if (user) {
      ScenarioManager.saveCurrentScenario(baseInputs, levers, kpis)
    }
  }, [baseInputs, levers, kpis, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <TopNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground animate-pulse">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <TopNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center py-12 backdrop-blur-sm bg-white/80 border-white/20 shadow-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-primary to-blue-600 shadow-lg animate-in zoom-in-0 duration-500 delay-200">
                    <Shield className="h-16 w-16 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-300">
                  Sign In Required
                </CardTitle>
                <CardDescription className="text-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-400">
                  Please sign in to access the Financial Scenario Planner and save your work.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {[
                      {
                        icon: Zap,
                        title: "Real-time Planning",
                        desc: "Interactive financial scenario modeling with instant results",
                      },
                      {
                        icon: Shield,
                        title: "Save Scenarios",
                        desc: "Name and organize your financial scenarios for future reference",
                      },
                      {
                        icon: LogIn,
                        title: "Export Reports",
                        desc: "Generate professional PDF reports with charts and analysis",
                      },
                    ].map((item, index) => (
                      <div
                        key={item.title}
                        className={`flex flex-col items-center p-4 border rounded-lg bg-gradient-to-br from-white to-slate-50 hover:shadow-md transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-2 duration-500`}
                        style={{ animationDelay: `${500 + index * 100}ms` }}
                      >
                        <div className="p-2 rounded-full bg-gradient-to-br from-primary/10 to-blue-100 mb-2">
                          <item.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        <p className="text-muted-foreground text-center">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-700">
                    <Button
                      size="lg"
                      onClick={() => router.push("/auth/signup")}
                      className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Free Account
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => router.push("/auth/login")}
                      className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-300 hover:scale-105"
                    >
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground animate-in fade-in-0 duration-500 delay-800">
                    <Badge variant="secondary" className="mr-2 bg-gradient-to-r from-slate-100 to-blue-100">
                      Free Plan
                    </Badge>
                    10 scenario exports per month • Unlimited planning sessions
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <FooterDisclaimer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <TopNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-balance bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Financial Scenario Planner
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {user.name}! Your scenarios are automatically saved.
                  </p>
                  <QuickSaveIndicator />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {user.usageCount}/{user.maxUsage} exports used
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user.maxUsage - user.usageCount} remaining this month
                  </div>
                </div>
                <ExportButton
                  baseInputs={baseInputs}
                  levers={levers}
                  kpis={kpis}
                  scenarioName="Current Scenario"
                  variant="default"
                />
              </div>
            </div>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              Adjust your financial parameters and see the impact on cash runway, burn rate, and profitability in
              real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Input Controls */}
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-200">
              <PlannerForm
                baseInputs={baseInputs}
                levers={levers}
                kpis={kpis}
                onBaseInputsChange={setBaseInputs}
                onLeversChange={setLevers}
              />
            </div>

            {/* Right Panel - KPIs and Charts */}
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-300">
              <UsageCounter />

              {/* KPI Cards */}
              <KpiCards baseInputs={baseInputs} levers={levers} />

              {/* Summary Narrative */}
              <SummaryNarrative baseInputs={baseInputs} levers={levers} />

              {/* Charts */}
              <div
                id="cash-projection-chart"
                className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500"
              >
                <CashProjectionChart baseInputs={baseInputs} kpis={kpis} />
              </div>

              <div
                id="revenue-vs-burn-chart"
                className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-600"
              >
                <RevenueVsBurnChart baseInputs={baseInputs} levers={levers} kpis={kpis} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterDisclaimer />
    </div>
  )
}
