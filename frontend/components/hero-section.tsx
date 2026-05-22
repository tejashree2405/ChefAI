'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, ChefHat, Utensils, Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  const [ingredients, setIngredients] = useState('')
  const router = useRouter()

    const [loading, setLoading] = useState(false)

const handleGenerate = async () => {

  if (!ingredients.trim()) return

  setLoading(true)

  try {

    const ingredientsArray = ingredients
      .split(",")
      .map(item => item.trim())

    const response = await fetch(
      "http://127.0.0.1:8000/generate-recipe",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ingredients: ingredientsArray,
        }),
      }
    )

    const data = await response.json()

    console.log(data)

    localStorage.setItem(
      "recipe",
      JSON.stringify(data)
    )

    router.push('/recipe')

  } catch (error) {

    console.log(error)

  }

  setLoading(false)
}

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">AI-Powered Recipe Generation</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-balance">
          <span className="text-foreground">Got </span>
          <span className="gradient-text">ingredients</span>
          <span className="text-foreground"> but no </span>
          <span className="gradient-text">recipe ideas</span>
          <span className="text-foreground">?</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed text-pretty">
          Tell ChefAI what&apos;s in your kitchen and get personalized recipes instantly.
        </p>

        {/* Prompt Box */}
        <div className="relative max-w-2xl mx-auto">
          <div className="glass glow-primary rounded-2xl p-2">
            <div className="relative">
              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Enter your ingredients... e.g., chicken, garlic, spinach, cream, parmesan"
                className="w-full h-32 sm:h-28 px-5 py-4 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-base sm:text-lg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleGenerate()
                  }
                }}
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Utensils className="w-4 h-4" />
                  <span className="hidden sm:inline">Press Enter to generate</span>
                </div>
                <Button 
                  onClick={handleGenerate}
                  className="gradient-primary hover:opacity-90 transition-opacity glow-primary-sm"
                  size="lg"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {loading ? "Generating..." : "Generate Recipe"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <FeatureCard 
            icon={<ChefHat className="w-6 h-6" />}
            title="AI Chef"
            description="Powered by advanced AI to create unique recipes"
          />
          <FeatureCard 
            icon={<Utensils className="w-6 h-6" />}
            title="Any Ingredients"
            description="Works with whatever you have in your kitchen"
          />
          <FeatureCard 
            icon={<Clock className="w-6 h-6" />}
            title="Instant Results"
            description="Get detailed recipes in seconds"
          />
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode
  title: string
  description: string 
}) {
  return (
    <div className="glass-card rounded-xl p-6 text-center hover:border-primary/30 transition-colors">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
