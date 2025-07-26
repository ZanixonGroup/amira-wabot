export default [{
  tag: "convert",
  name: "toaudio",
  command: ["toaudio", "videotoaudio"],
  code: async({ client, m, remote, quoted, mimetype, isMedia, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!mimetype) return m.reply(`Balas atau kirim media nya kak ${facemoji.joy}`, message);
      if(!/(video)/.test(mimetype)) return m.reply(`Media tersebut bukan video kak ${facemoji.sigh}`, message);
      const media = await plugins.video2audio(await quoted.download());
      if(!media.status) return m.reply(`Maaf kak, amira gagal mengkoversi media tersebut ${facemoji.sad}`, message);
      await m.reply(`Bentar ya kak, audio nya lagi dikirim ${facemoji.joy}`, message);
      await client.sendMedia(remote, media.data.audio, m, {
        mimetype: "audio/mp4"
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]