from sentence_transformers import SentenceTransformer
import os


MODEL_NAME = os.getenv("MODEL_NAME")
MODEL_REV = os.getenv("MODEL_REV")

model = SentenceTransformer(
    model_name_or_path=MODEL_NAME,
    revision=MODEL_REV,
    trust_remote_code=True,
    device="cuda"
)


def embed_text(text):
    return model.encode(text).tolist()