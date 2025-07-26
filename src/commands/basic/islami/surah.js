export default [{
  tag: "islami",
  name: "surah quran",
  command: ["surah"],
  code: async({ client, remote, m, text, plugins, MessageCollector, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Tolong berikan nomor urutan surah nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .surah 2`
      , thumb);

      const result = await plugins.quran_tafsir(parseInt(text));
      if(!result.status) return m.reply(`Maaf kak, amira gagal mendapatkan data nya ${facemoji.sad}`, thumb);
      const ayat = result.data.ayat;
      
      m.reply(`Info surah *${result.data.namaLatin}*\n` +
        `\n` +
        `*Detail surah:*\n` +
        `> Nama: *${result.data.nama}*\n` +
        `> Arti: *${result.data.arti}*\n` +
        `> Tempat turun: *${result.data.tempatTurun}*\n` +
        `> Jumlah ayat: *${result.data.jumlahAyat}*\n` +
        `\n` +
        `${result.data.deskripsi.replaceAll("\u003C/i\u003E", "")}`
      , thumb)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]