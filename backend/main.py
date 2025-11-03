from fastapi import FastAPI, UploadFile, File, HTTPException
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
async def upload(file: UploadFile = File(...)):
    if file.content_type != "text/plain":
        raise HTTPException(400, detail="Invalid file type. Only .txt files are allowed.")
    content = await file.read()
    add_document(content.decode("utf-8"))
    return {"message": "File uploaded successfully"}



@app.get("/")
def root():
    return {"hello": "world"}
