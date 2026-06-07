import json

with open(
    "knowledge_base/substitutions/substitutions.json",
    "r",
    encoding="utf-8"
) as f:

    SUBSTITUTION_DB = json.load(f)


def find_substitutions(ingredient):

    ingredient = ingredient.lower()

    for item in SUBSTITUTION_DB:

        if item["ingredient"].lower() == ingredient:

            return item["substitutes"]

    return []
