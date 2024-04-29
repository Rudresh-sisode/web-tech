import { TextServiceClient } from "@google-ai/generativelanguage";

import { GoogleAuth } from "google-auth-library";

require('dotenv').config();

const MODEL_NAME = "models/embedding-gecko-001";
const API_KEY = process.env.GOOGLE_PALM_API_KEY;

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY as string),
});

const doEmbeddingData = async (req: any, res: any, next: any) => { // post request

  try {
    const text = req.body.text;
    const response = await client.embedText({
      model: MODEL_NAME,
      text: text,
    });

    res.status(200).json({
      data: response,
    });

  } catch (error: any) {

    res.status(500).json({
      message: error.message,
    });
    
  }


}

export { doEmbeddingData };