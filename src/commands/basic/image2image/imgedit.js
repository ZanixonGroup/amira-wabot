export default [{
  tag: "AI Image2image",
  name: "imgedit",
  command: ["imgedit", "aiedit"],
  options: {
    isPremium: true
  },
  code: async({ client, remote, m, quoted, text, mimetype, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!quoted.isMedia) return m.reply(`Tolong balas pesan gambar yang ingin di edit kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .imgedit ubah latar belakang gambar menjadi di laut\n` +
        `> .aiedit ubah ekspresi nya menjadi tersenyum bahagia`
      , thumb)
      if(!/(png|jpeg|webp|jpg)/.test(mimetype)) return m.reply(`Maaf kak, tipe media tersebut tidak di dukung ${facemoji.sad}`, thumb);
      const buffer = await quoted.download();
      const convert = await plugins.imgedit(buffer, text);
      if(!convert.success) return m.reply(`Maaf kak, amira gagal mengubah gambar nya ${facemoji.sad}`, thumb);
      const filter = await plugins.nsfwFilter(convert.result.image);
      if(filter.status && filter?.data?.sensivity >= 80) return m.reply(`Maaf kak, hasil gambar yang di edit tidak bisa amira tampilkan karna terlalu sensitif ${facemoji.sad}`, thumb)
      return await client.sendMedia(remote, convert.result.image, m, {
        caption: `Ini gambarnya sudah jadi kak ${facemoji.joy}`,
        mimetype: "image/png",
        ...thumb
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]