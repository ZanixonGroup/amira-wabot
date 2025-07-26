export default [{
  tag: "convert",
  name: "sticker",
  command: ["stickertele","stikertele","stele"],
  cooldown: {
    status: true,
    duration: 5000
  },
  code: async({ client, remote, m, quoted, mimetype, text, Func, plugins, isPremium, facemoji, alertMessage, logs, MessageBuilder }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan link sticker telegram nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .stele https://t.me/addstickers/LINE_nachonekodayo`
      , message)
      const sticker = await plugins.stickerTelegram(text);
      if(!sticker.status) return m.reply(`Maaf kak, proses convert sticker telegram nya gagal ${facemoji.sad}`, message);
      const media = sticker.media;
      let now = 0;
      const limit = isPremium ? 120 : 15;
      let exif;
      exif = {
        packName: "Created by Amira Chatbot\n" +
          "\n" +
          "Bot: +62 856-9710-39023\n" +
          "Gc: s.id/znxnwa\n" +
          "\n" +
          "Copyright © Zanixon Group 2024",
        packPublish: ""
      };
      await m.reply(`Mulai mengkonversi sticker... ${facemoji.joy}\n` +
        `\n` +
        `*Details:*\n` +
        `> Pack: *${text}*\n` +
        `> Total sticker: *${media.length}*\n` +
        `> Total limit: *${isPremium ? `120 (PREMIUM)` : 15}*`
      ,message)
      async function process() {
        if(now >= (media.length > limit ? limit : media.length)) return m.reply(isPremium ? `Media sticker berhasil dikirim dengan jumlah ${media.length > 120 ? 120 : media.length} sticker kak ${facemoji.joy}` : `Media sticker berhasil dikirim pada jumlah ${media.length > 15 ? 15 : media.length} dengan maksimal 15 sticker untuk pengguna nom-premium ${facemoji.joy}`, message);
        await client.sendMedia(remote, (await Func.fetchBuffer(media[now])).data, m, {
          asSticker: true,
          ...exif,
          mimetype: "image/webp"
        })
        now++;
        setTimeout(process, 500);
      }
      await process();
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]