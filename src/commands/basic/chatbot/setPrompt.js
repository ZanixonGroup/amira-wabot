export default [{
  tag: "AI Chatbot",
  name: "set prompt",
  command: ["setprompt"],
  code: async({ client, db = client.db, m, sender, facemoji, MessageBuilder, logs }) => {
    try {
      const userId = sender.split("@")[0];
      const prompt = m.text;
      
      if (!prompt) return m.reply(`Maaf kak, prompt tidak boleh kosong ${facemoji.sigh}`);
      
      await client.chatbot.setPrompt(userId, prompt);
      m.reply(`Berhasil mengatur prompt baru untuk chatbot ${facemoji.joy}`);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}];