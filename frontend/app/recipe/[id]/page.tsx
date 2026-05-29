'use client'

import { useEffect, useState } from 'react'

import { useParams } from 'next/navigation'

import { ChatPanel } from '@/components/chat-panel'

import { RecipeDetail } from '@/components/recipe-detail'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export default function RecipePage() {

  const params = useParams()

  const id = params.id

  const [recipe, setRecipe] = useState<any>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {

    async function fetchRecipe() {

      try {

        const response = await fetch(
          `http://127.0.0.1:8000/recipe/${id}`
        )

        const data = await response.json()

        setRecipe(data.recipe)

        setMessages(data.messages)

      } catch (error) {

        console.log(error)

      } finally {

        setLoading(false)

      }

    }

    if (id) {

      fetchRecipe()

    }

  }, [id])

  if (loading) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Loading...

      </div>

    )

  }

  if (!recipe) {

    return (

      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        Recipe not found.

      </div>

    )

  }

  return (

    <main className="h-screen overflow-hidden bg-black text-white">

      <div className="grid grid-cols-1 lg:grid-cols-2 h-full">

        <div className="overflow-y-auto border-r border-zinc-800">

          <RecipeDetail recipe={recipe} />

        </div>

        <div className="h-full min-h-0">

          <ChatPanel
            recipeId={Number(id)}
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