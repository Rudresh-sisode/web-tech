import { TextServiceClient } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";

import jsonData from '../seeds/feedData.json';

import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { getDB } from "../utils/connectDb";

require('dotenv').config();


const MODEL_NAME = "models/embedding-gecko-001";
const API_KEY = process.env.GOOGLE_PALM_API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY as string),
});

const doEmbeddingData = async (req: Request, res: Response, next: NextFunction) => { // post request

  try {
    const text = req.body.text;

    // convert json to string
    const convertedData = JSON.stringify(jsonData);

    const batchSize = 210; // 250 is the maximum limit

    let embeddingArra: any[] = [];


    //get database
    const db = getDB();


    //check if 'embedding' collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((collection: any) => collection.name);

    if (!collectionNames.includes('embedding')) {
      await db.createCollection('embedding');
    }
    else {
      //send message that collection exists
      return res.status(200).json({
        message: 'Collection exists'
      });

    }



    // Split the convertedData into batches of batchSize
    for (let i = 0; i < convertedData.length; i += batchSize) {


      const batch = convertedData.slice(i, i + batchSize);

      const response = await client.embedText({
        model: MODEL_NAME,
        text: batch,
      });

      const batchEmbeddings = response[0]["embedding"]?.value;

      embeddingArra.push(
        {
          chunk: batch,
          chunkEmbedding: batchEmbeddings
        }
      );



      //save to database
      const collection = db.collection('embedding');

      await collection.insertOne({
        chunk: batch,
        chunkEmbedding: batchEmbeddings
      });


      console.log(batch);
    }


    return res.status(200).json({
      data: embeddingArra,
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });

  }


}

export { doEmbeddingData };