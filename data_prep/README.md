# Dataset & Database setup

## 1. Get & Review Instacart dataset
🔗 [Link to Instacart Dataset](https://www.kaggle.com/competitions/instacart-market-basket-analysis/data)
* products.csv
* orders.csv
* order-products.csv
### Products csv
```python
products = pd.read_csv("./data/products.csv")
print(f"Products - {str(products.shape[1])} Cols, {str(products.shape[0])} Rows")
print(products.head(2).to_markdown(index=False))
```
Products - 4 Cols, 49688 Rows

|   product_id | product_name               |   aisle_id |   department_id |
|-------------:|:---------------------------|-----------:|----------------:|
|            1 | Chocolate Sandwich Cookies |         61 |              19 |
|            2 | All-Seasons Salt           |        104 |              13 |

### Orders csv
```python
orders = pd.read_csv("./data/orders.csv")
print(f"Orders - {str(orders.shape[1])} Cols, {str(orders.shape[0])} Rows")
print(orders.head(2).to_markdown(index=False))
```
Orders - 7 Cols, 3421083 Rows

|   order_id |   user_id | eval_set   |   order_number |   order_dow |   order_hour_of_day |   days_since_prior_order |
|-----------:|----------:|:-----------|---------------:|------------:|--------------------:|-------------------------:|
|    2539329 |         1 | prior      |              1 |           2 |                   8 |                      nan |
|    2398795 |         1 | prior      |              2 |           3 |                   7 |                       15 |

### Order-Products csv
```python
order_products = pd.read_csv("./data/order_products__prior.csv")
print(f"Order-Products - {str(order_products.shape[1])} Cols, {str(order_products.shape[0])} Rows")
print(order_products.head(2).to_markdown(index=False))
```
Order-Products - 4 Cols, 32434489 Rows

|   order_id |   product_id |   add_to_cart_order |   reordered |
|-----------:|-------------:|--------------------:|------------:|
|          2 |        33120 |                   1 |           1 |
|          2 |        28985 |                   2 |           1 |


## 2. Ingest Dataset to Neo4j `ingest_data.py`
### Create necessary constraints
  * Constraint on Product - unique product_id
  * Constraint on Aisle - unique aisle_id
  * Constraint on Department - unique department_id
  * Constraint on User - unique user_id
  * Constraint on Order - unique order_id
## 3. Enrich Dataset in Neo4j `enrich_data.py`
### Create indices
  * Index (Vector) on UserEmbedding - user_embedding_index
  * Index (Vector) on Product - product_embedding_index
  * Index (Full-Text) on Product - product_name_index

### Calculate Product embeddings
Use Sentence-Transformers model to calculate vector embedding for each product name. 
Add each embedding to `embedding` property to each Product node in Neo4j.
### Calculate User embeddings
Use Neo4j query to aggregate and calculate user embeddings through the following steps:
  * Group order-products by all of user's `order_id` sorted by `order_number`
  * Calculate vector embedding for each order by taking mean of all products' embeddings
  * For each order (after the 1st), calculate moving average using exponential moving average with alpha of 0.2
embedding for each order
  * Store final vector embedding onto User node

# 
#
#
#
#

## Full-text index for lazy product search
**Create index**
```cypher
CREATE FULLTEXT INDEX product_name_index
FOR (p:Product)
ON EACH [p.product_name];
```
  
**Search query**
```cypher
// the query "cats" kept returning weird results in vector search, like "banana", so comparing with this.
CALL db.index.fulltext.queryNodes('product_name_index', 'cats') 
YIELD node, score
RETURN node.product_name, score
ORDER BY score DESC
LIMIT 10;
```