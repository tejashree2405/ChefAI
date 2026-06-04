import chromadb
from pathlib import Path

# Create/Open Chroma database
client = chromadb.PersistentClient(
    path="./chroma_db"
)

# Create/Open collection
collection = client.get_or_create_collection(
    name="chefai_knowledge"
)

# Folder containing documents
docs_folder = Path("./knowledge_base")

# Read every .txt file
for file in docs_folder.glob("*.txt"):

    content = file.read_text(
        encoding="utf-8"
    )

    collection.add(
        documents=[content],
        ids=[file.stem]
    )

    print(f"Added: {file.name}")

print("\nKnowledge base created successfully!")