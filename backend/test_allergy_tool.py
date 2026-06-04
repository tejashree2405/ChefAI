from tools.allergy_tool import check_allergens

ingredients = [
    "Milk",
    "Tofu",
    "Almonds",
    "Rice"
]

result = check_allergens(
    ingredients
)

print(result)