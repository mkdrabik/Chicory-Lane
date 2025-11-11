from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import Response
from api_calls import search_with_context, add_document, get_all_documents

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
def documents():
    try:
        docs = get_all_documents()
        return {"documents": docs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.get("/")
def root():
    return {"hello": "world"}