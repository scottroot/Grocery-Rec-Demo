import * as neo4j from "neo4j-driver";

export const isInt = neo4j.isInt;

const { NEO4J_URI = "bolt://localhost:7687", NEO4J_USERNAME = "neo4j", NEO4J_PASSWORD = "password" } = process.env

export const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(
    NEO4J_USERNAME,
    NEO4J_PASSWORD
  )
)
