export default [{
  tag: "AI Text2image",
  name: "emi",
  command: ["emi"], 
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
      
      if(!text) return m.reply(`Berikan prompt gambar nya kak, amira akan berusaha membuatkan gambar nya ${facemoji.joy}`, message);
      const emi = await plugins.emi(text);
      if(!emi.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      /* if(filter.data.isNsfw) {
      const filter = await plugins.nsfwFilter(emi.data)
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
> EMI

*Prompt:*
> ${text}`;
      client.sendMedia(remote, emi.data, m, {
        caption,
        mimetype: "image/png",
        filename: "emi.png",
        ...message
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]