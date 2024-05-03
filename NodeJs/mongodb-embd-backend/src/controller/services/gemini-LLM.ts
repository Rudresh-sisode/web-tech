
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
require('dotenv').config();

const MODEL_NAME = "gemini-1.5-pro-latest";
const API_KEY = process.env.GEMINI_LLM_API_KEY as string;

type ChatResponse = {
  text: any;
  isSafe: boolean;
  error: boolean;
  errorMessage: string;
};


const runChat = async (history: any, context: string,question:string): Promise<ChatResponse> => {

  try {

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 1,
      topK: 0,
      topP: 0.95,
      maxOutputTokens: 8192,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [
      ],
    });
  
    const result = await chat.sendMessage(`
      Use the following pieces of context to answer the users question.
      If you don't know the answer, just say that you don't know, don't try to make up an answer.
      The given context is string but it's originally JSON object.
      ----------------
      context:
      ${context}

      context End.
      Following is the user's question, and that question is to be answered using the given context.
      make sure you will consider the context as JSON object.
      ${question}
    `);

    const response = result.response;
    //parse the response
    const parsedResponse = response.text();
    console.log(parsedResponse);


    return {
      text: parsedResponse,
      isSafe: true,
      error: false,
      errorMessage: "",
    };

  }
  catch (error: any) {
    console.error("Gemini LLM error: \n",error);
    return {
      text: "",
      isSafe: false,
      error: true,
      errorMessage: error.message,
    };
  }
}

// runChat();
export { runChat };