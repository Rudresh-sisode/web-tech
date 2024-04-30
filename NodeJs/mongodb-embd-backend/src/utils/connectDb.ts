import { MongoClient } from "mongodb";
require('dotenv').config();



// const  MongoClient  = mongodb.MongoClient;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri as string);

const connectDb = async () => {
  try {
    await client.connect();
    console.log("Connected to the database");
  } catch (error: any) {
    console.log("Error connecting to the database", error.message);
  }
};

export default connectDb;