"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Info, RotateCcw, Save, Upload, Users, DollarSign, TrendingUp, Settings } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BaseInputs, Levers, KPIs } from "@/lib/types"
import { DEFAULT_BASE, DEFAULT_LEVERS, PRESET_SCENARIOS } from "@/lib/mock"
import { formatCurrency, formatCompactCurrency } from "@/lib/finance"
import { saveScenario, loadCurrentScenario } from "@/lib/storage"
import { ScenarioManagerComponent } from "./scenario-manager"

interface PlannerFormProps {
  baseInputs: BaseInputs
  levers: Levers
  kpis: KPIs
  onBaseInputsChange: (inputs: BaseInputs) => void
  onLeversChange: (levers: Levers) => void
}

export function PlannerForm({ baseInputs, levers, kpis, onBaseInputsChange, onLeversChange }: PlannerFormProps) {
  const { toast } = useToast()
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Debounced update handlers
  const debouncedBaseUpdate = useCallback(
    debounce((newInputs: BaseInputs) => onBaseInputsChange(newInputs), 150),
    [onBaseInputsChange],
  )

  const debouncedLeversUpdate = useCallback(
    debounce((newLevers: Levers) => onLeversChange(newLevers), 150),
    [onLeversChange],
  )

  const handleBaseInputChange = (field: keyof BaseInputs, value: number) => {
    const newInputs = { ...baseInputs, [field]: value }
    debouncedBaseUpdate(newInputs)
  }

  const handleLeverChange = (field: keyof Levers, value: number) => {
    const newLevers = { ...levers, [field]: value }
    debouncedLeversUpdate(newLevers)
  }

  const handlePresetScenario = (scenarioName: keyof typeof PRESET_SCENARIOS) => {
    const preset = PRESET_SCENARIOS[scenarioName]
    onLeversChange(preset)
    toast({
      title: "Scenario Applied",
      description: `Loaded ${scenarioName} scenario settings.`,
    })
  }

  const handleReset = () => {
    onBaseInputsChange(DEFAULT_BASE)
    onLeversChange(DEFAULT_LEVERS)
    toast({
      title: "Reset Complete",
      description: "All values restored to defaults.",
    })
  }

  const handleSave = () => {
    const scenarioName = `Quick Save - ${new Date().toLocaleString()}`
    saveScenario({
      base: baseInputs,
      levers,
      timestamp: Date.now(),
      name: scenarioName,
    })
    toast({
      title: "✅ Quick Save Complete",
      description: `Scenario saved as "${scenarioName}"`,
    })
  }

  const handleLoad = () => {
    const saved = loadCurrentScenario()
    if (saved) {
      onBaseInputsChange(saved.base)
      onLeversChange(saved.levers)
      toast({
        title: "✅ Quick Load Complete",
        description: `Restored scenario from ${new Date(saved.timestamp).toLocaleString()}`,
      })
    } else {
      toast({
        title: "❌ No Saved Scenario",
        description: "Use Quick Save first to save your current scenario.",
        variant: "destructive",
      })
    }
  }

  const handleLoadScenario = (newBaseInputs: BaseInputs, newLevers: Levers) => {
    onBaseInputsChange(newBaseInputs)
    onLeversChange(newLevers)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Scenario Management
            </CardTitle>
            <CardDescription>Save, load, and manage your financial scenarios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Enhanced Scenario Manager */}
              <div className="flex flex-wrap gap-2">
                <ScenarioManagerComponent
                  baseInputs={baseInputs}
                  levers={levers}
                  kpis={kpis}
                  onLoadScenario={handleLoadScenario}
                />
              </div>

              {/* Quick Preset Scenarios */}
              <div>
                <Label className="text-sm font-medium mb-2 block">Quick Presets</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(PRESET_SCENARIOS).map((scenario) => (
                    <Button
                      key={scenario}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetScenario(scenario as keyof typeof PRESET_SCENARIOS)}
                      className="text-sm"
                    >
                      {scenario}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Base Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Base Financial Inputs
            </CardTitle>
            <CardDescription>Your current financial position and monthly metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="cash">Cash on Hand</Label>
                <Input
                  id="cash"
                  type="number"
                  value={baseInputs.cash}
                  onChange={(e) => handleBaseInputChange("cash", Number(e.target.value))}
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground">{formatCurrency(baseInputs.cash)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Monthly Revenue</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={baseInputs.monthlyRevenue}
                  onChange={(e) => handleBaseInputChange("monthlyRevenue", Number(e.target.value))}
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground">{formatCurrency(baseInputs.monthlyRevenue)}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenses">Monthly Expenses</Label>
                <Input
                  id="expenses"
                  type="number"
                  value={baseInputs.monthlyExpenses}
                  onChange={(e) => handleBaseInputChange("monthlyExpenses", Number(e.target.value))}
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(baseInputs.monthlyExpenses)} (excluding new hires)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Current Team Size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  value={baseInputs.teamSize}
                  onChange={(e) => handleBaseInputChange("teamSize", Number(e.target.value))}
                  className="text-right"
                />
                <p className="text-xs text-muted-foreground">
                  {baseInputs.teamSize} {baseInputs.teamSize === 1 ? "person" : "people"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="grossMargin">Gross Margin</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of revenue after direct costs</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="px-3">
                <Slider
                  value={[baseInputs.grossMarginPct * 100]}
                  onValueChange={([value]) => handleBaseInputChange("grossMarginPct", value / 100)}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <Badge variant="secondary">{(baseInputs.grossMarginPct * 100).toFixed(0)}%</Badge>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Levers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Financial Levers
            </CardTitle>
            <CardDescription>Adjust these parameters to see the impact on your finances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hiring */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <Label>Team Expansion</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addHires">Additional Hires</Label>
                  <div className="px-3">
                    <Slider
                      value={[levers.addHires]}
                      onValueChange={([value]) => handleLeverChange("addHires", value)}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <Badge variant="secondary">
                      {levers.addHires} {levers.addHires === 1 ? "hire" : "hires"}
                    </Badge>
                    <span>10</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costPerHire">Cost per Hire (Monthly)</Label>
                  <Input
                    id="costPerHire"
                    type="number"
                    value={levers.costPerHire}
                    onChange={(e) => handleLeverChange("costPerHire", Number(e.target.value))}
                    className="text-right"
                  />
                  <p className="text-xs text-muted-foreground">{formatCompactCurrency(levers.costPerHire)}/month</p>
                </div>
              </div>
            </div>

            {/* Marketing & Infrastructure */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="marketing">Marketing Spend Change</Label>
                <div className="px-3">
                  <Slider
                    value={[levers.deltaMarketing]}
                    onValueChange={([value]) => handleLeverChange("deltaMarketing", value)}
                    max={500000}
                    min={-50000}
                    step={5000}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-₹50K</span>
                  <Badge variant={levers.deltaMarketing >= 0 ? "default" : "destructive"}>
                    {levers.deltaMarketing >= 0 ? "+" : ""}
                    {formatCompactCurrency(levers.deltaMarketing)}
                  </Badge>
                  <span>+₹500K</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="infra">Infrastructure Spend Change</Label>
                <div className="px-3">
                  <Slider
                    value={[levers.deltaInfra]}
                    onValueChange={([value]) => handleLeverChange("deltaInfra", value)}
                    max={200000}
                    min={-20000}
                    step={2500}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-₹20K</span>
                  <Badge variant={levers.deltaInfra >= 0 ? "default" : "destructive"}>
                    {levers.deltaInfra >= 0 ? "+" : ""}
                    {formatCompactCurrency(levers.deltaInfra)}
                  </Badge>
                  <span>+₹200K</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="pricing">Price Change</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Price elasticity applied: +10% price → +5% revenue</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="px-3">
                <Slider
                  value={[levers.priceChangePct * 100]}
                  onValueChange={([value]) => handleLeverChange("priceChangePct", value / 100)}
                  max={30}
                  min={-20}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>-20%</span>
                <Badge variant={levers.priceChangePct >= 0 ? "default" : "destructive"}>
                  {levers.priceChangePct >= 0 ? "+" : ""}
                  {(levers.priceChangePct * 100).toFixed(0)}%
                </Badge>
                <span>+30%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="advanced">Show Assumptions</Label>
                <p className="text-xs text-muted-foreground">Display calculation assumptions and formulas</p>
              </div>
              <Switch id="advanced" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
            </div>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong>Price Elasticity:</strong> 50% (10% price increase → 5% revenue increase)
                </p>
                <p>
                  <strong>Payroll Allocation:</strong> 60% of base expenses considered payroll
                </p>
                <p>
                  <strong>New Hire Impact:</strong> 50% of new hire cost affects gross profit calculation
                </p>
                <p>
                  <strong>Runway Calculation:</strong> Cash ÷ max(Monthly Burn, ₹1)
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Save className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Save and load your current scenario instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Save className="h-4 w-4" />
                Quick Save
              </Button>
              <Button
                onClick={handleLoad}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Upload className="h-4 w-4" />
                Quick Load
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                size="lg"
              >
                <RotateCcw className="h-4 w-4" />
                Reset All
              </Button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              <p>
                <strong>Quick Save:</strong> Instantly saves your current scenario with timestamp
              </p>
              <p>
                <strong>Quick Load:</strong> Restores your most recently saved scenario
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}

// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}
