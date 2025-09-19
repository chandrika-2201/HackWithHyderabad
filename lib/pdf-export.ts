// PDF export functionality with chart capture
import type { BaseInputs, Levers, KPIs } from "./types"

export interface ExportData {
  scenario: {
    name: string
    baseInputs: BaseInputs
    levers: Levers
    kpis: KPIs
    createdAt: string
  }
  chartImages?: {
    cashProjection?: string
    revenueVsBurn?: string
  }
}

export class PDFExporter {
  static async captureChart(elementId: string): Promise<string | null> {
    try {
      console.log(`[v0] Attempting to capture chart: ${elementId}`)

      // Dynamic import to avoid SSR issues
      const html2canvas = (await import("html2canvas")).default

      const element = document.getElementById(elementId)
      if (!element) {
        console.warn(`[v0] Element with id ${elementId} not found`)
        return null
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById(elementId)
          if (clonedElement) {
            const allElements = clonedElement.querySelectorAll("*")
            allElements.forEach((el) => {
              const element = el as HTMLElement
              const computedStyle = window.getComputedStyle(element)

              // Helper function to convert CSS variables to RGB values
              const convertCSSVar = (value: string): string => {
                if (value.includes("var(--primary)")) return "#6096B4"
                if (value.includes("var(--secondary)")) return "#93BFCF"
                if (value.includes("var(--background)")) return "#ffffff"
                if (value.includes("var(--foreground)")) return "#374151"
                if (value.includes("var(--border)")) return "#BDCDD6"
                if (value.includes("var(--chart-1)")) return "#6096B4"
                if (value.includes("var(--chart-2)")) return "#93BFCF"
                if (value.includes("var(--chart-3)")) return "#BDCDD6"
                if (value.includes("var(--muted)")) return "#EEE9DA"
                if (value.includes("var(--muted-foreground)")) return "#6b7280"
                return value
              }

              // Convert colors that contain oklch or CSS variables
              if (
                computedStyle.color &&
                (computedStyle.color.includes("oklch") || computedStyle.color.includes("var("))
              ) {
                element.style.color = convertCSSVar(computedStyle.color) || "#374151"
              }
              if (
                computedStyle.backgroundColor &&
                (computedStyle.backgroundColor.includes("oklch") || computedStyle.backgroundColor.includes("var("))
              ) {
                element.style.backgroundColor = convertCSSVar(computedStyle.backgroundColor) || "#ffffff"
              }
              if (
                computedStyle.borderColor &&
                (computedStyle.borderColor.includes("oklch") || computedStyle.borderColor.includes("var("))
              ) {
                element.style.borderColor = convertCSSVar(computedStyle.borderColor) || "#BDCDD6"
              }
              if (computedStyle.fill && (computedStyle.fill.includes("oklch") || computedStyle.fill.includes("var("))) {
                element.style.fill = convertCSSVar(computedStyle.fill) || "#6096B4"
              }
              if (
                computedStyle.stroke &&
                (computedStyle.stroke.includes("oklch") || computedStyle.stroke.includes("var("))
              ) {
                element.style.stroke = convertCSSVar(computedStyle.stroke) || "#6096B4"
              }

              // Handle SVG elements specifically
              if (element.tagName === "path" || element.tagName === "circle" || element.tagName === "rect") {
                const fill = element.getAttribute("fill")
                const stroke = element.getAttribute("stroke")

                if (fill && (fill.includes("var(") || fill.includes("hsl("))) {
                  element.setAttribute("fill", convertCSSVar(fill) || "#6096B4")
                }
                if (stroke && (stroke.includes("var(") || stroke.includes("hsl("))) {
                  element.setAttribute("stroke", convertCSSVar(stroke) || "#6096B4")
                }
              }
            })
          }
        },
      })

      const dataUrl = canvas.toDataURL("image/png")
      console.log(`[v0] Successfully captured chart: ${elementId}`)
      return dataUrl
    } catch (error) {
      console.error(`[v0] Error capturing chart ${elementId}:`, error)
      return null
    }
  }

  static async generatePDF(data: ExportData): Promise<void> {
    try {
      // Dynamic import to avoid SSR issues
      const jsPDF = (await import("jspdf")).default

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      let yPosition = 20

      // Header
      doc.setFontSize(20)
      doc.setTextColor(96, 150, 180) // Primary color
      doc.text("CFO Helper - Financial Scenario Report", 20, yPosition)
      yPosition += 15

      // Scenario info
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`Scenario: ${data.scenario.name}`, 20, yPosition)
      yPosition += 8
      doc.text(`Generated: ${new Date(data.scenario.createdAt).toLocaleDateString()}`, 20, yPosition)
      yPosition += 15

      // KPIs Section
      doc.setFontSize(16)
      doc.setTextColor(96, 150, 180)
      doc.text("Key Performance Indicators", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)

      const kpis = [
        ["Monthly Burn Rate", `$${(data.scenario.kpis.monthlyBurnRate || 0).toLocaleString()}`],
        ["Cash Runway", `${data.scenario.kpis.cashRunwayMonths || 0} months`],
        ["Gross Profit", `$${(data.scenario.kpis.grossProfit || 0).toLocaleString()}`],
        ["Monthly Revenue", `$${(data.scenario.kpis.monthlyRevenue || 0).toLocaleString()}`],
        ["Break-even Point", `Month ${data.scenario.kpis.breakEvenMonth || "N/A"}`],
      ]

      kpis.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 20, yPosition)
        yPosition += 6
      })

      yPosition += 10

      // Base Inputs Section
      doc.setFontSize(16)
      doc.setTextColor(96, 150, 180)
      doc.text("Base Financial Inputs", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)

      const baseInputs = [
        ["Starting Cash", `$${(data.scenario.baseInputs.startingCash || 0).toLocaleString()}`],
        ["Monthly Revenue", `$${(data.scenario.baseInputs.monthlyRevenue || 0).toLocaleString()}`],
        ["Monthly Expenses", `$${(data.scenario.baseInputs.monthlyExpenses || 0).toLocaleString()}`],
        ["Team Size", `${data.scenario.baseInputs.teamSize || 0} people`],
        ["Gross Margin", `${data.scenario.baseInputs.grossMargin || 0}%`],
      ]

      baseInputs.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 20, yPosition)
        yPosition += 6
      })

      yPosition += 10

      // Levers Section
      doc.setFontSize(16)
      doc.setTextColor(96, 150, 180)
      doc.text("Financial Levers", 20, yPosition)
      yPosition += 10

      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)

      const levers = [
        ["Hiring Rate", `${data.scenario.levers.hiringRate || 0} people/month`],
        ["Marketing Spend", `$${(data.scenario.levers.marketingSpend || 0).toLocaleString()}/month`],
        ["Infrastructure Costs", `$${(data.scenario.levers.infrastructureCosts || 0).toLocaleString()}/month`],
        [
          "Pricing Adjustment",
          `${(data.scenario.levers.pricingAdjustment || 0) > 0 ? "+" : ""}${data.scenario.levers.pricingAdjustment || 0}%`,
        ],
      ]

      levers.forEach(([label, value]) => {
        doc.text(`${label}: ${value}`, 20, yPosition)
        yPosition += 6
      })

      // Add charts if available
      if (data.chartImages?.cashProjection) {
        doc.addPage()
        yPosition = 20

        doc.setFontSize(16)
        doc.setTextColor(96, 150, 180)
        doc.text("Cash Projection Chart", 20, yPosition)
        yPosition += 15

        try {
          doc.addImage(data.chartImages.cashProjection, "PNG", 20, yPosition, pageWidth - 40, 120)
          yPosition += 130
        } catch (error) {
          console.error("Error adding cash projection chart:", error)
        }
      }

      if (data.chartImages?.revenueVsBurn) {
        if (yPosition > pageHeight - 140) {
          doc.addPage()
          yPosition = 20
        }

        doc.setFontSize(16)
        doc.setTextColor(96, 150, 180)
        doc.text("Revenue vs Expenses Chart", 20, yPosition)
        yPosition += 15

        try {
          doc.addImage(data.chartImages.revenueVsBurn, "PNG", 20, yPosition, pageWidth - 40, 120)
        } catch (error) {
          console.error("Error adding revenue vs burn chart:", error)
        }
      }

      // Footer
      const totalPages = doc.internal.pages.length - 1
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(128, 128, 128)
        doc.text(`Generated by CFO Helper - Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        })
      }

      // Save the PDF
      const fileName = `cfo-helper-${data.scenario.name.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`
      doc.save(fileName)

      console.log("[v0] PDF export successful:", fileName)
    } catch (error) {
      console.error("Error generating PDF:", error)
      throw new Error("Failed to generate PDF report")
    }
  }

  static async exportScenario(
    scenarioName: string,
    baseInputs: BaseInputs,
    levers: Levers,
    kpis: KPIs,
    includeCharts = true,
  ): Promise<void> {
    console.log("[v0] Starting PDF export for scenario:", scenarioName)
    console.log("[v0] Base inputs:", baseInputs)
    console.log("[v0] KPIs:", kpis)

    const exportData: ExportData = {
      scenario: {
        name: scenarioName,
        baseInputs,
        levers,
        kpis,
        createdAt: new Date().toISOString(),
      },
    }

    if (includeCharts) {
      console.log("[v0] Capturing charts...")
      exportData.chartImages = {
        cashProjection: await this.captureChart("cash-projection-chart"),
        revenueVsBurn: await this.captureChart("revenue-vs-burn-chart"),
      }
      console.log("[v0] Charts captured:", {
        cashProjection: !!exportData.chartImages.cashProjection,
        revenueVsBurn: !!exportData.chartImages.revenueVsBurn,
      })
    }

    await this.generatePDF(exportData)
  }
}
