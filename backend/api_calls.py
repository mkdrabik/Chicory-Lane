import os
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models

def search_with_context(query: str, format: str) -> str:
    format_instruction = (
    "Respond in bullet points." if format == "points"
    else "Respond in a detailed paragraph."
    )

    load_dotenv()
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    qdrant = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"]
    )

    COLLECTION_NAME = "chicorylane"
    query = query
    query_emb = client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    ).data[0].embedding

    search_result = qdrant.search(
        collection_name=COLLECTION_NAME,
        query_vector=query_emb,
        limit=3
    )

    context = "\n".join([hit.payload["text"] for hit in search_result if hit.payload and "text" in hit.payload])

    # Ask ChatGPT with context
    chat_response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {"role": "system", "content": f"You are a helpful assistant. Use the provided context to answer. {format_instruction}"},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
    ]
)


    return chat_response.choices[0].message.content # type: ignore
