from neo4j import GraphDatabase


load_dotenv()
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")


class Neo4jClient:
    def __init__(self):
        self.driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    def close(self):
        self.driver.close()

    def get_user_shopping_history(self, user_id):
        query = """
        MATCH (u:User {user_id: $user_id})-[:PLACED]->(o:Order)-[:CONTAINS]->(p:Product)
        RETURN o.order_number AS order_number,
               o.order_dow AS order_dow,
               o.order_hour_of_day AS order_hour_of_day,
               o.days_since_prior_order AS days_since_prior_order,
               COLLECT(p.product_name) AS products
        ORDER BY order_number ASC
        """
        with self.driver.session() as session:
            result = session.run(query, user_id=user_id)
            return [record.data() for record in result]
