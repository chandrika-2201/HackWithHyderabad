"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/top-nav"
import { FooterDisclaimer } from "@/components/footer-disclaimer"
import { Calculator, TrendingUp, BarChart3, ArrowRight, CheckCircle, Zap, X } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <TopNav />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Real-time Financial Planning
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
              CFO Helper
              <span className="block text-primary">What-If Finance Simulator</span>
            </h1>

            <p className="text-xl text-muted-foreground text-balance leading-relaxed mb-8 max-w-2xl mx-auto">
              Adjust hiring, pricing, and spend to see runway and profit instantly. Make smarter financial decisions
              with interactive charts and real-time calculations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/planner">
                  Try it Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" className="text-lg px-8">
                <Link href="/planner">See Demo</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Financial Planning Made Simple</h2>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              No more spreadsheet guesswork. Get instant insights into your business finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Results</CardTitle>
                <CardDescription>See the impact of every decision instantly. No waiting, no delays.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Instant KPI updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Live chart rendering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Smart calculations
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Interactive Charts</CardTitle>
                <CardDescription>Visualize cash flow, burn rate, and runway with beautiful charts.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Cash projection timeline
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Revenue vs burn analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Responsive design
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Scenario Planning</CardTitle>
                <CardDescription>Test different strategies and see which path leads to success.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Hiring impact analysis
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Marketing spend optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    Pricing strategy testing
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-6">Stop Guessing, Start Planning</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Founders and small business owners constantly face critical questions: "If I hire two more people, how
                long will my cash last?" "What happens if I increase marketing spend by 50%?"
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Spreadsheets are slow, error-prone, and hard to read. CFO Helper gives you instant answers with visual
                clarity, so you can make confident decisions quickly.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="h-3 w-3 text-destructive" />
                  </div>
                  <div>
                    <p className="font-medium">Slow spreadsheet calculations</p>
                    <p className="text-sm text-muted-foreground">Manual updates, formula errors, version conflicts</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Instant scenario modeling</p>
                    <p className="text-sm text-muted-foreground">Real-time updates, visual feedback, no errors</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-muted/50 rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <span className="text-sm font-medium">Monthly Burn Rate</span>
                    <span className="text-lg font-bold text-destructive">₹2.5L</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <span className="text-sm font-medium">Cash Runway</span>
                    <span className="text-lg font-bold text-primary">8.2 months</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-background rounded-lg border">
                    <span className="text-sm font-medium">Gross Profit</span>
                    <span className="text-lg font-bold text-primary">₹1.8L</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Ready to Take Control of Your Finances?</h2>
          <p className="text-xl text-primary-foreground/90 text-balance leading-relaxed mb-8 max-w-2xl mx-auto">
            Join founders who are making smarter financial decisions with real-time insights.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/planner">
              Start Planning Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <FooterDisclaimer />
    </div>
  )
}
