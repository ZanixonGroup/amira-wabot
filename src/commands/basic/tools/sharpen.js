export default [{
  tag: "tools",
  name: "sharpen",
  command: ["sharpen", "sharp", "tajamkan"],
  code: async({ client, m, quoted, mimetype, remote, MessageBuilder, plugins, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Sharpen Image | Amira Assistant")
        .build()
      
      if(!/(webp|jpeg|jpg|png)/.test(mimetype)) return m.reply(`Balas gambar nya kak ${facemoji.joy}`, thumb);
      const buffer = await quoted.download();
      const img = await plugins.sharpen(buffer);
      if(!img.status) return m.reply(`Maaf kak, amira gagal mempertajam gambarnya ${facemoji.sad}`, thumb);
      await client.sendMedia(remote, img.image, m, thumb);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]