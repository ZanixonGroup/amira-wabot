export default [{
  tag: "AI Smart",
  name: "gemini",
  command: ["gemini", "bard"],
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
      
      if(!text) return m.reply(`Berikan pertanyaan nya kak, gemini akan berusaha menjawabnya ${facemoji.joy}`, message);
      const chat = [
        {
          role: "user",
          content: `You are a helpful assistant and you can call my name as ${m.pushName} right now!`
        },{
          role: "assistant",
          content: "Halo, apa ada yang bisa saya bantu?"
        },{
          role: "user",
          content: text
        }
      ]
      const gemini = await plugins.gemini(chat);
      const content = gemini?.data?.choices[0]?.message?.content;
      m.reply(`${content}`, message);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]