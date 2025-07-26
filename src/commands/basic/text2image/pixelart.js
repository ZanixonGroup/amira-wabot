export default [{
  tag: "AI Text2image",
  name: "pixelart",
  command: ["pixelart"],
  cooldown: {
    status: true,
    duration: 5000
  },
  disable: {
    status: false,
    message: "Maaf kak, sistem AI pixelart sedang error."
  },
  code: async({ client, remote, m, text, plugins, pixelart = plugins.pixelart, MessageBuilder, facemoji, logs, alertMessage }) => {
  try {
    const message = new MessageBuilder()
      .setStyle(2)
      .build()
    
    if(!text) return m.reply(`Tolong berikan prompt nya kak ${facemoji.joy}\n` +
      `\n` +
      `*Contoh:*\n` +
      `> .pixelart stray cat on the street`, message);
    const img = await pixelart(text);
    if(!img.status) return m.reply(`Maaf kak, amira gagal membuat gambarnya ${facemoji.sad}`, message);
      /* if(filter.data.isNsfw) {
    const filter = await plugins.nsfwFilter(img.image)
        const alertThumb = new MessageBuilder()
          .setStyle(1)
          .setThumbnailTitle("Not Safe Image Content!")
          .setThumbnailBody("Mohon bijaklah dalam menggunakan fitur ini.")
          .setThumbnailImage(filter.data.nsfwAlertImg)
          .build()
        return m.reply(`Maaf kak, gambar yang akan ditampilkan tidak aman dan amira tidak akan mengirim/menampilkan nya ${facemoji.sad}`, alertThumb)
      } */
    await client.sendMedia(remote, img.image, m, {
      caption: `Ini gambar nya kak ${facemoji.joy}`,
      mimetype: "image/png",
      ...message
    })
  } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]