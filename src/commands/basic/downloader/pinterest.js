export default [{
  tag: "downloader",
  name: "pinsdl",
  command: ["pinterestdl", "pinsdl", "pindl"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, facemoji, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan link foto pinterest nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .pinsdl https://pin.it/5QYuuU3et\n" +
        "> .pindl https://pin.it/5r49MwDd5",
      message);
      const pinsdl = await plugins.pinsdl(text);
      if(!pinsdl.status) return m.reply(`Maaf kak, Link post pinterest nya tidak valid atau ada kendala lain ${facemoji.sad}`, message);
      const media = pinsdl.media
      
      const thumbnail = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Pinterest Downloader | Amira Assistant")
        .build()
      
      await client.sendMedia(remote, media, m);
        
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]