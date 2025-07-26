export default [{
  tag: "group",
  name: "groupchatbot",
  command: ["groupchatbot"],
  options: {
    isGroup: true
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
         `> .groupchatbot --on` 
       , thumb);
     }
     
     let validate = await client.db.has(remote.split("@")[0] + ".chatbot", "grup")
      if(!validate) await client.db.set(remote.split("@")[0] + ".chatbot", false, "grup")
      
     const result = (/--on/.test(text) ? true : (/--off/.test(text) ? false : await client.db.has(remote.split("@")[0] + ".chatbot", "grup")))
     await client.db.set(remote.split("@")[0] + ".chatbot", result, "grup")
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