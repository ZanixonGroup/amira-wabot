export default [{
  tag: "maker",
  name: "meme",
  command: ["creatememe", "cmim"],
  cooldown: {
    status: true,
    duration: 5000
  },
  code: async({ client, remote, m, quoted, isMedia, mimetype, text, plugins, smeme = plugins.smeme, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Masukan text nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .meme teks bawah | teks atas`, message);
      if(!/(jpeg|jpg|png|webp)/.test(mimetype)) return m.reply(`Maaf kak, tipe media tersebut tidak di dukung ${facemoji.sad}`, message);
      
      const [bottom, top] = text.split("|");
      const buffer = await quoted.download();
      const meme = await smeme(top, bottom, buffer);
      await client.sendMedia(remote, meme.image, m, {
        caption: `Ini gambar nya kak ${facemoji.joy}`,
        ...message
      })
    } catch (e) {}
  }
}]