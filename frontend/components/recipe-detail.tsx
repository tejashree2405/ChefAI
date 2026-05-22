import { Clock, Users, ChefHat, Tag } from 'lucide-react'
import { Recipe } from '@/lib/mock-data'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'

interface RecipeDetailProps {
  recipe: Recipe
}

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {recipe.tags?.map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 text-balance">
            {recipe.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-pretty">
            {recipe.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <MetaCard 
            icon={<Clock className="w-5 h-5" />}
            label="Prep Time"
            value={recipe.prep_time}
          />
          <MetaCard 
            icon={<Clock className="w-5 h-5" />}
            label="Cook Time"
            value={recipe.cook_time}
          />
          <MetaCard 
            icon={<Users className="w-5 h-5" />}
            label="Servings"
            value={`${recipe.servings} people`}
          />
          <MetaCard 
            icon={<ChefHat className="w-5 h-5" />}
            label="Difficulty"
            value={recipe.difficulty}
          />
        </div>

        {/* Ingredients */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">#</span>
            </span>
            Ingredients
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient: any, index: number) => (

              <li key={index}>

                {typeof ingredient === "string"
                  ? ingredient
                  : `${ingredient.quantity} ${ingredient.name}`}

              </li>

            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-sm font-bold">!</span>
            </span>
            Instructions
          </h2>
          <ol className="space-y-6">
            {recipe.instructions.map((instruction, index) => (
              <li 
                key={index}
                className="flex gap-4"
              >
                <span className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {index + 1}
                </span>
                <p className="text-foreground/90 pt-1 leading-relaxed">{instruction}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </ScrollArea>
  )
}

function MetaCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode
  label: string
  value: string 
}) {
  return (
    <div className="glass-card rounded-xl p-4 text-center">
      <div className="text-primary mb-2 flex justify-center">{icon}</div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}
