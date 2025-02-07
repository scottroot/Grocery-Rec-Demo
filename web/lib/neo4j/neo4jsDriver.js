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

// export async function read(cypher, params = {}) {
//   const session = driver.session()
//
//   try {
//     const res = await session.executeRead(tx => tx.run(cypher, params))
//     return res.records.map(record => record.toObject())
//   }
//   finally {
//     await session.close()
//   }
// }
//
// export async function write(cypher, params = {}) {
//   // const session = driver.session()
//   //
//   // try {
//   //   const res = await session.executeWrite(tx => tx.run(cypher, params))
//   //   return res.records.map(record => record.toObject())
//   // }
//   // finally {
//   //   await session.close()
//   // }
// }