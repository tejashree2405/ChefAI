import json

with open(
    "knowledge_base/ingredients/ingredient_nutrition.json",
    "r",
    encoding="utf-8"
) as f:

    NUTRITION_DB = json.load(f)


def calculate_macros(ingredients):

    total = {
        "protein": 0,
        "carbs": 0,
        "fat": 0,
        "calories": 0
    }

    for ingredient in ingredients:

        ingredient = ingredient.lower()

        for item in NUTRITION_DB:

            if item["name"].lower() == ingredient:

                total["protein"] += item["protein_per_100g"]
                total["carbs"] += item["carbs_per_100g"]
                total["fat"] += item["fat_per_100g"]
                total["calories"] += item["calories_per_100g"]

    return total
