from fastapi import FastAPI
from sentence_transformers import SentenceTransformer
import uvicorn


app = FastAPI()
model = SentenceTransformer("all-mpnet-base-v2")

@app.get("/healthcheck")
async def healthcheck():
    """
    Healthcheck endpoint.
    Returns a simple JSON response to indicate if the API is running.
    This is used for monitoring or readiness probes.
    """
    return {"status": "ok"}

@app.get("/")
async def query(query: str):
    """
    Embedding endpoint.
    Takes a query string as input, encodes it using the transformer model,
    and returns the embedding as a list of floats.

    Query Parameters:
        - query (str): Input text to be embedded.

    Returns:
        - dict: JSON response containing the computed embedding.
    """
    return {"embedding": model.encode(query).tolist()}


if __name__ == "__main__":
    # Run the FastAPI application using Uvicorn.
    # Listens on all available network interfaces (0.0.0.0) at port 8000.
    uvicorn.run(app, host="0.0.0.0", port=8000)
