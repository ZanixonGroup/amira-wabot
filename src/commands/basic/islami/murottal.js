export default [{
  tag: "islami",
  name: "murottal quran",
  command: ["murottal"],
  code: async({ client, remote, m, text, plugins, MessageCollector, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Tolong berikan nomor urutan surah nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .murottal 2\n` +
        `> .murottal <surah>`
      , thumb);

      const result = await plugins.quran_surah(parseInt(text));
      if(!result.status) return m.reply(`Maaf kak, amira gagal mendapatkan data nya ${facemoji.sad}`, thumb);
      const audio = result.data.audioFull["05"];
      
      await m.reply(`Tunggu sebentar ya kak, audio sedang dikirim...\n` +
        `\n` +
        `*Detail surah:*\n` +
        `> Nama: *${result.data.nama}*\n` +
        `> Nama latin: *${result.data.namaLatin}*\n` +
        `> Arti: *${result.data.arti}*\n` +
        `> Tempat turun: *${result.data.tempatTurun}*\n` +
        `> Jumlah ayat: *${result.data.jumlahAyat}*\n` +
        `\n` +
        `${result.data.deskripsi.replaceAll("\u003C/i\u003E", "")}`
      , thumb)
      await client.sendMedia(remote, audio, m, {
        fileName: `Murottal surah ${result.data.namaLatin} - Misyari Rasyid` + ".mp3"
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]