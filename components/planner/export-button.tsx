"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import type { BaseInputs, Levers, KPIs } from "@/lib/types"
import { PDFExporter } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth"

interface ExportButtonProps {
  baseInputs: BaseInputs
  levers: Levers
  kpis: KPIs
  scenarioName?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function ExportButton({
  baseInputs,
  levers,
  kpis,
  scenarioName = "Financial Scenario",
  variant = "outline",
  size = "default",
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()
  const { user, incrementUsage, trackReportExport } = useAuth()

  const handleExport = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to export scenarios",
        variant: "destructive",
      })
      return
    }

    if (user.usageCount >= user.maxUsage) {
      toast({
        title: "Usage limit reached",
        description: "You've reached your monthly export limit. Upgrade to continue.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      await PDFExporter.exportScenario(
        scenarioName,
        baseInputs,
        levers,
        kpis,
        true, // Include charts
      )

      incrementUsage()
      trackReportExport("PDF")

      toast({
        title: "Export successful!",
        description: "Your financial scenario report has been downloaded.",
      })
    } catch (error) {
      console.error("Export failed:", error)
      toast({
        title: "Export failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Button onClick={handleExport} disabled={isExporting} variant={variant} size={size}>
      {isExporting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  )
}
