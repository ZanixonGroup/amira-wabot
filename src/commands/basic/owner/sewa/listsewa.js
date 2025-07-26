export default [{
  tag: "owner",
  name: "list sewa",
  command: ["listsewa", "sewalist"],
  options: { isOwner: true },
  code: async ({ client, m, knex = client.knex, facemoji, MessageBuilder, Func, logs, alertMessage }) => {
    const thumb = new MessageBuilder()
      .setStyle(2)
      .setThumbnailTitle("List Sewa | Amira Assistant")
      .build();

    try {
      const sewaList = await knex("sewa");

      if (sewaList.length === 0) {
        return m.reply(`Tidak ada data sewa yang tersimpan saat ini ${facemoji.sad}`, thumb);
      }
      
      let count = 1
      let list = await Promise.all(sewaList.map(async d => `${count++}. ID: ${d.sewa_id}\n` +
        `         - *Status:* ${d.status ? "Aktif" : "Tidak aktif"}\n` +
        `         - *Expired:* ${(d.duration <= Date.now()) ? 0 : await Func.parseUnix(d.duration)}\n` +
        `         - *Billing:* Rp ${d.price}\n` +
        `         - *Paid by:* ${d.paid_by}`
      ));
      m.reply(`*List penyewa Terdaftar:*\n\n${(list).join("\n\n")}`, thumb);
    } catch (e) {
      logs.commandError(import.meta.url, m, e);
      return m.reply(alertMessage["error"])
    }
  }
}];