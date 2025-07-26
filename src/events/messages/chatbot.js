import Queue from "p-queue";
import Chatbot from "./../../utils/Chatbot.js";
import { Serialize } from "./../../libs/serialize.js";

import ChatLLM from "./../../libs/scrapers/ChatLLM.js";
import systemPrompt from "./../../libs/prompt.js";

export default {
  name: "messages.upsert",
  code: async(ctx) => {
    //if(true) return;
    try {
      const client = global.client;
      const db = client.db;
      const chat = new Chatbot();
      const queue = new Queue({ concurerrency: 1, interval: 2000, intervalCap: 1 })
      const Message = ctx.messages;
      const m = await Serialize(global.client, ctx.messages[0], global.store);
      const { public: isPublic } = await client.knex("config").first()
      if(!m) return;
      if(!isPublic && !m.isOwner) return;
      
      // user info
      const userId = m.sender.split("@")[0];
      
      const messageTypeWhitelist = [
        "conversation",
        "extendedTextMessage"
      ]
      const messageTypeBlacklist = [
        "reactionMessage",
        "audioMessage",
        "imageMessage",
        "videoMessage",
        "stickerMessage"
      ]
      if(m.fromMe) return;
      if(!m.body) return;
      if(messageTypeBlacklist.includes(m.type)) return;
      if(m.isGroup && !(await db.has(m.key.remoteJid.split("@")[0] + ".chatbot", "grup"))) return;
      
      if(m.isGroup && ((m.isQuoted ? m?.quoted?.fromMe : null) || new RegExp(`^(amira|mira|mir|@${client.user.id.split(":")[0]})`, "i").test(m.body))) {
        // check session
        if(!await chat.hasSession(userId, "global_session")) await chat.createSession(userId, "global_session");
        const messages = await chat.fetchSession(userId, "global_session");
        
        // check context 
        if(m.isQuoted) m.body = `balas konteks dibawah ini dengan mengikuti input pesan!!!\n` +
          `# Context\n${m?.quoted.body || ""}\n` +
          `\n` +
          `# Input user\n${m.body}`;
        messages.push({
          role: "user",
          content: m.body.replaceAll("@" + client.user.id.split(":")[0], "")
        })
        
        client.sendPresenceUpdate("composing", m.key.remoteJid)
        const llm = await ChatLLM.completions({
          temperature: 0.5,
          max_tokens: 1024,
          messages: [
            {
              role: "system",
              content: systemPrompt
            }, ...messages, {
              role: "user",
              content: m.body.replaceAll("@" + client.user.id.split(":")[0], "")
            }
          ]
        });
        console.log("global ai:", llm)
        if(!llm.success) return await m.react(`❌`);
        
        // push messages 
        messages.push({
          role: "assistant",
          content: llm.result.answer
        });
        await chat.pushToSession(userId, messages, "global_session")
        
        await m.reply(llm.result.answer);
        await client.sendPresenceUpdate("available", m.key.remoteJid)
        return;
      }
      
      if(/^[.!#$>/].*/.test(m.body)) return;
      if(m.isGroup) return;
      if(m.fromMe) return;
      if(!await db.has(userId + ".settings.holdChatbot", "user")) await db.set(userId + ".settings.holdChatbot", false, "user");
      if(await db.get(userId + ".settings.holdChatbot", "user")) return;
      
      // check context  and add context to the message
      if(m.isQuoted) m.body = `balas konteks dibawah ini dengan mengikuti input pesan!!!\n` +
        `# Context\n${m?.quoted.body || ""}\n` +
        `\n` +
        `# Input user\n${m.body}`;
      
      // add new task
      const newTask = await chat.addTask({
        question: m.body,
        key: m.key,
        message: m.message
      });
      console.log("add task:", newTask.taskId)
      await queue.add(async() => {
        try {
          // init chat session if there is empty
          if(!await chat.hasSession(userId)) await chat.createSession(userId);
          // fetch chat session 
          let messages = await chat.fetchSession(userId);
          
          // push new user message to session
          messages.push({
            role: "user",
            content: m.body
          });
          
          // response message and send state 
          await client.readMessages([m.key]);
          await client.sendPresenceUpdate("composing", m.key.remoteJid);
          
          // send message to llm 
          const llm = await ChatLLM.completions({
            temperature: 0.5,
            max_tokens: 1024,
            messages: [
              {
                role: "system",
                content: systemPrompt
              }, ...messages
            ]
          });
          console.log(llm)
          
          // send message to user 
          let timeout;
          const composing = async () => {
            if(timeout >= 30) {
              await client.sendPresenceUpdate("available", m.key.remoteJid);
              await m.react("❌");
              console.log("Remove task by timeout:", await chat.removeTask(newTask.taskId))
              return;
            };
            if(!llm.success) {
              await client.sendPresenceUpdate("available", m.key.remoteJid);
              await m.react("❌");
              console.log("Remove task by failed generate response:", await chat.removeTask(newTask.taskId))
              return;
            };
            if (llm.result.answer) {
              await client.sendPresenceUpdate("available", m.key.remoteJid);
              await client.sendMessage(m.key.remoteJid, { text: llm.result.answer.replaceAll(`  \n\n`, " ").replace(/\n+$/, "") }, m.isQuoted ? { quoted: m } : {});
              messages.push({ role: "assistant", content: llm.result.answer });
              console.log("Remove task by success:", await chat.removeTask(newTask.taskId))
              return;
            }
            await client.sendPresenceUpdate("composing", m.key.remoteJid).then(() => {
              setTimeout(composing, 1000);
              timeout++
            });
          };
          await composing();
          await chat.pushToSession(userId, messages);
          return {
            taskId: newTask.taskId,
            question: m.body,
            answer: llm.result.answer
          };
        } catch (e) {
          return global.logs.error(import.meta.url, e);
        }
      })
    } catch (e) {
      return global.logs.error(import.meta.url, e);
    }
  }
}