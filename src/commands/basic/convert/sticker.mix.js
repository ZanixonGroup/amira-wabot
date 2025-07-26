export default [{
  tag: "convert",
  name: "sticker",
  command: ["emojimix", "stickermix", "smix"],
  cooldown: {
    status: true,
    duration: 5000
  },
  code: async({ client, remote, m, quoted, mimetype, text, plugins, facemoji, alertMessage, logs, MessageBuilder }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan resep emoji nya kak ${facemoji.joy}\n` +
      `\n` +
      `*Contoh:*\n` +
      `> .smix 😱+🤪`
      , message)
      const mixed = await plugins.emojimix(text);
      if(!mixed.status) return m.reply(`Maaf kak, amira gagal membuatkan mix emoji nya, pastikan format yang kakak masukan benar yaa ${facemoji.sad}\n` +
      `\n` +
      `*Contoh:*\n` +
      `> .smix 😱+🤪`
      , message)
      let exif = {
        packName: "Created by Amira Chatbot\n" +
          "\n" +
          "Bot: +62 856-9710-39023\n" +
          "Gc: s.id/znxnwa\n" +
          "\n" +
          "Copyright © Zanixon Group 2024",
        packPublish: ""
      }
      client.sendMedia(remote, mixed.emoji[0], m, { asSticker: true, ...exif });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]