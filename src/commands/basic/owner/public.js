export default [{
  tag: "owner",
  name: "public",
  command: ["public", "self"],
  options: {
    isOwner: true
  },
  code: async({ client, m, remote, MessageBuilder, text, logs, alertMessage, Func, isPublic }) => {
    const thumb = new MessageBuilder()
      .setStyle(2)
      .build()
      
    try {
      if (!text) {
       return m.reply(`Tolong berikan argumen nya kak ${facemoji.joy}\n` +
         `\n` +
         `*Argumen:*\n` +
         `> --on (enable)\n` +
         `> --off (disable)\n`  +
         `\n` +
         `*Contoh:*\n` +
         `> .public --on` 
       , thumb);
     }
     const result = (/--on/.test(text) ? true : (/--off/.test(text) ? false : isPublic))
     await client.knex("config").first().update({
      public: result
     })
     .then(async () => {
      await m.reply(`Berhasil ${result ? "mengaktifkan" : "menon-aktifkan"} mode publik ${facemoji.joy}\n` +
       `\n` +
       `*Detail:*\n` +
       `> Status: *${result ? "Aktif" : "Non-Aktif"}*`
     , thumb);
     })
     .catch(e => {
      m.reply(alertMessage["error"]);
     return logs.commandError(import.meta.url, m, e);
     })
    } catch (e) {
      m.reply(alertMessage["error"]);
     return logs.commandError(import.meta.url, m, e);
    }
  }
}]