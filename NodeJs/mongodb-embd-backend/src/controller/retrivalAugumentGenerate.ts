import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { Collection } from "mongodb";
import { Document } from "mongodb";
import { runChat } from "./services/gemini-LLM";
import { getDB } from "../utils/connectDb";

require('dotenv').config(); // Load environment variables from .env file

const MODEL_NAME = "models/embedding-gecko-001";
const API_KEY = process.env.GOOGLE_PALM_API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY as string),
});

const retrivalAugumentGenerate = async (req: any, res: any) => {

  try {

    const db = getDB();

    // Get the user's query
    const userQuery: string = req.body.questionQuery;

    // If user's query length is more than 210, throw an error
    if (userQuery.length > 210) {
      throw new Error("User's query is too long. Please enter a query with less than 210 characters.");
    }

    // Embed the user's query
    const response = await client.embedText({
      model: MODEL_NAME,
      text: userQuery,
    });

    const batchEmbeddings = response[0]["embedding"]?.value;

    // Get the chunk data from MongoDB database, perform the embedding query, vector search
    const collection: Collection = db.collection('embedding');

    const agg = collection.aggregate([
      {
        "$vectorSearch": {
          "index": "vector_index",
          "path": "chunkEmbedding",
          "queryVector": batchEmbeddings,
          "numCandidates": 200,
          "limit": 5
        }
      }
    ]);

    // Run the pipeline and convert the result to an array
    const result: Document[] = await agg.toArray();

    let chunkData = result.map((doc: any) => {
      return doc.chunk;
    }).join(" ");


    //called the gemini model's function
    const geminiResponse = await runChat([], chunkData, userQuery);
    
    if (geminiResponse.error) {
      throw new Error(geminiResponse.errorMessage);
    }


    // Return the result
    return res.status(200).json({
      result: geminiResponse, 
      chunkData: chunkData
    });

  }
  catch (error: any) {
    // Print the error message
    console.log(error.message);
    return res.status(500).json({
      message: error.message
    });
  }

}

export { retrivalAugumentGenerate };
