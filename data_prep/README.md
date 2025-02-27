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
```css
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
```css
Orders - 7 Cols, 3421083 Rows
|   order_id |   user_id | eval_set   |   order_number |   order_dow |   order_hour_of_day |   days_since_prior_order |
|-----------:|----------:|:-----------|---------------:|------------:|--------------------:|-------------------------:|
|    2539329 |         1 | prior      |              1 |           2 |                   8 |                      nan |
```

### Order-Products csv
```python
order_products = pd.read_csv("./data/order_products__prior.csv")
print(f"Order-Products - {str(order_products.shape[1])} Cols, {str(order_products.shape[0])} Rows")
print(order_products.head(2).to_markdown(index=False))
```
```css
Order-Products - 4 Cols, 32434489 Rows
|   order_id |   product_id |   add_to_cart_order |   reordered |
|-----------:|-------------:|--------------------:|------------:|
|          2 |        33120 |                   1 |           1 |
|          2 |        28985 |                   2 |           1 |
```

### **2️⃣ Use Python to Prep and Upload the CSV Data**
Python with Pandas will read the **Instacart dataset CSV files**, do a few transformations, and then run **Cypher queries** to populate the graph database.

Make sure you've installed this [`requirements.txt`](https://github.com/scottroot/Grocery-Rec-Demo/blob/main/data_prep/requirements.txt) before starting.

📌 **Python Script [`ingest_data.py`](https://github.com/scottroot/Grocery-Rec-Demo/blob/main/data_prep/ingest_data.py) to Process the CSV files and ingest to Graph**
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

📌 **Python Script [`ingest_data.py`](https://github.com/scottroot/Grocery-Rec-Demo/blob/main/data_prep/ingest_data.py) to Process the CSV files and ingest to Graph**


## 📌 **Cypher Queries for Creating Indexes**
Before inserting data, **constraints need to be created** and **indices should be created** for faster lookups:

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
TODO: revise this based on changes to the ingest_data.py, which now will handle all the Cypher queries directly.
- **Run the Python script** to parse and validate CSV data.
- **Load data into Neo4j** using Cypher queries.
- **Optimize queries with indexes** for faster lookups.

🚀 Now you’re ready to move to the [**front-end web directory**](https://github.com/scottroot/Grocery-Rec-Demo/tree/main/web).
