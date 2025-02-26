# Graph setup

## Pre

# A

# B

# C...

# Full-text index for lazy product search
** Create index **
```cypher
CREATE FULLTEXT INDEX product_name_index
FOR (p:Product)
ON EACH [p.product_name];
```
  
** Search query **
```cypher
// the query "cats" kept returning weird results in vector search, like "banana", so comparing with this.
CALL db.index.fulltext.queryNodes('product_name_index', 'cats') 
YIELD node, score
RETURN node.product_name, score
ORDER BY score DESC
LIMIT 10;
```