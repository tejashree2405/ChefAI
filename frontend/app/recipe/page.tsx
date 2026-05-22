"use client"

import { useEffect, useState } from "react"
import { Navbar } from '@/components/navbar'
import { RecipeDetail } from '@/components/recipe-detail'
import { ChatPanel } from '@/components/chat-panel'

export default function RecipePage() {
  
const [recipe, setRecipe] = useState<any>(null)
const [messages, setMessages] = useState<any[]>([])
useEffect(() => {

  const storedRecipe = localStorage.getItem("recipe")

  if (storedRecipe) {

    const parsedRecipe = JSON.parse(storedRecipe)

    setRecipe(parsedRecipe)

    setMessages([
      {
        role: "assistant",
        content:
          "Your recipe is ready! Ask me to modify it however you'd like."
      }
    ])
  }

}, [])
useEffect(() => {

  const storedRecipe = localStorage.getItem("recipe")

  if (storedRecipe) {
    setRecipe(JSON.parse(storedRecipe))
  }

  }, [])
  if (!recipe) {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      Loading...
    </div>
    )
  }
  
  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Split Screen Layout */}
      <div className="pt-16 h-screen flex flex-col lg:flex-row">
        {/* Recipe Section - Left Side */}
        <div className="lg:w-1/2 xl:w-3/5 h-[60vh] lg:h-full border-b lg:border-b-0 lg:border-r border-border overflow-hidden">
          <RecipeDetail recipe={recipe} />
        </div>
        
        {/* Chat Section - Right Side */}
        <div className="lg:w-1/2 xl:w-2/5 h-[calc(40vh-4rem)] lg:h-full overflow-hidden">

          <ChatPanel
            recipe={recipe}
            setRecipe={setRecipe}
            messages={messages}
            setMessages={setMessages}
          />

        </div>
      </div>
    </main>
  )
}
