from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api_calls import search_with_context, add_document

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://chicorylane.netlify.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    query: str
    format: str = "paragraph"

@app.post("/ask")
def ask(request: AskRequest):
    answer = search_with_context(request.query, request.format)
    return {"answer": answer}

@app.post("/upload")
async def upload(
    file: UploadFile = File(...),
    document_name: str = Form(None) 
):
    if file.content_type != "text/plain":
        raise HTTPException(400, detail="Invalid file type. Only .txt files are allowed.")
    
    name = document_name or file.filename or "Untitled Document"
    
    content = await file.read()
    add_document(content.decode("utf-8"), name)
    
    return {"message": f"File '{name}' uploaded successfully"}

@app.get("/documents")
def get_documents():
    load_dotenv()
    qdrant = QdrantClient(
        url=os.environ["QDRANT_URL"],
        api_key=os.environ["QDRANT_API_KEY"]
    )

    COLLECTION_NAME = "chicorylane"
    documents = set()
    scroll = qdrant.scroll(collection_name=COLLECTION_NAME, limit=200)
    points, _ = scroll

    for point in points:
        if "filename" in point.payload:
            documents.add(point.payload["filename"])

    return {"documents": list(documents)}


@app.get("/")
def root():
    return {"hello": "world"}