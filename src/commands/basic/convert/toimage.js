export default [{
  tag: "convert",
  name: "sticker to image",
  command: ["toimage", "toimg", "stickertoimage", "stoimg"],
  code: async({ client, m, remote, quoted, isMedia, mimetype, plugins, facemoji, alertMessage, logs, MessageBuilder }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!isMedia && !/\/webp/.test(mimetype)) return m.reply(`Pesan tersebut bukan media sticker kak ${facemoji.sigh}`, message);
      const buffer = await quoted.download();
      const media = await plugins.webp2png(buffer);
      if(!media.status) return m.reply(`Maaf kak, amira gagal mengkonversi sticker nya ke gambar ${facemoji.sad}`, message)
      client.sendMedia(remote, media.image, m, {
        caption: `Ini hasilnya kak, jangan lupa follow saluran info amira ya ${facemoji.happy}`,
        mimetype: "image/png",
        ...message
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]