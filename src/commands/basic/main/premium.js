export default [{
  tag: "main",
  name: "premium",
  disable: {
    status: true,
    message: "Penyewaan bot sedang ditutup, dibuka saat nomor sudah aman dari banned."
  },
  command: ["premium", "premiumbot"],
  code: async({ client, m, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(1)
        .build()
      
      m.reply(`Halo kak, dibawah ini adalah paketan harga premium bot amira ${facemoji.joy}\n` +
        `\n` +
        `Kamu ingin jadi pengguna prioritas amira? dengan premium, kamu bisa melakukannya!!!\n` +
        `\n` +
        `*Paket 1 Bulan:* Rp 5.000\n` +
        `- Tanpa antri proses perintah\n` +
        `- Mendapat akses fitur premium\n` +
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