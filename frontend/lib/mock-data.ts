export interface Recipe {
  title: string
  description: string
  prep_time: string
  cook_time: string
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
  tags?: string[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

/*
  EMPTY PLACEHOLDER RECIPE

  Real recipe data will come from:
  FastAPI backend → Groq AI
*/

export const mockRecipe: Recipe = {
  title: '',
  description: '',
  prep_time: '',
  cook_time: '',
  servings: 0,
  difficulty: '',
  ingredients: [],
  instructions: []
}

/*
  EMPTY CHAT HISTORY

  Real messages will later come from:
  AI chat + PostgreSQL
*/

export const mockChatHistory: ChatMessage[] = []