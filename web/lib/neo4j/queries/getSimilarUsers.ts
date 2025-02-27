import { graphRead } from "@/lib/neo4j/neo4j";


const SIMILAR_USERS_QUERY: string = `
  MATCH (u:User {user_id: $userId})-[:HAS_EMBEDDING]->(ue:UserEmbedding)
  
  // Perform vector search to find the top 5 most similar user embeddings
  CALL db.index.vector.queryNodes('user_embedding_index', 5, ue.embedding) 
  YIELD node AS embedding_node, score
  
  // Retrieve users associated with the found embeddings, excluding the original user
  MATCH (similar_user:User)-[:HAS_EMBEDDING]->(embedding_node)
  WHERE similar_user.user_id <> $userId
  
  // Return user IDs sorted by similarity score (highest first)
  RETURN similar_user.user_id AS user_id, score
  ORDER BY score DESC;
`;

/**
 * Retrieves a list of users similar to the given user based on embedding similarity.
 *
 * - Finds the embedding associated with the given user.
 * - Uses a **vector search** (`db.index.vector.queryNodes`) to find the 5 most similar users.
 * - Ensures that the original user is **excluded** from the results.
 * - Returns a list of similar user IDs.
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise resolving to an array of similar user IDs or `undefined` if no matches are found.
 * @throws Throws an error if the query execution fails.
 */
export async function getSimilarUsers(userId: string): Promise<string[] | undefined> {
  try {
    // Execute query using Neo4j driver
    const result = await graphRead(SIMILAR_USERS_QUERY, { userId });

    // Map and return only the user IDs
    return result.map(r => r.user_id);
  } catch (error) {
    console.error(`Error fetching similar users for userId=${userId}:`, error);
    throw error;
  }
}