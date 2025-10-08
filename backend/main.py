from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from api_calls import search_with_context

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
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
