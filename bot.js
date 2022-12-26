/*
    ChatGPT Telegram Bot Demo : tx.me/JinsoRaj
    Nodejs - grammYjs - VPS
*/
import { Bot, GrammyError, HttpError } from "grammy";
import { getAIResponse } from "./openai.js"
import * as dotenv from 'dotenv'
dotenv.config();


const bot = new Bot(process.env.BOT_TOKEN);
const ADMIN_ID = process.env.ADMIN_ID;

// Handle start command
bot.command("start", async (ctx) => {
    await ctx.reply("Hello 😉",{
        reply_to_message_id: ctx.message.message_id
    });
});

bot.on('message:text', async(ctx) =>{
    // Get input message from user
    const input = ctx.message.text;
    // If group message starts with bot username
    if(ctx.chat.type == "supergroup" && input.split(' ')[0] == `@${bot.botInfo.username}`){
        // skip first word
        const aiResponse = await getAIResponse(input.substr(input.indexOf(" ") + 1));
        // split output to 4096 chars
        const responseArray = aiResponse.match(/.{1,4096}(?:\s|$)/gs)
        for (const output in responseArray) {
            await bot.api.sendMessage(ctx.message.chat.id,`<code>${responseArray[output]}</code>`,{
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            })
        }

    }else if(ctx.chat.type == "private" && ctx.chat.id == ADMIN_ID){

        const aiResponse = await getAIResponse(input);
        // split output to 4096 chars
        const responseArray = aiResponse.match(/.{1,4096}(?:\s|$)/gs)
        for (const output in responseArray) {
            await bot.api.sendMessage(ctx.message.chat.id,`<code>${responseArray[output]}</code>`,{
                parse_mode: "HTML",
                reply_to_message_id: ctx.message.message_id
            })
        }

    }
})

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
      bot.api.sendMessage(ADMIN_ID,`Error in request: ${e.description}`)
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });

// Start the bot.
bot.start();