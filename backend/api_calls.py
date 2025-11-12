import os
import uuid
from dotenv import load_dotenv
from openai import OpenAI
from qdrant_client import QdrantClient
from qdrant_client.http import models

def add_document(content: str, filename: str):
    load_dotenv()
    client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
    qdrant = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"]
    )
    COLLECTION_NAME = "chicorylane"

    chunks = content.split('\n\n')
    points = []

    for i, chunk in enumerate(chunks):
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
                payload={
                    "text": chunk,
                    "filename": filename, 
                    "chunk_index": i
                }
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


def get_all_documents():
    """Fetch all unique document filenames stored in Qdrant."""
    load_dotenv()
    qdrant = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"]
    )

    COLLECTION_NAME = "chicorylane"
    documents = set()

    try:
        scroll = qdrant.scroll(collection_name=COLLECTION_NAME, limit=200)
        points, _ = scroll

        for point in points:
            if "filename" in point.payload:
                documents.add(point.payload["filename"])

        return list(documents)

    except Exception as e:
        print("❌ Error retrieving documents:", e)
        raise

def delete_document(filename: str):
    """Delete all points associated with a given filename."""
    import os
    from dotenv import load_dotenv
    from qdrant_client import QdrantClient
    from qdrant_client.http import models

    load_dotenv()
    qdrant = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"]
    )
    points, _ = qdrant.scroll(collection_name="chicorylane", limit=5)
    for p in points:
        print(p.payload)
    COLLECTION_NAME = "chicorylane"

    try:
        indexes = qdrant.get_collection(COLLECTION_NAME).payload_schema
        if "filename" not in indexes:
            print("Creating index for 'filename'...")
            qdrant.create_payload_index(
                collection_name=COLLECTION_NAME,
                field_name="filename",
                field_schema=models.PayloadSchemaType.KEYWORD
            )
        delete_filter = models.Filter(
            must=[
                models.FieldCondition(
                    key="filename",
                    match=models.MatchValue(value=filename)
                )
            ]
        )
        points, _ = qdrant.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter=delete_filter,
            limit=10
        )
        if not points:
            print(f"❌ No documents found matching filename '{filename}'. Check key name and value.")
            return

        print(f"Found {len(points)} points to delete.")
        qdrant.delete(
            collection_name=COLLECTION_NAME,
            points_selector=models.FilterSelector(filter=delete_filter)
        )
        print(f"✅ Deleted all points for '{filename}'.")
        return {"message": f"Deleted {len(points)} points for '{filename}'."}

    except Exception as e:
        print("❌ Error deleting document:", e)
        raise


    
def get_documents_paginated(limit: int = 50, offset: int = 0):
    """Fetch paginated document filenames from Qdrant."""
    load_dotenv()
    qdrant = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"]
    )

    COLLECTION_NAME = "chicorylane"
    documents = []
    scroll_offset = None
    fetched = 0

    try:
        while fetched < (offset + limit):
            # Scroll through chunks of 200
            points, scroll_offset = qdrant.scroll(
                collection_name=COLLECTION_NAME,
                limit=200,
                offset=scroll_offset
            )

            if not points:
                break

            for p in points:
                if "filename" in p.payload:
                    documents.append(p.payload["filename"])

            if scroll_offset is None:
                break

        # Unique filenames, sliced by offset/limit
        docs_unique = sorted(set(documents))
        paginated = docs_unique[offset : offset + limit]
        return {
            "documents": paginated,
            "total": len(docs_unique),
            "limit": limit,
            "offset": offset,
        }

    except Exception as e:
        print("❌ Error paginating documents:", e)
        raise
