export default [{
  tag: "group",
  name: "command disable",
  command: ["cmd", "command"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ client, m, metadata, remote, MessageBuilder, text, logs, alertMessage }) => {
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
         `> .cmd --on` 
       , thumb);
     }
     
     const chat = await client.db.get(metadata.id.split("@")[0], "grup");
     const result = await client.db.set(metadata.id.split("@")[0] + ".chat", (/--on/.test(text) ? true : (/--off/.test(text) ? false : chat.chat)), "grup");
     
     await m.reply(`Berhasil ${result ? "mengaktifkan" : "menon-aktifkan"} respon command amira pada grup ini ${facemoji.joy}\n` +
       `\n` +
       `*Detail:*\n` +
       `> Status: *${result ? "Aktif" : "Non-Aktif"}*\n` +
       `\n` +
       `*Note:*\n` +
       `> Saat ini amira ${(result ? "bisa" : "hanya akan") + " merespon command yang di perintah " + (result ? "semua orang" : "admin grup saja")}`
     , thumb);
    } catch (e) {
      m.reply(alertMessage["error"]);
     return logs.commandError(import.meta.url, m, e);
    }
  }
}]