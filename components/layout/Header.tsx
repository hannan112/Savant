import Link from "next/link"
import { FileText, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { UserNav } from "@/components/layout/UserNav"
import { CONVERTERS, SITE_CONFIG } from "@/lib/constants"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">{SITE_CONFIG.name}</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Home
          </Link>
          <Link
            href="/converters"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Converters
          </Link>
          <Link
            href="/tools/paraphraser"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Paraphraser
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

