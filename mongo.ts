import "dotenv/config";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

async function connect(): Promise<MongoClient> {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You are successfully connected to MongoDB!"
    );

    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function close(): Promise<void> {
  await client.close();
}

export default {
  connect,
  close,
};
