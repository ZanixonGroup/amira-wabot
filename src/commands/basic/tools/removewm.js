export default [{
  tag: "tools",
  name: "removewm",
  command: ["removewm", "rmwm", "nowm", "nowm"],
  code: async({ client, remote, m, quoted, mimetype, MessageBuilder, plugins, logs, alertMessage, facemoji }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Watermark Remover | Amira Assistant")
        .build()
      
      if(!quoted.isMedia) return m.reply(`Balas gambar nya kak ${facemoji.joy}`, thumb)
      if(!/(webp|jpeg|jpg|png)/.test(mimetype)) return m.reply(`Fitur ini hanya support gambar kak ${facemoji.sigh}`, thumb);
      const buffer = await quoted.download();
      const img = await plugins.removeWm(buffer);
      if(!img.status) return m.reply(`Maaf kak, amira gagal saat memproses gambar ${facemoji.sad}`, thumb);
      await client.sendMedia(remote, img.image, m, {
        fileName: "amira_wm_remover.png",
        ...thumb
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]