import os
import chromadb

from groq import Groq
from dotenv import load_dotenv

# Load .env
load_dotenv()

# Connect to Groq
groq_client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# Connect to ChromaDB
client = chromadb.PersistentClient(
    path="./chroma_db"
)

# Open collection
collection = client.get_collection(
    name="chefai_knowledge"
)

# Ask question
question = input("Ask a question: ")

# Retrieve relevant documents
results = collection.query(
    query_texts=[question],
    n_results=1
)

# Extract retrieved context
retrieved_context = results["documents"][0][0]

print("\nRetrieved Context:\n")
print(retrieved_context)

# Build RAG prompt
prompt = f"""
You are ChefAI.

Use ONLY the information below when answering.

Knowledge Base:

{retrieved_context}

User Question:

{question}
"""

# Send to Groq
completion = groq_client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[
        {
            "role": "user",
            "content": prompt
        }
    ]
)

# Print answer
print("\nAI Answer:\n")

print(
    completion
    .choices[0]
    .message
    .content
)