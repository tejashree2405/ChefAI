# 🍳 ChefAI

<div align="center">

## AI-Powered Recipe Generation & Intelligent Cooking Assistant

Generate recipes from ingredients, modify them through natural language, retrieve cooking knowledge using RAG, and receive nutrition, allergy, and substitution guidance through AI-powered tools.

Built using **Next.js**, **FastAPI**, **PostgreSQL**, **Groq LLMs**, **ChromaDB**, **Retrieval-Augmented Generation (RAG)**, **Conversational Memory**, and **Tool-Augmented AI Workflows**.

</div>

---

# Overview

ChefAI is a full-stack AI application that transforms ingredients into complete recipes and allows users to iteratively improve them through natural language conversations.

Unlike traditional recipe generators, ChefAI combines:

* Conversational Memory
* Retrieval-Augmented Generation (RAG)
* Vector Search
* Tool-Augmented Reasoning
* Multi-Tool Routing
* Persistent Storage

to create a more intelligent cooking assistant.

---

## Home Page

The landing page allows users to enter ingredients and instantly generate recipes using AI.

![Home Page](screenshots/home.png)

---

# Features

ChefAI enables users to:

* Generate recipes from ingredients
* Modify recipes conversationally
* Ask nutrition-related questions
* Detect allergens
* Request ingredient substitutions
* Retrieve cooking knowledge using RAG
* Save recipes and conversations
* Continue recipe-specific chats

![Features](screenshots/features.png)

---

# AI Recipe Generation

Users can provide ingredients available in their kitchen.

Example:

```text
Chicken, garlic, rice, tomatoes
```

ChefAI generates:

* Recipe Title
* Description
* Ingredients
* Instructions
* Prep Time
* Cook Time
* Difficulty
* Tags

![Recipe Generation](screenshots/recipe-generation.png)

---

# Conversational Recipe Editing

Generated recipes can be modified using natural language.

Examples:

```text
Make this vegan
Increase protein
Reduce calories
Replace eggs
Make it keto
```

The AI updates the recipe while maintaining context from previous modifications.

![Recipe Modification](screenshots/recipe-modification.png)

---

# Dietary Adaptation

ChefAI can adapt recipes based on dietary preferences.

Supported modifications include:

* Vegan
* Vegetarian
* High Protein
* Gluten Free
* Keto

![Dietary Adaptation](screenshots/vegan-conversion.png)

---

# Nutrition Analysis Tool

ChefAI includes a dedicated Nutrition Tool capable of calculating:

* Calories
* Protein
* Carbohydrates
* Fat

Users can ask:

```text
How much protein?
How many calories?
Reduce calories
Make this high protein
```

![Nutrition Analysis](screenshots/nutrition-analysis.png)

---

# Ingredient Substitution Tool

ChefAI provides intelligent ingredient substitutions when ingredients are unavailable.

Examples:

```text
Replace eggs
What can replace tofu?
Dairy-free alternatives
```

![Ingredient Substitutions](screenshots/substitutions.png)

---

# Saved Recipes

Generated recipes and chat history are stored permanently and can be revisited later.

Users can:

* Browse saved recipes
* Continue previous conversations
* Track recipe modifications

![Saved Recipes](screenshots/saved-recipes.png)

---

# Conversational Memory

Recipe-specific conversations are stored in PostgreSQL.

This allows ChefAI to remember:

* Previous modifications
* User decisions
* Earlier recommendations

during future interactions.

![Conversation Memory](screenshots/conversation-memory.png)

---

# How ChefAI Works

## Recipe Generation Flow

```text
User Ingredients
        │
        ▼
Next.js Frontend
        │
        ▼
FastAPI Backend
        │
        ▼
Groq LLM (Llama 3.3 70B)
        │
        ▼
Structured Recipe JSON
        │
        ▼
PostgreSQL Storage
        │
        ▼
Frontend Display
```

---

## Recipe Modification Flow

```text
User Request
        │
        ▼
Conversation Memory
        │
        ▼
RAG Retrieval
        │
        ▼
Multi-Tool Router
        │
        ▼
Nutrition Tool
Allergy Tool
Substitution Tool
        │
        ▼
Groq LLM
        │
        ▼
Updated Recipe
        │
        ▼
PostgreSQL Update
```

---

# Retrieval-Augmented Generation (RAG)

ChefAI uses ChromaDB and embeddings to retrieve cooking-related knowledge before generating responses.

Knowledge sources include:

```text
knowledge_base/
│
├── allergies/
├── cuisines/
├── diets/
├── flavor_pairings/
├── ingredients/
│   ├── nutrition
│   ├── categories
│   └── storage
│
└── substitutions/
```

The documents are embedded and indexed into ChromaDB for semantic retrieval.

---

# Tech Stack

| Category           | Technology                           |
| ------------------ | ------------------------------------ |
| Frontend Framework | Next.js                              |
| Frontend Language  | TypeScript                           |
| UI Styling         | Tailwind CSS                         |
| Backend Framework  | FastAPI                              |
| Backend Language   | Python                               |
| ORM                | SQLAlchemy                           |
| Database           | PostgreSQL                           |
| LLM Provider       | Groq                                 |
| Model              | Llama 3.3 70B Versatile              |
| Vector Database    | ChromaDB                             |
| Embeddings         | Sentence Transformers                |
| AI Pattern         | Retrieval-Augmented Generation (RAG) |
| Memory Layer       | PostgreSQL Chat History              |
| Tool Routing       | Custom Multi-Tool Router             |
| Authentication     | Planned                              |
| Deployment         | Local Development                    |

---

# Database Design

ChefAI uses PostgreSQL to persist application data.

## Recipes

Stores:

* Recipe Title
* Description
* Recipe JSON
* Created Timestamp
* Updated Timestamp

## Chat Messages

Stores:

* User Messages
* Assistant Responses
* Recipe Association
* Message Timestamps

This enables recipe-specific conversational memory.

---

# Project Structure

```text
ChefAI/
│
├── backend/
│   ├── knowledge_base/
│   ├── tools/
│   │   ├── nutrition_tool.py
│   │   ├── allergy_tool.py
│   │   └── substitution_tool.py
│   │
│   ├── main.py
│   ├── models.py
│   ├── database.py
│   ├── ingest_docs.py
│   ├── requirements.txt
│   │
│   └── chroma_db/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── public/
│
├── screenshots/
│
├── README.md
│
└── .gitignore
```

---

# Installation Guide

## 1. Clone Repository

```bash
git clone https://github.com/tejashree2405/ChefAI.git

cd ChefAI
```

---

## 2. Backend Setup

Navigate to backend:

```bash
cd backend
```

Create virtual environment:

### Windows

```bash
python -m venv venv

venv\Scripts\activate
```

### Linux / Mac

```bash
python3 -m venv venv

source venv/bin/activate
```

---

## 3. Install Python Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create:

```text
backend/.env
```

Add:

```env
GROQ_API_KEY=your_groq_api_key

DATABASE_URL=postgresql://username:password@localhost:5432/chefai
```

---

## 5. Create PostgreSQL Database

Create a PostgreSQL database named:

```text
chefai
```

Update the DATABASE_URL inside `.env`.

---

## 6. Build the Vector Database

Generate embeddings and populate ChromaDB:

```bash
python ingest_docs.py
```

This creates:

```text
backend/chroma_db/
```

---

## 7. Start Backend Server

```bash
uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

## 8. Frontend Setup

Open a new terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

---

## 9. Start Frontend

```bash
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# Testing

## Test RAG

```bash
python rag_test.py
```

## Test Nutrition Tool

```bash
python test_tool.py
```

## Test Allergy Tool

```bash
python test_allergy_tool.py
```

## Test Substitution Tool

```bash
python test_substitution_tool.py
```

---

# AI Engineering Concepts Demonstrated

* Prompt Engineering
* Retrieval-Augmented Generation (RAG)
* Embeddings
* Semantic Search
* Vector Databases
* Conversational Memory
* Tool-Augmented LLMs
* Multi-Tool Routing
* Context Engineering
* Structured JSON Outputs
* Full-Stack AI Application Development

---


# Author

**Tejashree V**
If you want to share anything or just connect with me in general, I would love to hear your thoughts! Here is my LinkedIn, please feel free to reach out!

https://www.linkedin.com/in/tejashree-v/

---

⭐ If you found this project interesting, consider starring the repository.
