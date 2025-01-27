## Overview
### A showcase of recommendation system strategies using the Instacart dataset. This project explores grocery basket analysis, intuitive search, and personalized recommendations to boost user engagement and cart value. It highlights scalable, impactful solutions for grocery e-commerce while reflecting technical and analytical expertise.
- **Product Search:** Quickly find grocery items by name or similar description.
- **Recommendations:** Personalized suggestions based on user's current shopping cart and past purchase history.
- **Persona Exploration:** Fill up your own cart in the interactive demo, or select from an existing customer persona to see what recommendations they would receive instead.

 ----
## Demo

[Link to Live Demo](https://www.github.com/scottroot/Grocery-Rec-Demo)

----
## Artifacts and Documentation
[Uploading to /docs folder](https://github.com/scottroot/Grocery-Rec-Demo/docs)
- **Business Case:** Project justification and strategic goals.
- **User Personas:** Profiles of target users and their needs.
- **System Architecture:** Technical design of the system.
- **API Documentation:** Endpoints and data structures.
  
----
## System Architecture
```mermaid
graph TD
    Browser((Browser)) --> Frontend[Frontend: React]
    Frontend --> Backend[Backend: Next.js API]
    Backend --> Database[Database: MongoDB]
    Backend --> Search[Vector Service: Weaviate]
    Backend --> Recommendations[Recommendation Engine: Sentence Transformers fine-tuned]
