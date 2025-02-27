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
🔗 [Link to Instacart Dataset](https://www.kaggle.com/competitions/instacart-market-basket-analysis/data)
- `orders.csv`
- `products.csv`
- `aisles.csv`
- `departments.csv`
- `order_products__prior.csv`
- `order_products__train.csv` (not using this, but you can if desired - it is intended as a testing dataset)

#### Products csv
```python
products = pd.read_csv("./data/products.csv")
print(f"Products - {str(products.shape[1])} Cols, {str(products.shape[0])} Rows")
print(products.head(1).to_markdown(index=False))
```
```bash
Products - 4 Cols, 49688 Rows
|   product_id | product_name               |   aisle_id |   department_id |
|-------------:|:---------------------------|-----------:|----------------:|
|            1 | Chocolate Sandwich Cookies |         61 |              19 |
```
#### Orders csv
```python
orders = pd.read_csv("./data/orders.csv")
print(f"Orders - {str(orders.shape[1])} Cols, {str(orders.shape[0])} Rows")
print(orders.head(1).to_markdown(index=False))
```
```bash
Orders - 7 Cols, 3421083 Rows
|   order_id |   user_id | eval_set   |   order_number |   order_dow |   order_hour_of_day |   days_since_prior_order |
|-----------:|----------:|:-----------|---------------:|------------:|--------------------:|-------------------------:|
|    2539329 |         1 | prior      |              1 |           2 |                   8 |                      nan |
```

### Order-Products csv
```python
order_products = pd.read_csv("./data/order_products__prior.csv")
print(f"Order-Products - {str(order_products.shape[1])} Cols, {str(order_products.shape[0])} Rows")
print(order_products.head(1).to_markdown(index=False))
```
```bash
Order-Products - 4 Cols, 32434489 Rows
|   order_id |   product_id |   add_to_cart_order |   reordered |
|-----------:|-------------:|--------------------:|------------:|
|          2 |        33120 |                   1 |           1 |
```
### Aisles csv
```python
aisles = pd.read_csv("./data/aisles.csv")
print(f"Aisles - {str(aisles.shape[1])} Cols, {str(aisles.shape[0])} Rows")
print(aisles.head(1).to_markdown(index=False))
```
```bash
Aisles - 2 Cols, 134 Rows
|   aisle_id | aisle                 |
|-----------:|:----------------------|
|          1 | prepared soups salads |
```

### **2️⃣ Use Python to Prep and Upload the CSV Data**
Python with Pandas will read the **Instacart dataset CSV files**, do a few transformations, and then run **Cypher queries** to populate the graph database.

Make sure you've installed this [**`requirements.txt`**](https://github.com/scottroot/Grocery-Rec-Demo/blob/main/data_prep/requirements.txt) before starting.

📌 **Python Script [**`ingest_data.py`**](https://github.com/scottroot/Grocery-Rec-Demo/blob/main/data_prep/ingest_data.py) to Process the CSV files and ingest to Graph**
#### Creates necessary constraints:
  * Constraint on Product - unique product_id
  * Constraint on Aisle - unique aisle_id
  * Constraint on Department - unique department_id
  * Constraint on User - unique user_id
  * Constraint on Order - unique order_id
#### Reads and ingests the data into Neo4j:
```python
import pandas as pd
from tqdm import tqdm
from helpers.graph import run_query


# Load environment variables
URI = os.getenv("NEO4J_URI")
USERNAME = os.getenv("NEO4J_USERNAME")
PASSWORD = os.getenv("NEO4J_PASSWORD")

...

print("Data ingestion completed!")

```

📌 **Python Script [**`enrich_data.py`**](https://github.com/scottroot/Grocery-Rec-Demo/blob/main/data_prep/enrich_data.py) to Process the CSV files and ingest to Graph**
* #### Create Indexes
  * Index (Vector) on UserEmbedding - user_embedding_index
  * Index (Vector) on Product - product_embedding_index
  * Index (Full-Text) on Product - product_name_index

* #### Calculate Product embeddings
  * Use Sentence-Transformers model to calculate vector embedding for each product name. 
  Add each embedding to `embedding` property to each Product node in Neo4j.
* #### Calculate User embeddings
  * Use Neo4j query to aggregate and calculate user embeddings through the following steps:
    1. Group order-products by all of user's `order_id` sorted by `order_number`
    2. Calculate vector embedding for each order by taking mean of all products' embeddings
    3. For each order (after the 1st), calculate moving average using exponential moving average with alpha of 0.2
embedding for each order
    4. Store final vector embedding onto User node


## 📌 **Cypher Queries for Constraints & Indexes**
Before inserting data, **constraints need to be created** and **indexes should be created** for faster lookups:

### **Constraints**
```cypher
CREATE CONSTRAINT IF NOT EXISTS FOR (p:Product) REQUIRE p.product_id IS UNIQUE;
```
```cypher
CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.user_id IS UNIQUE;
```
```cypher
CREATE CONSTRAINT IF NOT EXISTS FOR (o:Order) REQUIRE o.order_id IS UNIQUE;
```

### **Product Full-Text Index**
```cypher
CREATE FULLTEXT INDEX product_name_index IF NOT EXISTS
FOR (p:Product) ON EACH [p.product_name]
```

### **Product Embedding Index**
```cypher
CREATE VECTOR INDEX product_embedding_index IF NOT EXISTS
FOR (p:Product) ON (p.embedding)
OPTIONS {indexConfig: {`vector.dimensions`: 768, `vector.similarity_function`: 'cosine'}};
```

### **User Embedding Index**
```cypher
CREATE VECTOR INDEX user_embedding_index IF NOT EXISTS
FOR (ue:UserEmbedding) ON (ue.embedding) 
OPTIONS {indexConfig: {`vector.dimensions`: 768, `vector.similarity_function`: 'cosine'}};
```

## ✅ **Next Steps**
TODO: revise this based on changes to the ingest_data.py, which now will handle all the Cypher queries directly.
- **Run the Python script** to parse and validate CSV data.
- **Load data into Neo4j** using Cypher queries.
- **Optimize queries with indexes** for faster lookups.

🚀 Now you’re ready to move to the [**front-end web directory**](https://github.com/scottroot/Grocery-Rec-Demo/tree/main/web).
