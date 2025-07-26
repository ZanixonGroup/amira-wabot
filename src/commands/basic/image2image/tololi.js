export default [{
  tag: "AI Image2image",
  name: "tololi",
  command: ["jadiloli", "tololi"],
  options: {
    isPremium: true
  },
  code: async({ client, remote, m, quoted, mimetype, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!/(png|jpeg|webp|jpg)/.test(mimetype)) return m.reply(`Maaf kak, tipe media tersebut tidak di dukung ${facemoji.sad}`, thumb);
      const buffer = await quoted.download();
      const convert = await plugins.tololi(buffer);
      if(!convert.status) return m.reply(`Maaf kak, amira gagal mengubah gambar nya ${facemoji.sad}`, thumb);
      return await client.sendMedia(remote, convert.image, m, {
        caption: `Ini gambarnya sudah jadi kak ${facemoji.joy}`,
        mimetype: "image/png",
        ...thumb
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]