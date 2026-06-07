from tools.nutrition_tool import calculate_macros

ingredients = [
    "Chicken Breast",
    "Rice"
]

result = calculate_macros(
    ingredients
)

print(result)