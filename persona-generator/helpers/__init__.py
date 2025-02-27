import json
from neo4j import GraphDatabase
import os
from dotenv import load_dotenv
import boto3
from collections import Counter
import numpy as np
from openai import OpenAI


# Load environment variables
load_dotenv()
NEO4J_URI = os.getenv("NEO4J_URI")
NEO4J_USER = os.getenv("NEO4J_USER")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)

# Connect to Neo4j
class Neo4jClient:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))

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


def aggregate_orders(orders):
    total_orders = len(orders)

    # Flatten product lists and count frequencies
    product_counts = Counter([product for order in orders for product in order["products"]])
    most_frequent_products = [product for product, _ in product_counts.most_common(10)]

    # Calculate most common shopping day and times
    dow_counts = Counter(order["order_dow"] for order in orders)
    hour_counts = Counter(order["order_hour_of_day"] for order in orders)

    most_common_dow = dow_counts.most_common(1)[0][0]
    most_common_hours = [hour for hour, _ in hour_counts.most_common(2)]

    # Calculate average days between orders
    avg_days_since_order = np.mean(
        [order["days_since_prior_order"] for order in orders if order["days_since_prior_order"] is not None])

    # Format the summary
    summary = f"""The user has placed {total_orders} orders.
Their most frequently purchased products include: {most_frequent_products}.
They typically shop on {most_common_dow}rd day of the week at the {most_common_hours[0]}th hour and {most_common_hours[1]}th hour of the day.
The user tends to reorder every {int(round(avg_days_since_order))} days on average."""

    return summary


# Function to generate prompt for ChatGPT
def generate_prompt(shopping_data):
    orders_summary = aggregate_orders(shopping_data)
    orders_info = "\n".join([
        f"- Order {order['order_number']} on Day {order['order_dow']} at {order['order_hour_of_day']}h. Days since last order: {order['days_since_prior_order']}. Products: {', '.join(order['products'])}."
        for order in shopping_data
    ])
    json_format = """{"user_persona":{"name":"string","demographics":{"age":integer,"occupation":"string","location":"string","household":"string","income_level":"string"},"shopping_behavior":{"shopping_frequency":"string","preferred_shopping_times":["string"],"favorite_shopping_days":["string"],"common_purchases":["string"]},"dietary_habits":{"diet_focus":"string","cooking_preference":"string","dietary_considerations":["string"],"balanced_indulgence":["string"]},"shopping_motivations":{"primary_motivations":["string"]}}}"""
    json_format = {"user_persona":{"name":"Jake Reynolds","demographics":{"age":32,"occupation":"IT Professional / Remote Worker","location":"Suburban Area","household":"Likely Single or Living with a Partner","income_level":"Middle to Upper-Middle Class"},"shopping_behavior":{"shopping_frequency":"Every 15 days","preferred_shopping_times":["8 AM","1 PM"],"favorite_shopping_days":["Tuesday","Wednesday"],"common_purchases":["High-protein, easy-to-eat snacks (beef jerky, string cheese, pistachios)","Soda regularly","Paper towels in bulk","Some fresh fruit"]},"dietary_habits":{"diet_focus":"High-protein, snack-heavy diet","cooking_preference":"Minimal cooking, prefers quick & easy meal options","dietary_considerations":["Lactose-conscious (buys almond milk and Greek yogurt)"],"balanced_indulgence":["Enjoys snacks but also buys soda and Cinnamon Toast Crunch"]},"shopping_motivations":{"primary_motivations":["Convenience & Habit - Shops regularly with a predictable routine","Protein & Energy Needs - Prioritizes high-protein, easy-to-consume foods","On-the-Go or Remote Work Lifestyle - Prefers snacks over meal prep","Health-Conscious But Not Strict - Mixes healthy choices with indulgences","Stocking Essentials - Buys in bulk to maintain household efficiency"]}}}

    prompt = f"""
    Analyze the following user's past grocery shopping behavior and create a detailed user persona including name, age, and personal details.
    {orders_summary}
    Using this information, and the below full order history, describe their possible lifestyle, dietary habits, and shopping motivations.
    {orders_info}

    Based on this data, describe their possible lifestyle, dietary habits, and shopping motivations.
    Reply with correctly formatted minified JSON using double quotes, without code blocks or extra formatting, and without any additional text, explanations. The JSON structure must match the following schema exactly: {json_format}
    """
    return prompt.strip()


# Function to call OpenAI's ChatGPT API
def get_chatgpt_response(prompt):
    client = OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an AI that analyzes shopping behavior to create detailed user personas."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )
    print(response)
    return response.choices[0].message.content


def upload_to_s3(user_id, persona_json):
    if isinstance(persona_json, str):
        persona_json = json.loads(persona_json)
    file_name = f"{user_id}.json"
    with open(f"personas/{str(user_id)}.json", "w") as f:
        json.dump(persona_json, f)

    json_string = json.dumps(persona_json, indent=4)

    s3_client.put_object(
        Bucket=S3_BUCKET_NAME,
        Key=file_name,
        Body=json_string,
        ContentType="application/json"
    )
    s3_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{file_name}"
    return s3_url


# Main Execution
if __name__ == "__main__":
    user_id = 17282
    neo4j_client = Neo4jClient(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD)

    try:
        user_shopping_data = neo4j_client.get_user_shopping_history(user_id)
        if user_shopping_data:
            chatgpt_prompt = generate_prompt(user_shopping_data)
            user_persona = get_chatgpt_response(chatgpt_prompt)
            print(user_persona)
            print(upload_to_s3(user_id, user_persona))
        else:
            print("No shopping history found for this user.")
    finally:
        neo4j_client.close()
