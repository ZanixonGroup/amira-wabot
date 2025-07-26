export default [{
  tag: "owner",
  name: "edit sewa",
  command: ["editsewa", "updatesewa"],
  options: { isOwner: true },
  code: async ({ client, m, text, knex = client.knex, facemoji, logs, alertMessage, Func, MessageBuilder }) => {
    
    const thumb = new MessageBuilder()
      .setStyle(2)
      .setThumbnailTitle("Edit Sewa | Amira Assistant")
      .build();
    try {
      if (!text) {
        return m.reply(`Masukan argumen!\n` +
        `\n` +
        `*Arguments:*\n` +
        `> --link (opt: url group)\n` +
        `> --expired (opt: rent exp)\n` +
        `> --price (opt: number)\n` +
        `> --paid (opt: the rent paid by who?)\n`
      , thumb)
      }

      const { link, expired, price, paid } = Func.parseArgs(text)
      
      const code = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
      if (!code) return m.reply(`Tautan grup tidak valid. ${facemoji.sad}`, thumb);
      
      let { id } = await client.groupGetInviteInfo(code[1]).catch(() => null)
      
      let duration = (Date.now() + Func.parseTime(expired))
      if (!await knex.isAvailable({ sewa_id: id }, "sewa")) return m.reply(`Data sewa dengan link *${link}* tidak ditemukan ${facemoji.sad}`, thumb);
      knex("sewa").where({ sewa_id: id }).update({
        duration,
        price,
        paid_by: paid
      })
        .then(async () => {
          const groupMetadata = await client.groupGetInviteInfo(code)
          m.reply(
            `Berhasil mengedit sewa untuk grup ${groupMetadata.subject || "ID: " + id} ${facemoji.joy}\n\n` +
            `*Perubahan:*\n` +
            `> Durasi: ${duration || "Tidak diubah"}\n` +
            `> Harga: ${price || "Tidak diubah"}\n` +
            `> Dibayar oleh: ${paid || "Tidak diubah"}`,
            thumb);
        })
        .catch(e => {
          m.reply(`Maaf kak, pengeditan sewa gagal.. silahkan cek logs ${facemoji.sad}`, thumb);
          logs.commandError(import.meta.url, m, e);
        });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}];