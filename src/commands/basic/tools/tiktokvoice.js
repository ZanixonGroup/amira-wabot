export default [{
  tag: "tools",
  name: "tiktok voice",
  command: ["tiktokvoice", "tikv", "ttv"],
  cooldown: {
    status: true,
    duration: 15000
  },
  code: async({ client, m, remote, text, MessageBuilder, plugins, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Tiktok Voice | Amira Assistant")
        .build()
      
      if(!text) return m.reply(`Tolong berikan teks yang akan diucapkan kak ${facemoji.joy}`, thumb);
      const voice = await plugins.tiktokVoice(text);
      if(!voice.status) return m.reply(`Maaf kak, amira gagal membuat voice nya ${facemoji.sad}`, thumb);
      await client.sendMedia(remote, voice.sound, m, {
        mimetype: "audio/mp4",
        caption: `Ini voice tiktok nya kak ${facemoji.joy}`
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]