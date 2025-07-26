export default [{
  tag: "downloader",
  name: "soundcloud",
  command: ["soundcloud"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, alertMessage, facemoji }) => {
    try {
      let message = new MessageBuilder()
      .setStyle(2)
      .build()
      
      if(!text) return m.reply(`Berikan link lagunya kak ${facemoji.joy}\n` +
      "\n" +
      "*Contoh: *\n" +
      "> .soundcloud https://soundcloud.com/doom-official-45631102/dj-asmalibrasi",
      message);
      let scdl = await plugins.soundcloud(text);
      if(!scdl.status) return m.reply(`Maaf kak, Link lagu tidak valid atau ada kendala lain ${facemoji.sad}`, message);
      let file = scdl.media
      
      const thumbnail = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Soundcloud Downloader | Amira Assistant")
        .build()
      await m.reply(`Tolong tunggu sebentar ya kak, amira sedang mengirim audio nya ${facemoji.joy}`, thumbnail)
        
      return await client.sendMedia(remote, file, m, {
        caption: `Ini music dari soundcloudnya kak ${facemoji.joy}`,
        mimetype: "audio/mp4"
      })
    } catch (e) {
      m.reply(alertMessage["error"])
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]