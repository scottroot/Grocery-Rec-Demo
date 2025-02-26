# 🚀 GraphDB Setup with Neo4j for Instacart Dataset

This outlines the steps to **setup a Neo4j database** for storing and querying the **Instacart dataset**. We'll cover:
- Prerequisites
- Loading the CSV data into Neo4j
- Indexing for efficient queries
- Creating embeddings for products and adding to nodes
- Generating user embeddings based on order history

## 📌 Prerequisites
### **1️⃣ Install & Configure Neo4j**
Ensure you have **Neo4j installed** and running locally or online someplace (and have the host and username:password).

🔗 [Download Neo4j](https://neo4j.com/download/)

### **2️⃣ Set Environment Variables**
Make sure you have a .env file with the following **environment variables** set:

```
NEO4J_URI="bolt://localhost:7687"
NEO4J_USERNAME="neo4j"
NEO4J_PASSWORD="yourpassword"
NEO4J_DATABASE="neo4j"
```

## 📂 **Loading Instacart Data into Neo4j**
### **1️⃣ Download Instacart Dataset**
[Obtain the Instacart dataset](https://www.kaggle.com/competitions/instacart-market-basket-analysis/data) and store the CSV files in your project directory. Typically, this includes:

- `orders.csv`
- `products.csv`
- `aisles.csv`
- `departments.csv`
- `order_products__prior.csv`
- `order_products__train.csv`

### **2️⃣ Use Python to Prep and Upload the CSV Data**
Use Python to read the **Instacart dataset CSV files** and generate **Cypher queries** to populate the graph database.

📌 **Python Script (e.g. `import_data.py`) to Process CSVs to Graph:**
```python
from neo4j import GraphDatabase
import pandas as pd
import os


# Load environment variables
URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")


# Function to run the Neo4j Cypher queries
def run_query(query, parameters=None):
    with GraphDatabase.driver(URI, auth=(USERNAME, PASSWORD)) as driver:
        with driver.session() as session:
            with session.begin_transaction() as tx:
                result = tx.run(query, parameters)
                return [dict(record) for record in result]


# Load data
products = pd.read_csv("./products.csv")
orders = pd.read_csv("./orders.csv")
order_products = pd.read_csv("./order_products__prior.csv")

print(f"Loaded {len(order_products)} order products")
```

## 📌 **Cypher Queries for Creating Indexes**
Before inserting data, **indexes should be created** for faster lookups. Below are placeholders for **indexing key entities**:

### **Indexing Products**
```cypher
CREATE INDEX product_index FOR (p:Product) ON (p.product_id);
```

### **Indexing Orders**
```cypher
CREATE INDEX order_index FOR (o:Order) ON (o.order_id);
```

### **Indexing Users**
```cypher
CREATE INDEX user_index FOR (u:User) ON (u.user_id);
```

### **Indexing Aisles & Departments**
```cypher
CREATE INDEX aisle_index FOR (a:Aisle) ON (a.aisle_id);
CREATE INDEX department_index FOR (d:Department) ON (d.department_id);
```

## ✅ **Next Steps**
- **Run the Python script** to parse and validate CSV data.
- **Load data into Neo4j** using Cypher queries (to be added in `import_data.py`).
- **Optimize queries with indexes** for faster lookups.

🚀 Now you’re ready to build a **graph-based recommendation system** on the Instacart dataset!