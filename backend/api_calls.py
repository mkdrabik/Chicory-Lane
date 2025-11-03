import os
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models
import uuid

def add_document(content: str):
    load_dotenv()
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    qdrant = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"]
    )
    COLLECTION_NAME = "chicorylane"

    # Split text into chunks (e.g., by paragraph)
    chunks = content.split('\n\n')

    points = []
    for chunk in chunks:
        if not chunk.strip():
            continue
        embedding = client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        ).data[0].embedding

        points.append(
            models.PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={"text": chunk}
            )
        )

    if points:
        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=points,
            wait=True
        )

def search_with_context(query: str, format: str) -> str:
    format_instruction = (
    "Respond in bullet points using Markdown `-` or `*`."
    if format == "points"
    else "Respond in full paragraphs with no bullet points, no dashes, and no list formatting. Do not use `-` or `*`."
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
    context = "\n".join([hit.payload["text"] for hit in search_result])
    chat_response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[
        {"role": "system", "content": f"You are a helpful assistant. Use the provided context to answer. {format_instruction} Always answer in the chosen format."},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"}
    ]
)


    return chat_response.choices[0].message.content # type: ignore
