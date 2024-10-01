import { MongoClient, Db, Collection } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect().then(() => {
    console.log("Successfully connected to MongoDB"); // Log successful connection
    return client;
  });
}

clientPromise = global._mongoClientPromise;

export interface DatabaseCollections {
  users: Collection<any>;
  students: Collection<any>;
  grades: Collection<any>;
  permissions: Collection<any>;
}

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db; collections: DatabaseCollections }> {
  const client = await clientPromise;
  const db: Db = client.db("wonderland_school_grading");
  
  const collections: DatabaseCollections = {
    users: db.collection("users"),
    students: db.collection("students"),
    grades: db.collection("grades"),
    permissions: db.collection("permissions")
  };

  return { client, db, collections };
}

export default clientPromise;