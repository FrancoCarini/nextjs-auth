import { MongoClient } from "mongodb"

import { DATABASE } from "../config/index"

export async function connectToDatabase() {
  const client = await MongoClient.connect(DATABASE)
  return client
}
