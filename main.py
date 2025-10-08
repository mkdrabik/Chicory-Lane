from fastapi import FastAPI
from api_calls import search_with_context   

app = FastAPI()

@app.get("/")
def root():
    return {"hello": "world"}

@app.post("/ask")
def ask(query: str):
    answer = search_with_context(query)
    return {"answer": answer}


