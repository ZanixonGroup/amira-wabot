import { format } from "util";


async function buildSession(input, user_id, db) {
  try {
    if(!input) return { status: false, messages: "undefined reading role or content" };
    if(!await db.has(user_id + ".session", "chats")) {await db.set(user_id + ".session", [], "chats")}
    const messages = await db.get(user_id + ".session", "chats") || [];
    if(messages.length > 60) {
      messages.shift()
      messages.shift()
    }
    const new_message = {
      role: input?.role || "user",
      parts: input.parts || {text:""}
    };
    const output = await db.set(user_id + ".session", [...messages, ...input], "chats");
    return {
      status: true,
      hasUser: await db.has(user_id, "chats"),
      output,
      msg: messages.length
    }
  } catch (e) {
    return { status: false, message: format(e) }
  }
}

export default buildSession;