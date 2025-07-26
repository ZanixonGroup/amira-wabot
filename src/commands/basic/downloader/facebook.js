export default [{
  tag: "downloader",
  name: "fbdl",
  command: ["facebook", "fb", "fbdl", "facebookdl"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, MessageCollector, facemoji, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan link video nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .fbdl https://www.facebook.com/share/r/q6dzeiGe44BNTEuA",
      message);
      const fbdl = await plugins.fbdl(text);
      if(!fbdl.status) return m.reply(`Maaf kak, link video facebook nya tidak valid atau ada kendala lain ${facemoji.sad}`, message);
      const videos = fbdl.data?.hd || fbdl.data?.sd
      
      const thumbnail = new MessageBuilder()
        .setStyle(1)
        .setThumbnailTitle(fbdl.data?.title)
        .setThumbnailBody("Facebook Downloader | Amira Assistant")
        .setThumbnailImage(fbdl.data?.thumbnail)
        .build()
        
        await client.sendMedia(remote, videos, m, {
          mimetype: "video/mp4"
        });
        
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]