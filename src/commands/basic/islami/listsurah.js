export default [{
  tag: "islami",
  name: "surah quran",
  command: ["listsurah"],
  code: async({ client, remote, m, text, plugins, MessageCollector, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()

      const result = await plugins.quran_listsurah();
      if(!result.status) return m.reply(`Maaf kak, amira gagal mendapatkan data nya ${facemoji.sad}`, thumb);
      const surah = result.data;
      
      m.reply(`*Daftar lengkap surah yang ada di dalam kitab suci Al-Quran* ${facemoji.joy}\n` +
        `\n` +
        `*Daftar surah:*\n` +
        (surah.map(d => `${d.nomor}. ${d.namaLatin} - (${d.arti})`)).join("\n")
      , thumb)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]