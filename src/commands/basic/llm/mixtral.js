export default [{
  tag: "AI Smart",
  name: "mixtral",
  command: ["mixtral", "mistral"],
  options: {
    isPremium: true
  },
  cooldown: {
    status: true,
    duration: 3000
  },
  code: async({ client, m, text, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan pertanyaan nya kak, mixtral akan berusaha menjawabnya ${facemoji.joy}`, message);
      const mixtral = await plugins.mixtral(text);
      if(!mixtral.status) return m.reply(`Maaf kak, model gagal merespon pertanyaan ${facemoji.joy}`, message);
      m.reply(`${mixtral.answer}`, message);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]