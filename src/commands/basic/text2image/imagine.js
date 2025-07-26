export default [{
  tag: "AI Text2image",
  name: "imagine",
  command: ["imagine"],
  options: {
    isPremium: true
  },
  cooldown: {
    status: true,
    duration: 30000
  },
  code: async({ client, m, remote, text, plugins, Func, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const model = ["MeinaMix v9", "Counterfeit v3.0", "MajicmixRealistic v4"];
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      const [prompt, modelType] = text.split("|");
      if(!text) return m.reply(`Berikan prompt gambar nya kak, amira akan berusaha membuatkan gambar nya ${facemoji.joy}`, message);
      if(modelType > 3) return m.reply(`Maaf kak, model AI nya tidak valid, cek dibawah untuk model yang tersedia ${facemoji.joy}` + 
        "\n\n" +
        "*Model tersedia:*\n" +
        "1. MeinaMix v9\n" +
        "2. Counterfeit v3.0\n" +
        "3. MajicmixRealistic v4" +
        "\n\n" +
        "*Contoh:*\n" +
        "> .imagine 1girl, roxy migurdia, beautiful|1", message);
      const image = await plugins.imagine(prompt);
      if(!image.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      const filter = await plugins.nsfwFilter((await Func.fetchBuffer(image)).data)
      if(!filter.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      if(filter.data.sensitivity >= 70) {
        const alertThumb = new MessageBuilder()
          .setStyle(1)
          .setThumbnailTitle("Not Safe Image Content!")
          .setThumbnailBody("Mohon bijaklah dalam menggunakan fitur ini.")
          .setThumbnailImage(filter.data.nsfwAlertImg)
          .build()
        return m.reply(`Maaf kak, gambar yang akan ditampilkan tidak aman dan amira tidak akan mengirim/menampilkan nya ${facemoji.sad}`, alertThumb)
      }
      const caption = `Ini gambarnya kak ${facemoji.happy}

*Model:*
> ${model[modelType - 1]}

*Prompt:*
> ${prompt}`;
      client.sendMedia(remote, image.data.imgs[0], m, {
        caption,
        mimetype: "image/png",
        filename: "imagine.png",
        ...message
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]