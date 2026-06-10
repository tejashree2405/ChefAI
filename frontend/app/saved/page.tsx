'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Recipe {
  id: number
  title: string
  description: string
  recipe_data: any
  updated_at?: string
}

export default function SavedPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchRecipes() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes`
      )

      const data = await response.json()

      setRecipes(data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  const handleDelete = async (
    recipeId: number,
    e: React.MouseEvent
  ) => {
    e.preventDefault()
    e.stopPropagation()

    const confirmed = window.confirm(
      'Delete this recipe permanently?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeId}`,
        {
          method: 'DELETE',
        }
      )

      const data = await response.json()

      if (data.success) {
        setRecipes((prev) =>
          prev.filter(
            (recipe) => recipe.id !== recipeId
          )
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3">
            Saved Recipes
          </h1>

          <p className="text-zinc-400 text-lg">
            Revisit your previously generated AI recipes.
          </p>
        </div>

        {loading ? (

          <div className="text-zinc-400">
            Loading recipes...
          </div>

        ) : recipes.length === 0 ? (

          <div className="text-zinc-500">
            No saved recipes yet.
          </div>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {recipes.map((recipe) => (

              <Link
                href={`/recipe/${recipe.id}`}
                key={recipe.id}
              >

                <div className="h-full border border-purple-500/20 bg-zinc-900 hover:bg-zinc-800 hover:border-purple-500/50 transition-all duration-300 rounded-3xl p-6 cursor-pointer">

                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">

                    <div className="w-12 h-12 rounded-2xl bg-purple-600/20 flex items-center justify-center text-2xl">
                      🍽️
                    </div>

                    <button
                      onClick={(e) =>
                        handleDelete(recipe.id, e)
                      }
                      className="text-red-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-semibold mb-3 line-clamp-2">
                    {recipe.title}
                  </h2>

                  {/* Description */}
                  <p className="text-zinc-400 leading-relaxed line-clamp-4 mb-4">
                    {recipe.description}
                  </p>

                  {/* Last Updated */}
                  {recipe.updated_at && (
                    <p className="text-xs text-zinc-500">
                      Updated{' '}
                      {new Date(
                        recipe.updated_at
                      ).toLocaleString([], {
                        day: 'numeric',
                        month: 'short',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  )}

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>
    </main>
  )
}