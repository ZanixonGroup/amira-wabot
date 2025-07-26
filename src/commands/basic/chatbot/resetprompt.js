import prompt from "./../../../libs/prompt.js"

export default [{
  tag: "AI Chatbot",
  name: "reset prompt",
  command: ["resetprompt"],
  code: async({ client, db = client.db, m, sender, facemoji, MessageBuilder, logs }) => {
    try {
      const userId = sender.split("@")[0];
      await client.chatbot.setPrompt(userId, prompt);
      m.reply(`Berhasil mengatur prompt default untuk chatbot ${facemoji.joy}`);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}];