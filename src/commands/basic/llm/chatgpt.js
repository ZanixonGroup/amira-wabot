export default [{
  tag: "AI Smart",
  name: "chatgpt",
  command: ["chatgpt", "gpt", "ai"],
  options: {
    isPremium: false
  },
  cooldown: {
    status: true,
    duration: 3000
  },
  code: async({ client, m, text, MessageBuilder, plugins, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan pertanyaan nya kak, amira akan berusaha menjawabnya ${facemoji.joy}`, message);
      const amira = await plugins.amira({
        text,
        username: m.pushName,
        timestamp: m.timestamp
      });
      if(!amira.status) return m.reply(`Maaf kak, amira sepertinya tidak bisa merespon apa yg kakak katakan ${facemoji.sad}`);
      m.reply(amira.answer, message);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]