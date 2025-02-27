import pandas as pd
from tqdm import tqdm
from helpers.graph import run_query


if __name__ == "__main__":

    # Create Product Vector Index in Neo4j
    run_query("""
    CREATE VECTOR INDEX product_embedding_index
    FOR (p:Product) ON (p.embedding)
    OPTIONS {indexConfig: {`vector.dimensions`: 768, `vector.similarity_function`: 'cosine'}};
    """)
    print("Vector index 'product_embedding_index' created successfully!")

    # Load Product CSV Data
    products = pd.read_csv("./products.csv")

    # Generate embeddings
    model = SentenceTransformer("all-mpnet-base-v2", device="cuda")

    product_embeddings = {
        row["product_id"]: model.encode(row["product_name"]).tolist()
        for _, row in tqdm(products.iterrows(), total=len(products), desc="Generating Product Embeddings")
    }
    print("Generated product_embeddings dict!")

    Save embeddings
    with open("product_embeddings.json", "w") as f:
        json.dump(product_embeddings, f)

    # Store embeddings in Neo4j
    for product_id, embedding in tqdm(product_embeddings.items(), total=len(product_embeddings), desc="Storing Product Embeddings"):
        run_query("""
            MATCH (p:Product {product_id: $product_id})
            CALL db.create.setNodeVectorProperty(a, 'embedding', $embedding);
            """,
            {"product_id": product_id, "embedding": embedding}
        )
    print("Embeddings stored successfully!")

