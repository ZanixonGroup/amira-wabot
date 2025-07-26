export default [{
  tag: "islami",
  name: "tafsir quran",
  command: ["tafsir"],
  code: async({ client, remote, m, text, plugins, MessageCollector, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Tolong berikan nomor urutan surah nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .tafsir 2`
      , thumb);

      const result = await plugins.quran_tafsir(parseInt(text));
      if(!result.status) return m.reply(`Maaf kak, amira gagal mendapatkan data nya ${facemoji.sad}`, thumb);
      const tafsir = result.data.tafsir;
      
      m.reply(`Tafsir surah *${result.data.namaLatin}*\n` +
        `\n` +
        `*Detail surah:*\n` +
        `> Nama: *${result.data.nama}*\n` +
        `> Arti: *${result.data.arti}*\n` +
        `> Jumlah ayat: *${result.data.jumlahAyat}*\n` +
        `\n` +
        `Silahkan kakak pilih tafsiran ayat antara *1* sampai *${result.data.jumlahAyat}* untuk melihat tafsiran!\n` +
        `\n` +
        `*Note:*\n` +
        `> Kakak bisa kirim langsung nomor ayat yang ingin dilihat, nanti amira akan kirimkan tafsiran nya.`
      , thumb)
      
      const col = new MessageCollector(m, {
        timeout: 120 * 1000
      });
      
      col.on("collect", async(msg) => {
        if(!Number.isInteger(parseInt(msg.body))) return m.reply(`Maaf kak, pilihan yang kakak beri tidak valid ${facemoji.sad}`, thumb);
        if(!tafsir[(parseInt(msg.body) - 1)].teks) return m.reply(`Maaf kak, tafsiran pada ayat ${msg.body} tidak ada ${facemoji.sad}`, thumb);
        await m.reply(`*Tafsir surah ${result.data.namaLatin} ayat ${msg.body}*\n\n` + tafsir[(parseInt(msg.body) - 1)].teks, thumb);
        await m.reply(`Apa ada ayat lain yang ingin kakak lihat tafsiran nya? kakak bisa kirim lagi nomor ayat nya ya ${facemoji.joy}`)
      });
      
      col.on("end", async({ status }) => {
        if(status === "collected") return;
        await m.reply(`Maaf kak, sesi buka tafsir Al-Quran nya amira akhiri ya karna waktu nya sudah habis, kakak bisa panggil lagi kok command tafsir nya ${facemoji.sad}`, thumb)
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]