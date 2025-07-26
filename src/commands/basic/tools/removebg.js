export default [{
  tag: "tools",
  name: "removebg",
  command: ["removebg", "rmbg", "nobg", "hapusbg"],
  options: {
    isPremium: false
  },
  cooldown: {
    status: true,
    duration: 10000
  },
  code: async({ client, m, remote, text, mimetype, quoted, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!/image\/(jpg|jpeg|png|webp)/.test(mimetype)) return m.reply(`Tolong balas gambar yang dihapus background nya kak ${facemoji.joy}`, message);
      const buffer = await quoted.download();
      if(buffer.length <= 1024) return m.reply(`Gambar tersebut tidak valid kak ${facemoji.sigh}`, message);
      const image = await plugins.removebg(buffer);
      if(!image.status) return m.reply(`Maaf kak, proses penghapusan background gambarnya gagal ${facemoji.sad}`, message);
      client.sendMedia(remote, image.url, m, { mimetype: "image/png", fileName: `amira-removebg-${Date.now()}.png`, caption: `Ini gambarnya kak ${facemoji.happy}`, asDocument: true, ...message });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]