/*
    ChatGPT Telegram Bot Demo : tx.me/JinsoRaj
    Nodejs - grammYjs - VPS
*/
import { Bot } from "grammy";
import { getAIResponse } from "./openai.js"
import * as dotenv from 'dotenv'
dotenv.config();


const bot = new Bot(process.env.BOT_TOKEN);

// Handle start command
bot.command("start", async (ctx) => {
    await ctx.reply("Hello 😉",{
        reply_to_message_id: ctx.message.message_id
    });
});

bot.on('message:text', async(ctx) =>{
    // Get messages from user
    const input = ctx.message.text;
    const aiResponse = await getAIResponse(input);
    // split output to 4096 chars
    const responseArray = aiResponse.match(/.{1,4096}(?:\s|$)/g)
    for (const output in responseArray) {
        await bot.api.sendMessage(ctx.message.chat.id,`<code>${responseArray[output]}</code>`,{
            parse_mode: "HTML",
            reply_to_message_id: ctx.message.message_id
        })
    }
})

// Start the bot.
bot.start();