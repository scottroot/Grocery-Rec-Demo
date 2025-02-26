from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import uvicorn


app = FastAPI()
model = SentenceTransformer("all-mpnet-base-v2")

@app.get("/")
async def query(query: str):
    return {"embedding": model.encode(query).tolist()}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
