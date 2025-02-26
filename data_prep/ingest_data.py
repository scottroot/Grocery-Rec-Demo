import pandas as pd
from tqdm import tqdm
from helpers.graph import run_query


if __name__ == "__main__":

    # Create constraints
    run_query("CREATE CONSTRAINT IF NOT EXISTS FOR (p:Product) REQUIRE p.product_id IS UNIQUE;")
    run_query("CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.user_id IS UNIQUE;")
    run_query("CREATE CONSTRAINT IF NOT EXISTS FOR (o:Order) REQUIRE o.order_id IS UNIQUE;")
    print("Neo4j constraints created.")


    # Load CSV Data
    products = pd.read_csv("./products.csv")
    orders = pd.read_csv("./orders.csv")
    order_products = pd.read_csv("./order_products__prior.csv")
    aisles = pd.read_csv("./aisles.csv")

    # Merge order-products to the orders
    unique_order_ids = order_products[['order_id']].drop_duplicates()
    original_orders = orders
    orders = original_orders.merge(unique_order_ids, on='order_id')

    print("Loaded CSV Data")


    # Ingest Products to Neo4j
    for _, row in tqdm(products.iterrows(), total=len(products), desc="Inserting Products"):
        run_query(
            "MERGE (p:Product {product_id: $product_id, name: $name, aisle_id: $aisle, department_id: $dept})",
            {"product_id": row["product_id"], "name": row["product_name"], "aisle": row["aisle_id"], "dept": row["department_id"]}
        )
    print("Products relationships inserted successfully!")


    # Ingest Users and Orders to Neo4j
    for _, row in tqdm(orders.iterrows(), total=len(orders), desc="Inserting Orders"):
        run_query(
            "MERGE (u:User {user_id: $user_id}) "
            "MERGE (o:Order {order_id: $order_id}) "
            "MERGE (u)-[:PLACED]->(o)",
            {"user_id": row["user_id"], "order_id": row["order_id"]}
        )
    print("Orders relationships inserted successfully!")


    # Ingest Order-Product Relationships
    for _, row in tqdm(order_products.iterrows(), total=len(order_products), desc="Inserting Order-Product Relationships"):
        run_query(
            "MATCH (o:Order {order_id: $order_id}), (p:Product {product_id: $product_id}) "
            "MERGE (o)-[:CONTAINS]->(p)",
            {"order_id": row["order_id"], "product_id": row["product_id"]}
        )
    print("Order-Product relationships inserted successfully!")


    # Create BOUGHT_TOGETHER Relationships
    run_query("""
    MATCH (o:Order)-[:CONTAINS]->(p1:Product)
    MATCH (o)-[:CONTAINS]->(p2:Product)
    WHERE p1 <> p2
    MERGE (p1)-[r:BOUGHT_TOGETHER]->(p2)
    ON CREATE SET r.count = 1
    ON MATCH SET r.count = r.count + 1;
    """)

    print("Data ingestion completed!")
