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