export default [{
  tag: "convert",
  name: "sticker",
  command: ["sticker","stiker","s","wm","stickerwm","stikerwm","swm"],
  cooldown: {
    status: true,
    duration: 5000
  },
  code: async({ client, m, quoted, mimetype, text, facemoji, alertMessage, logs, MessageBuilder }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!quoted.isMedia) return m.reply(`Balas gambar/video nya kak ${facemoji.joy}`, message)
      if(!/image|video|webp/i.test(mimetype)) return m.reply(`Maaf kak, media tidak valid ${facemoji.sad}`, message);
      const buffer = await quoted.download();
      let exif;
      if(text) {
        const [name, author] = text.split("|");
        exif = { packName: name ? name : "", packPublish: author ? author : "" };
      } else {
        exif = {
          packName: "Created by Amira Chatbot\n" +
            "\n" +
            "Bot: +62 856-9710-39023\n" +
            "Gc: s.id/znxnwa\n" +
            "\n" +
            "Copyright © Zanixon Group 2024",
          packPublish: ""
        };
      }
      m.reply(buffer, { asSticker: true, ...exif });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]