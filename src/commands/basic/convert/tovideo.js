import ezgif from "ezgif-node";

export default [{
  tag: "convert",
  name: "sticker to video",
  command: ["tovideo", "tovid", "stickertovideo","stovid"],
  code: async({ client, m, remote, quoted, isMedia, mimetype, facemoji, alertMessage, logs, MessageBuilder }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!isMedia && !/\/webp/.test(mimetype)) return m.reply(`Pesan tersebut bukan media sticker kak ${facemoji.sigh}`, message);
      if(!quoted.isAnimated) return m.reply(`Sticker tersebut bukan gif kak ${facemoji.sigh}`, message);
      const buffer = await quoted.download();
      const media = await ezgif.convert({
        type: "webp-mp4",
        file: buffer,
        filename: Date.now() + ".webp"
      });
      if(!media.endsWith(".mp4")) return m.reply(`Maaf kak, amira gagal mengkonversi sticker nya ke video ${facemoji.sad}`, message)
      client.sendMedia(remote, media, m, {
        mimetype: "video/mp4",
        caption: `Ini hasilnya kak, jangan lupa follow saluran info amira ya ${facemoji.happy}`,
        ...message
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]