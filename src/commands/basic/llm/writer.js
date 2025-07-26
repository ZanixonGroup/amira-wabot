export default [{
  tag: "AI Smart",
  name: "writer",
  command: ["writer"],
  code: async({ m, remote, text, plugins, MessageBuilder, facemoji, alertMessage }) => {
    try {
      let message = new MessageBuilder()
      .setStyle(2)
      .build()
      
      if(!text) return m.reply(`Berikan instruksi nya kak, amira akan bantu buatkan ${facemoji.joy}`, message);
      let story = await plugins.writer(text);
      if(!story.status) return m.reply(`Maaf kak, amira gagal membuatkan nya ${facemoji.sad}`, message);
      
      return await m.reply(story.content, message);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]