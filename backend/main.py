from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from pydantic import BaseModel
import secrets
from api_calls import search_with_context, add_document, get_documents_paginated, delete_document

app = FastAPI()

# It is strongly recommended to use environment variables for credentials
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "your_strong_password"

security = HTTPBasic()

def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

origins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://chicorylane.netlify.app",
    "https://chicorylane.com",
    "https://www.chicorylane.com"
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

#Endpoint to handle preflight OPTIONS request for /ask
@app.options("/ask")
def ask_preflight():
    return Response(status_code=204)

#Endpoint to handle POST request for /ask
@app.post("/ask")
def ask(request: AskRequest):
    answer = search_with_context(request.query, request.format)
    return {"answer": answer}

#Endpoint to handle preflight OPTIONS request for /upload
@app.options("/upload")
async def upload_preflight():
    return Response(status_code=204)

#Endpoint to handle POST request for /upload
@app.post("/upload")
async def upload(
    file: UploadFile = File(...),
    document_name: str = Form(None),
    username: str = Depends(get_current_username)
):
    # Disallow PDF files
    if file.content_type == "application/pdf":
        raise HTTPException(400, detail="PDF files are not allowed.")

    # Allow any file with a .txt extension
    if file.filename.endswith(".txt"):
        pass
    # For other files, check if they are text-based
    elif not file.content_type.startswith("text/"):
        raise HTTPException(400, detail="Invalid file type. Only text files are allowed.")

    name = document_name or file.filename or "Untitled Document"
    
    content = await file.read()
    
    # Try to decode as utf-8
    try:
        content = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(400, detail="File is not a valid UTF-8 encoded text file.")

    add_document(content, name)
    
    return {"message": f"File '{name}' uploaded successfully"}

#Endpoint to handle GET request for /documents
@app.get("/documents")
def list_documents(limit: int = 50, offset: int = 0):
    """Return paginated document list."""
    try:
        result = get_documents_paginated(limit, offset)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

#Endpoint to handle DELETE request for /documents/{filename}
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
