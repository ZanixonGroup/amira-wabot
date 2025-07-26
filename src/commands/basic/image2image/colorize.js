export default [{
  tag: "AI Image2image",
  name: "color",
  command: ["color", "colorize", "warnai"],
  code: async({ client, m, quoted, remote, plugins, MessageBuilder, mimetype, facemoji, alertMessage }) => {
    try {
      let message = new MessageBuilder()
      .setStyle(2)
      .build()
      
      if(!quoted.isMedia) return m.reply(`Balas foto jadul/lawas/hitam putih yang akan diwarnai kak ${facemoji.joy}`, message);
      if(!/(image|jpg|jpeg|png|webp)/i.test(mimetype)) return m.reply(`Maaf kak, media tidak valid ${facemoji.sad}`, message);
      let buffer = await quoted.download();
      let colored = await plugins.colorize(buffer);
      if(!colored.success) return m.reply(`Maaf kak, amira gagal untuk mewarnai gambar ${facemoji.sad}`, message);
      
      let thumbnail = new MessageBuilder()
      .setStyle(2)
      .setThumbnailTitle("Color Image | Amira Assistant")
      .build()
      
      await client.sendMedia(remote, colored.image, m, {
        caption: `Ini hasil dari konversi nya kak ${facemoji.joy}`,
        ...thumbnail
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]
