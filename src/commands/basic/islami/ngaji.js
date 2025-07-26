export default [{
  tag: "islami",
  name: "ngaji quran",
  command: ["ngaji"],
  code: async({ client, remote, m, text, plugins, MessageCollector, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Tolong berikan nomor urutan surah nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .ngaji 2\n` +
        `> .ngaji <surah>`
      , thumb);

      const result = await plugins.quran_surah(parseInt(text));
      if(!result.status) return m.reply(`Maaf kak, amira gagal mendapatkan data nya ${facemoji.sad}`, thumb);
      const ayat = result.data.ayat;
      
      const arabicNumber = (num) => {
        const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().split('').map(digit => arabicNumbers[digit]).join('');
      }
      
      m.reply(`*# Surah ${result.data.namaLatin} - ${result.data.arti}*\n` +
        `\n` +
        (ayat.map(d => `${arabicNumber(d.nomorAyat)}. ${d.teksArab}\n> ${d.teksLatin}`)).join("\n\n")
      , thumb)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]