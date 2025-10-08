import os
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models

def search_with_context(query: str) -> str:

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
    context = "\n".join([hit.payload["text"] for hit in search_result])
    chat_response = client.chat.completions.create(
    model="gpt-4.1-mini",  # cheaper + fast, use gpt-4.1 for higher quality
    messages=[
        {"role": "system", "content": "You are a helpful assistant. Use the provided context to answer."},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
    ]
    )

    return chat_response.choices[0].message.content

