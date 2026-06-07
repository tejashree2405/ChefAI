import json

with open(
    "knowledge_base/allergies/allergies.json",
    "r",
    encoding="utf-8"
) as f:

    ALLERGY_DB = json.load(f)


def check_allergens(ingredients):

    found_allergens = []

    for ingredient in ingredients:

        ingredient = ingredient.lower()

        for allergen in ALLERGY_DB:

            allergen_name = allergen["allergen"]

            aliases = [
                alias.lower()
                for alias in allergen["aliases"]
            ]

            avoid_ingredients = [
                item.lower()
                for item in allergen["avoid_ingredients"]
            ]

            if (
                ingredient == allergen_name.lower()
                or ingredient in aliases
                or ingredient in avoid_ingredients
            ):

                found_allergens.append({
                    "ingredient": ingredient,
                    "allergen": allergen_name,
                    "symptoms": allergen["symptoms"]
                })

    return found_allergens
