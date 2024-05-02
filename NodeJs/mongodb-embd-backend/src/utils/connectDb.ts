import { MongoClient } from "mongodb";
require('dotenv').config();

// const  MongoClient  = mongodb.MongoClient;

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri as string);

let _db:any;

const connectDb = async () => {
  try {
    await client.connect();
    _db = client.db();
    console.log("Connected to the database");
  } catch (error: any) {
    console.log("Error connecting to the database", error.message);
  }
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  // throw new Error("No database found");
}

export { connectDb, getDB };