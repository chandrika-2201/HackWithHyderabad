"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Save, FolderOpen, Trash2, Copy, Calendar, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ScenarioManager, type SavedScenario } from "@/lib/scenario-manager"
import type { BaseInputs, Levers, KPIs } from "@/lib/types"
import { formatCompactCurrency } from "@/lib/finance"
import { useAuth } from "@/lib/auth"

interface ScenarioManagerProps {
  baseInputs: BaseInputs
  levers: Levers
  kpis: KPIs
  onLoadScenario: (baseInputs: BaseInputs, levers: Levers) => void
}

export function ScenarioManagerComponent({ baseInputs, levers, kpis, onLoadScenario }: ScenarioManagerProps) {
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => ScenarioManager.getAllScenarios())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedScenario, setSelectedScenario] = useState<SavedScenario | null>(null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [loadDialogOpen, setLoadDialogOpen] = useState(false)
  const [scenarioName, setScenarioName] = useState("")
  const [scenarioDescription, setScenarioDescription] = useState("")
  const [scenarioTags, setScenarioTags] = useState("")
  const { toast } = useToast()
  const { trackScenarioSimulation } = useAuth()

  const refreshScenarios = () => {
    setScenarios(ScenarioManager.getAllScenarios())
  }

  const handleSaveScenario = () => {
    if (!scenarioName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your scenario",
        variant: "destructive",
      })
      return
    }

    const tags = scenarioTags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)

    const savedScenario = ScenarioManager.saveScenario({
      name: scenarioName.trim(),
      description: scenarioDescription.trim() || undefined,
      baseInputs,
      levers,
      kpis,
      tags: tags.length > 0 ? tags : undefined,
    })

    trackScenarioSimulation(scenarioName.trim())

    refreshScenarios()
    setSaveDialogOpen(false)
    setScenarioName("")
    setScenarioDescription("")
    setScenarioTags("")

    toast({
      title: "Scenario saved!",
      description: `"${savedScenario.name}" has been saved to your library.`,
    })
  }

  const handleLoadScenario = (scenario: SavedScenario) => {
    onLoadScenario(scenario.baseInputs, scenario.levers)
    setLoadDialogOpen(false)

    toast({
      title: "Scenario loaded!",
      description: `"${scenario.name}" has been applied to your planner.`,
    })
  }

  const handleDeleteScenario = (scenario: SavedScenario) => {
    if (ScenarioManager.deleteScenario(scenario.id)) {
      refreshScenarios()
      toast({
        title: "Scenario deleted",
        description: `"${scenario.name}" has been removed from your library.`,
      })
    }
  }

  const handleDuplicateScenario = (scenario: SavedScenario) => {
    const duplicated = ScenarioManager.saveScenario({
      name: `${scenario.name} (Copy)`,
      description: scenario.description,
      baseInputs: scenario.baseInputs,
      levers: scenario.levers,
      kpis: scenario.kpis,
      tags: scenario.tags,
    })

    refreshScenarios()
    toast({
      title: "Scenario duplicated!",
      description: `"${duplicated.name}" has been added to your library.`,
    })
  }

  const filteredScenarios = scenarios.filter(
    (scenario) =>
      scenario.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const recentScenarios = ScenarioManager.getRecentScenarios(3)

  return (
    <div className="flex gap-2">
      {/* Save Scenario Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Save className="mr-2 h-4 w-4" />
            Save Scenario
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Current Scenario</DialogTitle>
            <DialogDescription>
              Save your current financial scenario to your library for future reference.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario-name">Scenario Name</Label>
              <Input
                id="scenario-name"
                placeholder="e.g., Aggressive Growth Plan"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scenario-description">Description (Optional)</Label>
              <Textarea
                id="scenario-description"
                placeholder="Brief description of this scenario..."
                value={scenarioDescription}
                onChange={(e) => setScenarioDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="scenario-tags">Tags (Optional)</Label>
              <Input
                id="scenario-tags"
                placeholder="growth, hiring, marketing (comma-separated)"
                value={scenarioTags}
                onChange={(e) => setScenarioTags(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveScenario}>Save Scenario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Scenario Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <FolderOpen className="mr-2 h-4 w-4" />
            Load Scenario
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Load Saved Scenario</DialogTitle>
            <DialogDescription>Choose a scenario from your library to apply to the planner.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search scenarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Recent Scenarios */}
            {recentScenarios.length > 0 && searchQuery === "" && (
              <div>
                <h4 className="text-sm font-medium mb-2">Recent Scenarios</h4>
                <div className="grid gap-2">
                  {recentScenarios.map((scenario) => (
                    <Card
                      key={scenario.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleLoadScenario(scenario)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-sm">{scenario.name}</h5>
                            <p className="text-xs text-muted-foreground">
                              Runway: {scenario.kpis.cashRunwayMonths} months • Burn:{" "}
                              {formatCompactCurrency(scenario.kpis.monthlyBurnRate)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuplicateScenario(scenario)
                              }}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteScenario(scenario)
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            {/* All Scenarios */}
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {filteredScenarios.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No scenarios match your search." : "No saved scenarios yet."}
                  </div>
                ) : (
                  filteredScenarios.map((scenario) => (
                    <Card key={scenario.id} className="cursor-pointer hover:bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1" onClick={() => handleLoadScenario(scenario)}>
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium">{scenario.name}</h5>
                              {scenario.tags && (
                                <div className="flex gap-1">
                                  {scenario.tags.slice(0, 2).map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            {scenario.description && (
                              <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                            )}
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-muted-foreground">Cash Runway:</span>
                                <span className="ml-1 font-medium">{scenario.kpis.cashRunwayMonths} months</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Monthly Burn:</span>
                                <span className="ml-1 font-medium">
                                  {formatCompactCurrency(scenario.kpis.monthlyBurnRate)}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Gross Profit:</span>
                                <span className="ml-1 font-medium">
                                  {formatCompactCurrency(scenario.kpis.grossProfit)}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  {new Date(scenario.updatedAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDuplicateScenario(scenario)
                              }}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteScenario(scenario)
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
