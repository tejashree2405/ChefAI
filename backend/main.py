import os
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
import json
import ast

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Chef Backend Running"}

class IngredientsInput(BaseModel):
    ingredients: list[str]

class ModifyRecipeInput(BaseModel):
    recipe: dict
    modification: str

@app.post("/generate-recipe")
def generate_recipe(data: IngredientsInput):

    ingredients_text = ", ".join(data.ingredients)

    prompt = f"""
    Generate ONE recipe using these ingredients:
    {ingredients_text}

    Return ONLY valid JSON.

    Use this exact structure:

    {{
      "title": "",
      "description": "",
      "prep_time": "",
      "cook_time": "",
      "servings": 0,
      "difficulty": "",
      "ingredients": [],
      "instructions": []
    }}

    Do not include markdown.
    Do not include ```json.
    Return raw JSON only.
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

    return recipe_json

@app.post("/modify-recipe")
def modify_recipe(data: ModifyRecipeInput):

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

        response_json = json.loads(cleaned_response)

    except json.JSONDecodeError:

        try:

            response_json = ast.literal_eval(cleaned_response)

        except Exception:

            return {
                "error": "Invalid JSON returned by model",
                "raw_response": cleaned_response
            }

    return response_json
