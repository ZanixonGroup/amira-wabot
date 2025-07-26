export default [{
  tag: "AI Smart",
  name: "llama",
  command: ["llama","llama3"],
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
      
      if(!text) return m.reply(`Berikan pertanyaan nya kak, llama3 akan berusaha menjawabnya ${facemoji.joy}`, message);
      const llama = await plugins.llama3(text, "kamu adalah asisten berbahasa indonesia!");
      if(!llama.status) return m.reply(`Maaf kak, model gagal merespons pertanyaan ${facemoji.sad}`, message)
      const content = llama?.answer;
      m.reply(`${content}`, message);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]