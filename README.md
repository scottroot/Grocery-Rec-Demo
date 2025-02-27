## Overview
####  A showcase of recommendation system strategies using the Instacart dataset. This project explores grocery basket analysis, intuitive search, and personalized recommendations to boost user engagement and cart value. It highlights scalable, impactful solutions for grocery e-commerce while reflecting technical and analytical expertise.
  
## Key Features
- **Product Search:** Find grocery items quickly by name or similar description.
- **Recommendations:** Personalized suggestions based on the user's current shopping cart and purchase history.
- **Persona Exploration:** Fill up your own cart in the interactive demo, or select from an existing customer persona to see their recommendations.
----
## Demo

[Link to Live Demo](https://grocery.scotthendrix.dev)

----
## Project Structure
This project consists of a few components:

📂 **data-pipeline** - Backend Setup (Python + Neo4j)
- Database Setup – Scripts to set up a Neo4j graph database and index the Instacart CSV data.
- Vector Embeddings – Scripts to generate and store embeddings for recommendations.
- Graph Queries – Cypher queries for search, recommendations, and user persona analysis.
  
📂 **persona-generator** - User Persona Creation (Python + OpenAI + Neo4j)
- Persona Writeups – Generates personalized user descriptions based on Neo4j data.
- AI-Powered Summaries – Uses OpenAI to enhance user insights.
- Profile Enrichment – Extracts behavioral patterns and trends from graph data.
  
📂 **inference-api** - Real-time Embedding Service (Python + FastAPI + Sentence Transformers)
- API for Embeddings – Provides a simple API to generate vector embeddings on demand.
- Search & Similarity – Supports quick comparisons for recommendations.
- Lightweight & Fast – Runs efficiently as a microservice.
  
📂 **web** - Frontend (Next.js + Tailwind)
- Interactive UI – A Next.js web app located in the /web folder.
- API Integration – Fetches recommendations and search results from the backend.
- Demo Experience – Users can build carts, explore personas, and view recommendations.
----
## Artifacts and Documentation
TODO: revisit this...
  
[Uploading to /docs folder]([https://github.com/scottroot/Grocery-Rec-Demo/docs](https://github.com/scottroot/Grocery-Rec-Demo/tree/main/docs))
- **Business Case:** Project justification and strategic goals.
- **User Personas:** Profiles of target users and their needs.
- **System Architecture:** Technical design of the system.
- **API Documentation:** Endpoints and data structures.
- **Wireframe Mockup:** Initial Figma design ([link](https://www.figma.com/design/zCAA4VOewTSV2c1RywAKp9/Grocery-Recommendation-Demo?node-id=0-1&t=nrske1xa3WLWs3cv-1)) for site.

  
