"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopNav } from "@/components/top-nav"
import { FooterDisclaimer } from "@/components/footer-disclaimer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  BarChart3,
  Clock,
  FileText,
  Trash2,
  Calendar,
  TrendingUp,
  Users,
  Download,
  Activity,
  Target,
  Zap,
  LogIn,
  UserPlus,
} from "lucide-react"
import { getStoredScenarios, clearStoredScenarios } from "@/lib/storage"
import { ScenarioManager } from "@/lib/scenario-manager"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import type { Scenario } from "@/lib/types"

export default function UsagePage() {
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [savedScenarios, setSavedScenarios] = useState(ScenarioManager.getAllScenarios())
  const [simulationCount, setSimulationCount] = useState(0)
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const stored = getStoredScenarios()
    setScenarios(stored)
    setSavedScenarios(ScenarioManager.getAllScenarios())
    setSimulationCount(stored.length + Math.floor(Math.random() * 15) + 5) // Mock additional simulations
  }, [])

  const handleClearHistory = () => {
    clearStoredScenarios()
    setScenarios([])
    toast({
      title: "History Cleared",
      description: "All saved scenarios have been removed.",
    })
  }

  const handleClearSavedScenarios = () => {
    const scenarios = ScenarioManager.getAllScenarios()
    scenarios.forEach((scenario) => ScenarioManager.deleteScenario(scenario.id))
    setSavedScenarios([])
    toast({
      title: "Saved Scenarios Cleared",
      description: "All named scenarios have been removed.",
    })
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getUsagePercentage = () => {
    if (!user) return 0
    return Math.min((user.usageCount / user.maxUsage) * 100, 100)
  }

  const getActivityLevel = () => {
    const totalActivity = scenarios.length + savedScenarios.length
    if (totalActivity >= 10) return { level: "High", color: "text-green-600", icon: Zap }
    if (totalActivity >= 5) return { level: "Medium", color: "text-yellow-600", icon: TrendingUp }
    return { level: "Low", color: "text-blue-600", icon: Activity }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" className="mx-auto mb-4" />
                <p className="text-muted-foreground">Loading your usage data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen">
        <TopNav />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card className="text-center py-12">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <BarChart3 className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl mb-2">Sign In to View Usage</CardTitle>
                <CardDescription className="text-lg">
                  Track your financial planning activity and manage your scenarios with a free account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <Activity className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium mb-1">Usage Analytics</h3>
                      <p className="text-muted-foreground text-center">
                        Track scenarios created, exports used, and planning patterns
                      </p>
                    </div>
                    <div className="flex flex-col items-center p-4 border rounded-lg">
                      <Target className="h-8 w-8 text-primary mb-2" />
                      <h3 className="font-medium mb-1">Scenario History</h3>
                      <p className="text-muted-foreground text-center">
                        View and manage all your saved financial scenarios
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" onClick={() => router.push("/auth/signup")}>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Free Account
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => router.push("/auth/login")}>
                      <LogIn className="mr-2 h-5 w-5" />
                      Sign In
                    </Button>
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

  const activityLevel = getActivityLevel()
  const ActivityIcon = activityLevel.icon

  return (
    <div className="min-h-screen">
      <TopNav />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Usage Dashboard</h1>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              Track your financial scenario planning activity and manage saved scenarios.
            </p>
          </div>

          {/* User Status Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={user.plan === "pro" ? "default" : "secondary"}>{user.plan.toUpperCase()}</Badge>
                    <span className="text-sm text-muted-foreground">Plan</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl font-bold">{user.usageCount}</span>
                    <span className="text-muted-foreground">/ {user.maxUsage}</span>
                  </div>
                  <Progress value={getUsagePercentage()} className="mb-2" />
                  <p className="text-sm text-muted-foreground">Monthly usage</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ActivityIcon className={`h-5 w-5 ${activityLevel.color}`} />
                    <span className={`font-medium ${activityLevel.color}`}>{activityLevel.level}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Activity level</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Scenarios Simulated</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{simulationCount}</div>
                <p className="text-xs text-muted-foreground">Total scenarios analyzed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Exported</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.usageCount || 0}</div>
                <p className="text-xs text-muted-foreground">PDF reports generated</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Scenarios</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{savedScenarios.length}</div>
                <p className="text-xs text-muted-foreground">Named scenarios</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Session History</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scenarios.length}</div>
                <p className="text-xs text-muted-foreground">Quick saves</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabbed Content */}
          <Tabs defaultValue="scenarios" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scenarios">Named Scenarios</TabsTrigger>
              <TabsTrigger value="history">Session History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Named Scenarios Tab */}
            <TabsContent value="scenarios">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Named Scenarios</CardTitle>
                      <CardDescription>
                        Your saved financial scenarios with custom names and descriptions
                      </CardDescription>
                    </div>
                    {savedScenarios.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearSavedScenarios}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {savedScenarios.length === 0 ? (
                    <div className="text-center py-8">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Named Scenarios</h3>
                      <p className="text-muted-foreground mb-4">
                        Save scenarios with custom names and descriptions to track different business strategies.
                      </p>
                      <Button asChild>
                        <a href="/planner">Create Your First Scenario</a>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedScenarios.map((scenario) => (
                        <Card key={scenario.id} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{scenario.name}</h4>
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
                                <p className="text-sm text-muted-foreground mb-3">{scenario.description}</p>
                              )}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Cash Runway:</span>
                                  <div className="font-medium">{scenario.kpis.cashRunwayMonths} months</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Monthly Burn:</span>
                                  <div className="font-medium">
                                    ₹{(scenario.kpis.monthlyBurnRate / 100000).toFixed(1)}L
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Team Size:</span>
                                  <div className="font-medium">
                                    {scenario.baseInputs.teamSize + scenario.levers.addHires}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Updated:</span>
                                  <div className="font-medium">{new Date(scenario.updatedAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Session History Tab */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Session History</CardTitle>
                      <CardDescription>Your recent financial scenario planning sessions</CardDescription>
                    </div>
                    {scenarios.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearHistory}
                        className="flex items-center gap-2 bg-transparent"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear History
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {scenarios.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start planning scenarios to see your history here. Your quick saves will appear in this table.
                      </p>
                      <Button asChild>
                        <a href="/planner">Create Your First Scenario</a>
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Cash on Hand</TableHead>
                          <TableHead>Monthly Revenue</TableHead>
                          <TableHead>Team Size</TableHead>
                          <TableHead>Additional Hires</TableHead>
                          <TableHead>Marketing Δ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scenarios.map((scenario, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{formatDate(scenario.timestamp)}</TableCell>
                            <TableCell>₹{(scenario.base.cash / 100000).toFixed(1)}L</TableCell>
                            <TableCell>₹{(scenario.base.monthlyRevenue / 100000).toFixed(1)}L</TableCell>
                            <TableCell>{scenario.base.teamSize}</TableCell>
                            <TableCell>
                              {scenario.levers.addHires > 0 ? (
                                <Badge variant="default">+{scenario.levers.addHires}</Badge>
                              ) : (
                                <span className="text-muted-foreground">0</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {scenario.levers.deltaMarketing !== 0 ? (
                                <Badge variant={scenario.levers.deltaMarketing > 0 ? "default" : "destructive"}>
                                  {scenario.levers.deltaMarketing > 0 ? "+" : ""}₹
                                  {Math.abs(scenario.levers.deltaMarketing / 1000)}K
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">No change</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Analytics</CardTitle>
                    <CardDescription>Insights into your financial planning patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Most Common Scenarios</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Growth Planning</span>
                            <Badge variant="secondary">45%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cost Optimization</span>
                            <Badge variant="secondary">30%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Hiring Analysis</span>
                            <Badge variant="secondary">25%</Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Average Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Cash Runway</span>
                            <span className="font-medium">8.5 months</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Team Size</span>
                            <span className="font-medium">12 people</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Monthly Burn</span>
                            <span className="font-medium">₹15.2L</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {user && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Usage Recommendations</CardTitle>
                      <CardDescription>Personalized suggestions based on your activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {user.usageCount < 3 && (
                          <div className="flex items-start gap-3 p-4 border rounded-lg">
                            <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Explore More Scenarios</h4>
                              <p className="text-sm text-muted-foreground">
                                Try different financial scenarios to better understand your options.
                              </p>
                            </div>
                          </div>
                        )}
                        {savedScenarios.length === 0 && (
                          <div className="flex items-start gap-3 p-4 border rounded-lg">
                            <Download className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Save Important Scenarios</h4>
                              <p className="text-sm text-muted-foreground">
                                Name and save scenarios you want to reference later.
                              </p>
                            </div>
                          </div>
                        )}
                        {user.usageCount >= user.maxUsage * 0.8 && (
                          <div className="flex items-start gap-3 p-4 border rounded-lg">
                            <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium">Consider Upgrading</h4>
                              <p className="text-sm text-muted-foreground">
                                You're approaching your monthly limit. Upgrade for unlimited access.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <FooterDisclaimer />
    </div>
  )
}
