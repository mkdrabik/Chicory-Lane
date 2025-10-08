from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api_calls import search_with_context

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

@app.post("/ask")
def ask(request: AskRequest):
    answer = search_with_context(request.query)
    return {"answer": answer}


@app.get("/")
def root():
    return {"hello": "world"}
