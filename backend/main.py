from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import Response
from api_calls import search_with_context, add_document, get_documents_paginated, delete_document

app = FastAPI()

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://chicorylane.netlify.app",
    "https://chicorylane.com"
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

@app.options("/ask")
def ask_preflight():
    return Response(status_code=204)

@app.post("/ask")
def ask(request: AskRequest):
    answer = search_with_context(request.query, request.format)
    return {"answer": answer}

@app.options("/upload")
async def upload_preflight():
    return Response(status_code=204)

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
def list_documents(limit: int = 50, offset: int = 0):
    """Return paginated document list."""
    try:
        result = get_documents_paginated(limit, offset)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{filename}")
def remove_document(filename: str):
    """Delete all vectors for a given document filename."""
    try:
        result = delete_document(filename)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"hello": "world"}