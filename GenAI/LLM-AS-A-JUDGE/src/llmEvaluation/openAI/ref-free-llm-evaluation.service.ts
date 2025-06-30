import { createLLMAsJudge, CONCISENESS_PROMPT, CORRECTNESS_PROMPT, HALLUCINATION_PROMPT, RAG_HELPFULNESS_PROMPT, CODE_CORRECTNESS_PROMPT, RAG_GROUNDEDNESS_PROMPT, CODE_CORRECTNESS_PROMPT_WITH_REFERENCE_OUTPUTS, RAG_RETRIEVAL_RELEVANCE_PROMPT } from "openevals";
require('dotenv').config();

//core-lib
import { writeFileSync } from "fs";

export async function refFreeLLMvalModel() {

  const modelName = "openaiGPT-4-1"

  // const promptArray = [ CORRECTNESS_PROMPT, HALLUCINATION_PROMPT, RAG_HELPFULNESS_PROMPT, CODE_CORRECTNESS_PROMPT, RAG_GROUNDEDNESS_PROMPT, CODE_CORRECTNESS_PROMPT_WITH_REFERENCE_OUTPUTS, RAG_RETRIEVAL_RELEVANCE_PROMPT];


  console.log("conciseness prompts", CONCISENESS_PROMPT);

  // const lablePromptName = ["CORRECTNESS_PROMPT", "HALLUCINATION_PROMPT", "RAG_HELPFULNESS_PROMPT", "CODE_CORRECTNESS_PROMPT", "RAG_GROUNDEDNESS_PROMPT", "CODE_CORRECTNESS_PROMPT_WITH_REFERENCE_OUTPUTS", "RAG_RETRIEVAL_RELEVANCE_PROMPT"]
  // Store the prompt in a file
  // writeFileSync("conciseness_prompt.txt", CONCISENESS_PROMPT);
  // let count = 0;
  // while (count in promptArray) {
  //   writeFileSync(`${lablePromptName[count]}.txt`, promptArray[count]);
  //   count++;
  // }
  // return;
  // Read the prompt back from the file and parse it as a string
  const promptFromFile = require("fs").readFileSync("conciseness_prompt.txt", "utf-8");
  console.log("prompt file ", promptFromFile);

  const concisenessEvaluator = createLLMAsJudge({
    // CONCISENESS_PROMPT is just an f-string
    prompt: CONCISENESS_PROMPT,
    model: "openai:gpt-4.1",

  });

  const inputs =
    // "What is the today's weather in Ahemdabad in india?"
  "What is torri.ai and how this helps me in my business?"
  // These are fake outputs, in reality you would run your LLM-based system to get real outputs
  const outputs =
    // `Currently 88° · Cloudy  Ahmedabad, India`;
  `
    Hello there! I'm glad you're interested in learning more about Torri.ai. Torri is an innovative platform that allows you to create lifelike AI agents tailored specifically for your business needs. These intelligent and emotionally-aware bots can be built with just a single click and can be embedded on various platforms like websites, WhatsApp, Telegram, and more.
    For your business, Torri can be a game-changer in several ways. Here’s how:
    1. **Customer Service**: Provide 24/7 support with bots that can answer product queries, help troubleshoot issues, and maintain a consistent brand voice.
    2. **Lead Generation and Sales Enablement**: Our agents can engage with visitors, recommend products, recover abandoned carts, and drive sales on autopilot.
    `

  // When calling an LLM-as-judge evaluator, parameters are formatted directly into the prompt
  const evalResult = await concisenessEvaluator({
    inputs,
    outputs,
  });

  console.log("evaluation Result ", evalResult);

  writeFileSync(`${modelName}-` + new Date().getMilliseconds()+`-eval-result.json`, JSON.stringify(evalResult, null, 2));
  


}

// refFreeLLMvalModel();