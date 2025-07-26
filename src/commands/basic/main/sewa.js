export default [{
  tag: "main",
  name: "sewa",
  disable: {
    status: true,
    message: "Penyewaan bot sedang ditutup, dibuka saat nomor sudah aman dari banned."
  },
  command: ["sewa", "sewabot"],
  code: async({ client, m, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(1)
        .build()
      
      m.reply(`Halo kak, dibawah ini adalah paketan harga sewa bot amira ${facemoji.joy}\n` +
        `\n` +
        `Kamu ingin amira join grup kamu dan menetap disana? kamu bisa mulai langganan sewa mulai dari Rp 5.000 aja lohh, cek paket sewa dibawah yuk dan tentukan harga yang pas dan sesuai untuk kamu...\n` +
        `\n` +
        `*Paket Silver:* Rp 5.000\n` +
        `- Join grup selama 1 minggu\n` +
        `- Penyewa mendapat akses premium 3 hari\n` +
        `\n` +
        `*Paket Gold:* Rp 15.000\n` +
        `- Join grup selama 1 bulan\n` +
        `- Penyewa mendapat akses premium 13 hari\n` +
        `- Bebas limit untuk grup selama waktu sewa\n` +
        `\n` +
        `*Paket Diamond:* Rp 25.000\n` +
        `- Join grup selama 2 bulan\n` +
        `- Penyewa mendapat akses premium 30 hari\n` +
        `- Bebas limit untuk grup selama waktu sewa\n` +
        `\n` +
        `*Paket Platinum:* Rp 50.000\n` +
        `- Join grup secara permanen\n` +
        `- Penyewa mendapat akses premium 60 hari\n` +
        `- Bebas limit untuk grup selama waktu sewa\n` +
        `\n` +
        `Semua paket masing-masing mendapat support admin, jika kamu berminat silahkan hubungi:\n` +
        `- Admin: wa.me/6285697103902`
      , thumb)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]