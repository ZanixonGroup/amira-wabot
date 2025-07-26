export default [{
  tag: "tools",
  name: "lowres",
  command: ["lowres", "burik"],
  code: async({ client, m, remote, quoted, text, mimetype, MessageBuilder, plugins, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle(`Lowres Tool | Amira Assistant`)
        .build()
      
      if(!/(jpeg|jpg|png)/.test(mimetype)) return m.reply(`Balas gambar nya kak ${facemoji.joy}`, thumb);
      const buffer = await quoted.download();
      const img = await plugins.lowres(buffer, text);
      if(!img.status) return m.reply(`Maaf kak, amira gagal memproses gambar ${facemoji.sad}`, thumb);
      await client.sendMedia(remote, img.image, m, {
        caption: `Ini gambarnya sudah jadi kak ${facemoji.joy}`,
        mimetype: "image/png"
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]