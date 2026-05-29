'use client'

import { useState, useRef, useEffect } from 'react'

import { Send, Sparkles, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import { cn } from '@/lib/utils'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  created_at?: string
}

interface ChatPanelProps {
  recipeId: number
  recipe: any
  setRecipe: any
  messages: ChatMessage[]
  setMessages: any
}

const placeholders = [
  'Customize your recipe with AI',
  'Make it vegan, spicy, healthier',
  'Turn this into a high-protein meal',
  'Reduce calories or increase protein',
  'Make this recipe gluten-free',
  'Add more spice and flavor',
  'Convert this into an Italian-style dish',
  'Need ingredient substitutions?',
  'Make this creamy, cheesy, or extra crispy',
  'Turn this into a quick 15-minute meal',
  'Add more vegetables to this recipe',
  'Make this restaurant-quality',
]

export function ChatPanel({
  recipeId,
  recipe,
  setRecipe,
  messages,
  setMessages
}: ChatPanelProps) {

  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const [placeholderIndex, setPlaceholderIndex] =
    useState(0)

  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {

    if (scrollRef.current) {

      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight

    }

  }

  useEffect(() => {

    scrollToBottom()

  }, [messages])

  async function handleSend() {

    if (!input.trim()) return

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      created_at: new Date().toISOString()
    }

    setMessages((prev: ChatMessage[]) => [
      ...prev,
      userMessage
    ])

    const currentInput = input

    setInput('')
    setPlaceholderIndex((prev) =>
      (prev + 1) % placeholders.length
    )

    setIsTyping(true)

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/modify-recipe',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            recipe_id: recipeId, 
            recipe: recipe,
            modification: currentInput,
          }),
        }
      )

      const data = await response.json()

      setRecipe(data.recipe)

      localStorage.setItem(
        'recipe',
        JSON.stringify(data.recipe)
      )

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.assistant_message,
        created_at: new Date().toISOString()
      }

      setMessages((prev: ChatMessage[]) => [
        ...prev,
        assistantMessage
      ])

    } catch (error) {

      console.log(error)

      setMessages((prev: ChatMessage[]) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Something went wrong while updating the recipe.'
        }
      ])

    }

    setIsTyping(false)

  }

  return (

    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-card/50">

      {/* Header */}

      <div className="p-4 border-b border-border glass">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary-sm">

            <Sparkles className="w-5 h-5 text-white" />

          </div>

          <div>

            <h2 className="font-semibold text-foreground">

              AI Chef Assistant

            </h2>

            <p className="text-xs text-muted-foreground">

              Modify and customize your recipe using AI

            </p>

          </div>

        </div>

      </div>

      {/* Messages */}

      <ScrollArea className="flex-1 min-h-0 p-4">

        <div
          ref={scrollRef}
          className="space-y-4 pb-6"
        >

          {messages.map((message, index) => (

            <MessageBubble
              key={index}
              message={message}
            />

          ))}

          {isTyping && (

            <div className="flex items-start gap-3">

              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0">

                <Sparkles className="w-4 h-4 text-white" />

              </div>

              <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">

                <div className="flex gap-1">

                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce" />

                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />

                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />

                </div>

              </div>

            </div>

          )}

        </div>

      </ScrollArea>

      {/* Input */}

      <div className="p-4 border-t border-border glass">

        <div className="flex gap-2">

          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            placeholder={
              placeholders[placeholderIndex]
            }
            className="flex-1 bg-input/50 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            onKeyDown={(e) => {

              if (
                e.key === 'Enter' &&
                !e.shiftKey
              ) {

                e.preventDefault()

                handleSend()

              }

            }}
          />

          <Button
            onClick={handleSend}
            className="gradient-primary hover:opacity-90 transition-opacity h-auto px-4"
            disabled={!input.trim() || isTyping}
          >

            <Send className="w-5 h-5" />

          </Button>

        </div>

      </div>

    </div>

  )

}

function MessageBubble({
  message
}: {
  message: ChatMessage
}) {

  const isUser =
    message.role === 'user'

  return (

    <div
      className={cn(
        'flex items-start gap-3',
        isUser && 'flex-row-reverse'
      )}
    >

      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          isUser
            ? 'bg-secondary'
            : 'gradient-primary'
        )}
      >

        {isUser ? (

          <User className="w-4 h-4 text-muted-foreground" />

        ) : (

          <Sparkles className="w-4 h-4 text-white" />

        )}

      </div>

      <div
        className={cn(
          'max-w-[80%] rounded-2xl px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'glass-card rounded-tl-md'
        )}
      >

        <p
          className={cn(
            'text-sm leading-relaxed',
            !isUser && 'text-foreground'
          )}
        >
          {message.content}
        </p>

        {message.created_at && (
          <p
            className={cn(
              "text-[10px] mt-1",
              isUser
                ? "text-white/80"
                : "text-zinc-500"
            )}
          >
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        )}

      </div>

    </div>

  )

}