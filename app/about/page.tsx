"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TopNav } from "@/components/top-nav"
import { FooterDisclaimer } from "@/components/footer-disclaimer"
import { Calculator, TrendingUp, BarChart3, ArrowRight, CheckCircle, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <TopNav />

      {/* Header Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">About CFO Helper</h1>
            <p className="text-xl text-muted-foreground text-balance leading-relaxed mb-8 max-w-2xl mx-auto">
              Plan smarter in seconds—see the financial impact of every decision, instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Paragraph */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Managing budgets and testing financial scenarios is slow and error-prone in spreadsheets. CFO Helper
              transforms complex financial planning into an intuitive, real-time experience that helps founders and
              business owners make confident decisions quickly.
            </p>
          </div>
        </div>
      </section>

      {/* What CFO Helper Does */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">What CFO Helper Does</h2>
            <p className="text-lg text-muted-foreground text-balance leading-relaxed">
              Three powerful features that transform how you plan your business finances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Real-time What-If Analysis</CardTitle>
                  <CardDescription>
                    Adjust hiring, marketing spend or product pricing and see burn rate, runway and profit instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      Instant parameter adjustments
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      Live KPI calculations
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      No spreadsheet delays
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Interactive Charts & KPIs</CardTitle>
                  <CardDescription>
                    Watch cash projection and revenue vs burn charts update live with every slider move.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      12-month cash runway visualization
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      Revenue vs expenses tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      Dynamic KPI cards
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Future-Ready Platform</CardTitle>
                  <CardDescription>
                    Coming soon: save scenarios, export PDF reports, integrate live data feeds and AI advice.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-muted-foreground space-y-2 text-left">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      Scenario saving & comparison
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      Professional PDF reports
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                      AI-powered insights
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How to Use It */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance text-center mb-12">How to Use It</h2>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Enter your base financial figures</h3>
                  <p className="text-muted-foreground">
                    Input your current cash position, monthly revenue, and core expenses to establish your baseline.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Move sliders to try "what-if" scenarios</h3>
                  <p className="text-muted-foreground">
                    Adjust hiring plans, marketing spend, or pricing changes using intuitive slider controls.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    View instant updates in KPI cards and interactive charts
                  </h3>
                  <p className="text-muted-foreground">
                    Watch your burn rate, runway, and profitability update in real-time with visual feedback.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-800 dark:text-amber-200">
                <strong>Important Disclaimer:</strong> CFO Helper provides illustrative estimates only. It is not
                financial advice and should not replace professional consultation. Always consult with qualified
                financial advisors for important business decisions.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>

      {/* CTA / Navigation */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance mb-4">Ready to Start Planning?</h2>
          <p className="text-xl text-primary-foreground/90 text-balance leading-relaxed mb-8 max-w-2xl mx-auto">
            Experience the power of real-time financial scenario planning.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link href="/planner">
              Go to Planner
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      <FooterDisclaimer />
    </div>
  )
}
