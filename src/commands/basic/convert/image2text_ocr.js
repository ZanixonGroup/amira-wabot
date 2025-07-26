export default [{
  tag: "convert",
  name: "optical character recognition",
  command: ["jaditeks", "ocr", "jaditext"],
  cooldown: {
    status: true,
    duration: 15000
  },
  code: async({ client, m, quoted, mimetype, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build();
      
      if(!quoted.isMedia) return m.reply(`Tolong balas gambar yang akan di konversi jadi teks kak ${facemoji.joy}`, thumb);
      if(!/(png|jpeg|jpg|webp)/.test(mimetype)) return m.reply(`Maaf kak, tipe media tersebut tidak didukung ${facemoji.sad}`, thumb);
      const cvt = await plugins.image2text(await quoted.download());
      if(!cvt.status) return m.reply(`Maaf kak, proses konversi gambar jadi teks nya gagal, silahkan coba lagi lain kali ${facemoji.sad}`, thumb);
      
      const thumb2 = new MessageBuilder()
        .setStyle(1)
        .setThumbnailTitle("Image to text | OCR")
        .build()
        
      m.reply(`${cvt.text}`, thumb2)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]