export default [{
  tag: "AI Text2image",
  name: "animagine",
  command: ["animagine"],
  options: {
    isPremium: true
  },
  cooldown: {
    status: true,
    duration: 30000
  },
  code: async({ client, m, remote, text, plugins, Func, MessageBuilder, facemoji, logs, alertMessage }) => {
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
        `> .animagine cute little neko maid girl --ar 5:12`
      , message);
      const match = text.match(/--ar (\d+:\d+)/);
      const ar = match ? match[1] : "4:7";
      let prompt = text.replace(`--ar ${ar}`, ``);
      const aspectRatio = {
        "1:1": { reso: "1024 x 1024", w: 1024, h: 1024 },
        "9:7": { reso: "1152 x 896", w: 2048, h: 512 },
        "7:9": { reso: "896 x 1152", w: 512, h: 2048 },
        "19:13": { reso: "1216 x 832", w: 2048, h: 512 },
        "13:19": { reso: "832 x 1216", w: 512, h: 2048 },
        "7:4": { reso: "1344 x 768", w: 2048, h: 512 },
        "4:7": { reso: "768 x 1344", w: 512, h: 2048 },
        "12:5": { reso: "1536 x 640", w: 2048, h: 512 },
        "5:12": { reso: "640 x 1536", w: 512, h: 2048 }
      };
      const scale = aspectRatio[ar];
      const axl = await plugins.animagineXL({
        prompt,
        width: scale.w,
        height: scale.h,
        aspect_ratio: scale.reso
      });
      if(!axl.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      const image = axl.data.images[0];
      const meta = axl.data.metadata;
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
      client.sendMedia(remote, image, m, {
        caption: `Ini gambar nya kak ${facemoji.joy}\n` +
          `\n` +
          `*Prompt:*\n` +
          `> ${text}\n` +
          `\n` +
          `*Detail:*\n` +
          `> Reso: *${meta.resolution}*\n` +
          `> Model: *${meta.Model.Model}*\n`,
        mimetype: "image/png",
        fileName: "image-generated-by-amira-ai.png"
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]