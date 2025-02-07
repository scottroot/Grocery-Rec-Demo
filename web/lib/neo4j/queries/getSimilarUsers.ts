import {graphRead} from "@/lib/neo4j/neo4js";


export async function getSimilarUsers(userId: string): Promise<string[]|undefined> {
  const query = `
    MATCH (u:User {user_id: $userId})-[:HAS_EMBEDDING]->(ue:UserEmbedding)
    CALL db.index.vector.queryNodes('user_embedding_index', 5, ue.embedding) 
    YIELD node AS embedding_node, score
    MATCH (similar_user:User)-[:HAS_EMBEDDING]->(embedding_node)
    WHERE similar_user.user_id <> $userId
    RETURN similar_user.user_id AS user_id, score
    ORDER BY score DESC;
  `;
  const result = await graphRead(query, {userId})
  return result.map(r => r.user_id);
}