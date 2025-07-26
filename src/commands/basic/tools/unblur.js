export default [{
  tag: "tools",
  name: "unblur",
  command: ["unblur", "noblur", "noburik", "antiburik", "jernihkan"],
  code: async({ client, remote, m, quoted, mimetype, MessageBuilder, plugins, logs, alertMessage, facemoji }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Unblur Image | Amira Assistant")
        .build()
      
      if(!quoted.isMedia) return m.reply(`Balas gambar nya kak ${facemoji.joy}`, thumb)
      if(!/(webp|jpeg|jpg|png)/.test(mimetype)) return m.reply(`Fitur ini hanya support gambar kak ${facemoji.sigh}`, thumb);
      const buffer = await quoted.download();
      const img = await plugins.unblur(buffer);
      if(!img.status) return m.reply(`Maaf kak, amira gagal saat memproses gambar ${facemoji.sad}`, thumb);
      await client.sendMedia(remote, img.image, m, {
        fileName: "amira_text_remover.png",
        ...thumb
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]