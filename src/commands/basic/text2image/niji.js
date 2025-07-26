export default [{
  tag: "AI Text2image",
  name: "midjourney niji",
  command: ["nijijourney", "niji"],
  disable: {
    status: true,
    message: "Command ini sedang error!"
  },
  options: {
    isPremium: true
  },
  cooldown: {
    status: true,
    duration: 30000
  },
  code: async({ client, m, remote, text, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan prompt gambar nya kak, amira akan berusaha membuatkan gambar nya ${facemoji.joy}\n` +
        `\n` +
        `*Argumen:*\n` +
        `1. --ar 19:13 (Opsi: 1:1, 9:7, 7:9, 19:13, 13:19, 7:4, 4:7, 12:5, 5:12)\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .niji cute little neko maid girl --ar 5:12`
      , message);
      const mj = await plugins.nijiJourney(text);
      if(!mj.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      /* if(filter.data.isNsfw) {
      const filter = await plugins.nsfwFilter(mj.image)
        const alertThumb = new MessageBuilder()
          .setStyle(1)
          .setThumbnailTitle("Not Safe Image Content!")
          .setThumbnailBody("Mohon bijaklah dalam menggunakan fitur ini.")
          .setThumbnailImage(filter.data.nsfwAlertImg)
          .build()
        return m.reply(`Maaf kak, gambar yang akan ditampilkan tidak aman dan amira tidak akan mengirim/menampilkan nya ${facemoji.sad}`, alertThumb)
      } */
      const caption = `Ini gambarnya kak ${facemoji.happy}

*Model:*
> Niji Journey

*Prompt:*
> ${text}`;
      client.sendMedia(remote, mj.image, m, {
        caption,
        mimetype: "image/png",
        filename: "niji_journey.png",
        ...message
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]