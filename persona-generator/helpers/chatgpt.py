from openai import OpenAI
import os
from dotenv import load_dotenv


load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def aggregate_orders(orders):
    total_orders = len(orders)

    # flatten product lists and count frequencies
    product_counts = Counter([product for order in orders for product in order["products"]])
    most_frequent_products = [product for product, _ in product_counts.most_common(10)]

    # calculate most common shopping day and times
    dow_counts = Counter(order["order_dow"] for order in orders)
    hour_counts = Counter(order["order_hour_of_day"] for order in orders)

    most_common_dow = dow_counts.most_common(1)[0][0]
    most_common_hours = [hour for hour, _ in hour_counts.most_common(2)]

    # calculate average days between orders
    avg_days_since_order = np.mean(
        [order["days_since_prior_order"] for order in orders if order["days_since_prior_order"] is not None])

    # format summary
    summary = f"""The user has placed {total_orders} orders.
Their most frequently purchased products include: {most_frequent_products}.
They typically shop on {most_common_dow}rd day of the week at the {most_common_hours[0]}th hour and {most_common_hours[1]}th hour of the day.
The user tends to reorder every {int(round(avg_days_since_order))} days on average."""

    return summary


# Function to generate the prompt for ChatGPT
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


# Function to call OpenAI ChatGPT API
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
