export default [{
  tag: "convert",
  name: "sticker brat",
  command: ["brat", "stickerbrat", "sbrat"],
  cooldown: {
    status: true,
    duration: 5000
  },
  code: async({ client, remote, m, quoted, mimetype, text, plugins, Func, facemoji, alertMessage, logs, MessageBuilder }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan text brat nya kak ${facemoji.joy}\n` +
      `\n` +
      `*Arguments:*\n` +
      `> --gif (opsi untuk membuat sticker brat animasi)\n` +
      `\n` +
      `*Contoh:*\n` +
      `> .brat kocak lu 😂\n` +
      `> .brat mana sprei gratis nya wok --gif`
      , message)
      const args = Func.parseArgs(text);
      const brat = await plugins.brat(text.replace(/--\w+/, ""), Object.keys(args).includes("gif"));
      if(!brat.status) return m.reply(`Maaf kak, amira gagal membuatkan sticker brat nya ${facemoji.sad}`, message)
      let exif = {
        packName: "Created by Amira Chatbot\n" +
          "\n" +
          "Bot: +62 856-9710-39023\n" +
          "Gc: s.id/znxnwa\n" +
          "\n" +
          "Copyright © Zanixon Group 2024",
        packPublish: ""
      }
      client.sendMedia(remote, brat.image, m, { asSticker: true, ...exif });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]