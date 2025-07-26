export default [{
  tag: "AI Text2image",
  name: "flux",
  command: ["flux"],
  disable: {
    status: false,
    message: "Command ini sedang error!"
  },
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
        `*Contoh:*\n` +
        `> .flux cute kitten walking at the park`
      , message);
      const match = text.match(/--ar (\d+:\d+)/);
      const ar = match ? match[1] : "1:1";
      let prompt = text.replace(`--ar ${ar}`, ``);
      const aspectRatio = {
        "1:1": { reso: "1024x1024" },
        "1:2": { reso: "512x1024" },
        "3:2": { reso: "768x512" },
        "3:4": { reso: "768x1024" },
        "9:16": { reso: "576x1024" },
        "16:9": { reso: "1024x576" }
      };
      const scale = aspectRatio[ar];
      if(!scale?.reso) return m.reply(`Maaf kak, ukuran aspek rasio tersebut tidak support untuk model flux ${facemoji.sad}`, message)
      const flux = await plugins.flux(prompt);
      if(!flux.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      const image = flux.image;
      client.sendMedia(remote, image, m, {
        caption: `Ini gambar nya kak ${facemoji.joy}\n` +
          `\n` +
          `*Prompt:*\n` +
          `> ${text}\n` +
          `\n` +
          `*Detail:*\n` +
          `> Reso: *1024x1024*\n` +
          `> Model: *Flux.1 Schnell*\n`,
        mimetype: "image/png",
        fileName: "image-generated-by-amira-ai.png"
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]