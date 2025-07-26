export default [{
  tag: "AI Text2image",
  name: "midjourney",
  command: ["midjourney", "mj"],
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
        `2. --style 4k (Opsi: 4k, photo, cinematic, anime, 3d, raw)\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .midjourney a girl, beautiful, looking at viewer --ar 5:12 --style anime`
      , message);
      let ratio = text.match(/--ar (\d+:\d+)/);
      let style = text.match(/--style\s+(\w+)/);
      const aspectRatio = {
        "1:1": { reso: "1024 x 1024", w: 1024, h: 1024 },
        "9:7": { reso: "1152 x 896", w: 1152, h: 896 },
        "7:9": { reso: "896 x 1152", w: 896, h: 1152 },
        "19:13": { reso: "1216 x 832", w: 1216, h: 832 },
        "13:19": { reso: "832 x 1216", w: 832, h: 1216 },
        "7:4": { reso: "1344 x 768", w: 1344, h: 768 },
        "4:7": { reso: "768 x 1344", w: 768, h: 1344 },
        "12:5": { reso: "1536 x 640", w: 1536, h: 640 },
        "5:12": { reso: "640 x 1536", w: 640, h: 1536 }
      };
      if(!["4k", "photo", "cinematic", "anime", "3d", "raw"].includes((style ? style[1].toLowerCase() : "4k"))) return m.reply(`Style tersebut tidak tersedia kak ${facemoji.sad}`, message);
      style = {
        "4k": "2560 x 1440",
        "photo": "Photo",
        "cinematic": "Cinematic",
        "anime": "Anime",
        "3d": "3D Model",
        "raw": "(no style)"
      }[(style ? style[1].toLowerCase() : "4k")];
      const scale = aspectRatio[ratio ? ratio[1] : "4:7"];
      const mj = await plugins.midjourney({
        prompt: text,
        width: scale.w,
        height: scale.h,
        style
      });
      if(!mj.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      const image = mj.data.images[0];
      const meta = mj.data.metadata;
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
          `> Reso: *${scale.w + " x " + scale.h}*\n` +
          `> Model: *MidJourney*\n`,
        mimetype: "image/png",
        fileName: "image-generated-by-amira-ai.png"
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]