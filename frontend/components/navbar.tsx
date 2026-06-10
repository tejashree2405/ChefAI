import Link from 'next/link'
import { ChefHat } from 'lucide-react'

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center glow-primary-sm group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">ChefAI</span>
        </Link>
        
        <div className="hidden sm:flex items-center gap-8">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Home
          </Link>
            <Link href="/saved" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Saved
            </Link>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Beta
          </span>
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary text-sm font-medium">AI</span>
          </div>
        </div>
      </nav>
    </header>
  )
}
