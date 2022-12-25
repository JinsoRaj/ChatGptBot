
import { Configuration, OpenAIApi } from "openai";
import * as dotenv from 'dotenv'
dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
const openai = new OpenAIApi(configuration);

// Generate AI response
export async function getAIResponse(input){

    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: input,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0,
    });
    return completion.data.choices[0].text;
}

