import os
import json
import ast
import chromadb

from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from database import SessionLocal, engine
from models import Recipe, ChatMessage, Base

def route_tools(user_message: str):

    router_prompt = f"""
    You are a tool router.

    Available tools:

    - nutrition
      Use when the user asks about:
      calories, protein, carbs, fat, nutrition,
      weight loss, muscle gain, bulking,
      healthy meals, macros

    - allergy
      Use when the user mentions:
      allergies, allergic, dairy allergy,
      nut allergy, gluten allergy, food safety

    - substitution
      Use when the user wants:
      replacements, alternatives,
      substitutes, swaps, ingredient changes

    IMPORTANT:
    - You may return MULTIPLE tools.
    - Return every tool that would help answer the request.
    - Return ONLY valid JSON.
    - Do not explain your reasoning.

    Examples:

    User:
    "How many calories are in this recipe?"

    Response:
    {{
        "tools": ["nutrition"]
    }}

    User:
    "Replace eggs in this recipe"

    Response:
    {{
        "tools": ["substitution"]
    }}

    User:
    "I have a dairy allergy and want a high protein meal"

    Response:
    {{
        "tools": ["allergy", "nutrition"]
    }}

    User:
    "Replace dairy ingredients and make this high protein"

    Response:
    {{
        "tools": ["substitution", "nutrition"]
    }}

    User Request:

    {user_message}
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": router_prompt
            }
        ]
    )

    response = completion.choices[0].message.content

    response = response.replace("```json", "")
    response = response.replace("```", "")
    response = response.strip()

    try:

        result = json.loads(response)

        return result.get("tools", [])

    except Exception:

        print("Router failed")
        print(response)

        return []

from tools.nutrition_tool import calculate_macros
from tools.allergy_tool import check_allergens
from tools.substitution_tool import find_substitutions

# Load environment variables
load_dotenv()


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# Create FastAPI app
app = FastAPI()


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database session helper
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# =========================
# REQUEST MODELS
# =========================

class IngredientsInput(BaseModel):
    ingredients: list[str]


class ModifyRecipeInput(BaseModel):
    recipe_id: int
    recipe: dict
    modification: str


# =========================
# HOME ROUTE
# =========================

@app.get("/")
def home():

    return {
        "message": "AI Chef Backend Running"
    }


# =========================
# GENERATE RECIPE
# =========================

@app.post("/generate-recipe")
def generate_recipe(data: IngredientsInput):

    ingredients_text = ", ".join(data.ingredients)

    prompt = f"""
    Generate ONE recipe using these ingredients:

    {ingredients_text}

    Return ONLY valid JSON.

    Use this EXACT structure:

    {{
      "title": "",
      "description": "",
      "prep_time": "",
      "cook_time": "",
      "servings": 0,
      "difficulty": "",
      "ingredients": [],
      "instructions": [],
      "tags": []
    }}

    RULES:
    - tags must always be an array of strings
    - ingredients must always be array of strings
    - instructions must always be array of strings
    - Return RAW JSON only
    - No markdown
    - No ```json
    """

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    response_text = completion.choices[0].message.content

    cleaned_response = response_text.strip()

    cleaned_response = cleaned_response.replace("```json", "")
    cleaned_response = cleaned_response.replace("```", "")

    print(cleaned_response)

    try:

        recipe_json = json.loads(cleaned_response)

    except json.JSONDecodeError:

        try:

            recipe_json = ast.literal_eval(cleaned_response)

        except Exception:

            return {
                "error": "Invalid JSON returned by model",
                "raw_response": cleaned_response
            }

    # Save to database
    db = SessionLocal()

    db_recipe = Recipe(

        title=recipe_json["title"],

        description=recipe_json["description"],

        recipe_data=recipe_json

    )

    db.add(db_recipe)

    db.commit()

    db.refresh(db_recipe)

    db.close()

    return {
        "recipe_id": db_recipe.id,
        "recipe": recipe_json
    }


# =========================
# MODIFY RECIPE
# =========================

@app.post("/modify-recipe")
def modify_recipe(data: ModifyRecipeInput):
    chroma_client = chromadb.PersistentClient(
        path="./chroma_db"
    )

    collection = chroma_client.get_collection(
        "chefai_knowledge"
    )
    results = collection.query(
        query_texts=[data.modification],
        n_results=1
    )

    retrieved_context = "\n\n".join(
        results["documents"][0]
    )

    db = SessionLocal()
    previous_messages = (
        db.query(ChatMessage)
        .filter(
            ChatMessage.recipe_id == data.recipe_id
        )
        .order_by(ChatMessage.id.asc())
        .all()
    )
    chat_history = []

    for msg in previous_messages:

        chat_history.append({
            "role": msg.role,
            "content": msg.content
        })
        
    existing_recipe = (
        db.query(Recipe)
        .filter(Recipe.id == data.recipe_id)
        .first()
        )
    
    tool_context = ""

    selected_tools = route_tools(
        data.modification
    )

    print("TOOLS SELECTED:")
    print(selected_tools)

    if "nutrition" in selected_tools:

        print("NUTRITION TOOL CALLED")

        nutrition_result = calculate_macros(
            data.recipe.get("ingredients", [])
        )

        print(nutrition_result)

        tool_context += f"""

    Nutrition Analysis:

    {nutrition_result}

    """
        
    if "allergy" in selected_tools:

        print("ALLERGY TOOL CALLED")

        allergy_result = check_allergens(
            data.recipe.get("ingredients", [])
        )

        print(allergy_result)

        tool_context += f"""

    Allergy Analysis:

    {allergy_result}

    """
        
    if "substitution" in selected_tools:

        print("SUBSTITUTION TOOL CALLED")

        substitutions = {}

        for ingredient in data.recipe.get("ingredients", []):

            result = find_substitutions(
                ingredient
            )

            if result:

                substitutions[ingredient] = result

        print(substitutions)

        tool_context += f"""

    Available Substitutions:

    {substitutions}

    """
    
    prompt = f"""
    You are an AI cooking assistant.

    The user may:
    - modify the recipe
    - ask substitutions
    - ask cooking questions
    - ask dietary changes
    - ask if ingredients are okay

    Here is the current recipe JSON:

    {json.dumps(data.recipe, indent=2)}

    User request:
    "{data.modification}"

    Return ONLY valid JSON.

    Use this EXACT structure:

    {{
      "assistant_message": "",
      "recipe": {{
        "title": "",
        "description": "",
        "prep_time": "",
        "cook_time": "",
        "servings": 0,
        "difficulty": "",
        "ingredients": [],
        "instructions": [],
        "tags": []
      }}
    }}

    RULES:
    - assistant_message should sound natural and conversational
    - If the recipe does not need changing, return the original recipe
    - tags must always be an array of strings
    - ingredients must always be array of strings
    - instructions must always be array of strings
    - Return RAW JSON only
    - No markdown
    - No ```json

    You are ChefAI.
    Remember the conversation history
    when modifying recipes.

    Relevant Knowledge:

    {retrieved_context} 

    Tool Results:

    {tool_context}
    """
    print(retrieved_context)

    groq_messages = [
        {
            "role": "system",
            "content": prompt
        }
    ]

    groq_messages.extend(chat_history)

    groq_messages.append(
        {
            "role": "user",
            "content": data.modification
        }
    )

    completion = client.chat.completions.create(

        model="llama-3.3-70b-versatile",

        messages=groq_messages
    )   

    response_text = completion.choices[0].message.content

    cleaned_response = response_text.strip()

    cleaned_response = cleaned_response.replace("```json", "")
    cleaned_response = cleaned_response.replace("```", "")

    print(cleaned_response)

    try:

        response_json = json.loads(cleaned_response)

    except json.JSONDecodeError:

        try:

            response_json = ast.literal_eval(cleaned_response)

        except Exception:

            return {
                "error": "Invalid JSON returned by model",
                "raw_response": cleaned_response
            }

    # Save updated recipe to database
   # Update existing recipe instead of creating a new one

    if not existing_recipe:
        db.close()
        return {"error": "Recipe not found"}

    existing_recipe.title = response_json["recipe"]["title"]

    existing_recipe.description = response_json["recipe"]["description"]

    existing_recipe.recipe_data = response_json["recipe"]
    existing_recipe.updated_at = datetime.utcnow()

    db.commit()

    db.refresh(existing_recipe)

    user_chat = ChatMessage(

        role="user",

        content=data.modification,

        recipe_id=existing_recipe.id

    )

    assistant_chat = ChatMessage(

        role="assistant",

        content=response_json["assistant_message"],

        recipe_id=existing_recipe.id

    )

    db.add(user_chat)

    db.add(assistant_chat)

    db.commit()

    db.close()

    return response_json

@app.get("/recipes")
def get_recipes():

    db = SessionLocal()

    recipes = (
        db.query(Recipe)
        .order_by(Recipe.updated_at.desc())
        .all()
    )

    db.close()

    return recipes

@app.get("/recipes/{recipe_id}")
def get_recipe(recipe_id: int):

    db = SessionLocal()

    recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id
    ).first()

    db.close()

    if not recipe:

        return {
            "error": "Recipe not found"
        }

    return recipe

@app.get("/recipes/{recipe_id}/messages")
def get_messages(recipe_id: int):

    db = SessionLocal()

    messages = db.query(ChatMessage).filter(
        ChatMessage.recipe_id == recipe_id
    ).all()

    db.close()

    return messages

@app.get("/recipe/{recipe_id}")
def get_recipe(recipe_id: int):

    db = SessionLocal()

    recipe = db.query(Recipe).filter(
        Recipe.id == recipe_id
    ).first()

    if not recipe:

        db.close()

        return {
            "error": "Recipe not found"
        }

    messages = db.query(ChatMessage).filter(
        ChatMessage.recipe_id == recipe_id
    ).all()

    formatted_messages = []

    for message in messages:

        formatted_messages.append({
            "role": message.role,
            "content": message.content,
            "created_at": message.created_at.isoformat()
        })

    db.close()

    return {
        "recipe": recipe.recipe_data,
        "messages": formatted_messages
    }

@app.delete("/recipes/{recipe_id}")
def delete_recipe(recipe_id: int):

    db = SessionLocal()

    recipe = (
        db.query(Recipe)
        .filter(Recipe.id == recipe_id)
        .first()
    )

    if not recipe:

        db.close()

        return {
            "error": "Recipe not found"
        }

    db.query(ChatMessage).filter(
        ChatMessage.recipe_id == recipe_id
    ).delete()

    db.delete(recipe)

    db.commit()

    db.close()

    return {
        "success": True
    }

class NutritionInput(BaseModel):
    ingredients: list[str]

@app.post("/analyze-nutrition")
def analyze_nutrition(data: NutritionInput):

    result = calculate_macros(
        data.ingredients
    )

    return result

class AllergyInput(BaseModel):
    ingredients: list[str]

@app.post("/check-allergies")
def check_recipe_allergies(data: AllergyInput):

    result = check_allergens(
        data.ingredients
    )

    return {
        "allergens_found": result
    }