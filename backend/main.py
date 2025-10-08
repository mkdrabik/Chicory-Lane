from fastapi import FastAPI
from api_calls import search_with_context
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"hello": "world"}

@app.post("/ask")
def ask(query: str):
    answer = search_with_context(query)
    return {"answer": answer}


