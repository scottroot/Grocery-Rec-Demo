## Data Models

- **Users:** `{ user_id, past_orders }`
- **Products:** `{ product_id, name, category, price, stock, tags }`
- **Orders:** `{ order_id, user_id, product_ids[], total_price, order_date }`
----
### Products Model
- `product_id` (Integer): Unique identifier for the product.
- `product_name` (String): Name of the product.
- `aisle_id` (Integer): Identifier for the aisle where the product is located.
- `section_id` (Integer): Identifier for the section of an aisle where the product is located.
----
### Orders Model
- `product_id` (Integer): Unique identifier for the product.
- `product_name` (String): Name of the product.
- `aisle_id` (Integer): Identifier for the aisle where the product is located.
- `department_id` (Integer): Identifier for the department of the product.
- `user_id`: Identifier for user.
