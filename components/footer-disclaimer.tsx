import Link from "next/link"
import { Calculator } from "lucide-react"

export function FooterDisclaimer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-4">
              <Calculator className="h-6 w-6 text-primary" />
              <span>CFO Helper</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Real-time financial scenario planning for founders and small business owners. Make smarter decisions with
              interactive charts and instant calculations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/planner" className="text-muted-foreground hover:text-primary transition-colors">
                  Financial Planner
                </Link>
              </li>
              <li>
                <Link href="/usage" className="text-muted-foreground hover:text-primary transition-colors">
                  Usage Dashboard
                </Link>
              </li>
              <li>
                <Link href="/planner" className="text-muted-foreground hover:text-primary transition-colors">
                  Export Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 CFO Helper. Built with Next.js and Recharts.</p>
        </div>
      </div>
    </footer>
  )
}
