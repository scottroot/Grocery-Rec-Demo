## System Architecture
```mermaid
graph TD
    Browser((Browser)) --> Frontend[Frontend: React]
    Frontend --> Backend[Backend: Next.js API]
    Backend --> Database[Database: MongoDB]
    Backend --> Search[Vector Service: Weaviate]
    Backend --> Recommendations[Recommendation Engine: Sentence Transformers fine-tuned]
