export default [{
  tag: "owner",
  name: "delete sewa",
  command: ["delsewa", "remsewa"],
  options: { isOwner: true },
  code: async ({ client, m, text, knex = client.knex, facemoji, logs, alertMessage, Func, MessageBuilder }) => {
    
    const thumb = new MessageBuilder().setStyle(2).setThumbnailTitle("Delete Sewa | Amira Assistant").build();
    try {
      if (!text) return m.reply(`Masukan argumen!\n` + 
        `\n` +
        `*Arguments:*\n` +
        `> --link (opt: group invite link)`
      , thumb);
      
      let { link } = await Func.parseArgs(text)
      
      const match = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
      const code = match[1];
      if (!code) return m.reply(`Tautan grup tidak valid!`, thumb);
      
      let id = await client.groupAcceptInvite(code).catch(() => null)
      if (!id) return m.reply(`Harap masukkan Link grup yang valid!`, thumb);

      const isRegistered = await knex.isAvailable({ sewa_id: id },"sewa")
      if (!isRegistered) return m.reply(`Data sewa dengan ID *${id}* tidak ditemukan!`, thumb);
      await knex("sewa").where({ sewa_id: id }).del();

      await m.reply(`Berhasil menghapus data sewa dengan ID *${id}* dari database!`, thumb);
    } catch (error) {
      logs.commandError(import.meta.url, m, error);
      return m.reply(alertMessage["error"])
    }
  }
}];