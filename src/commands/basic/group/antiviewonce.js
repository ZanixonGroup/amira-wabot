export default [{
 tag: "group",
 name: "antiviewonce",
 command: ["antiviewonce"],
 options: {
   isAdmin: true,
   isBotAdmin: true,
   isGroup: true
 },
 code: async({ m, metadata, remote, text, sender, facemoji, MessageBuilder, logs, alertMessage }) => {
   try {
     let thumb = new MessageBuilder()
       .setStyle(2)
       .build()
     
     const args = text.match(/--(on|off)/) || [];
     if (!args[1] || !["on", "off"].includes(args[1])) {
       return m.reply(`Tolong berikan argumen nya kak ${facemoji.joy}\n` +
         `\n` +
         `*Argumen:*\n` +
         `> --on (enable)\n` +
         `> --off (disable)\n`  +
         `\n` +
         `*Contoh:*\n` +
         `> .antiviewonce --on` 
       , thumb);
     }
     const antiviewonce = await client.db.get(metadata.id.split("@")[0] + ".moderation.antiviewonce", "grup");
     const result = await client.db.set(metadata.id.split("@")[0] + ".moderation.antiviewonce", {
       status: (/--on/.test(text) ? true : (/--off/.test(text) ? false : antiviewonce.status)),
       action: "RESEND"
     }, "grup");
     
     await m.reply(`Berhasil mengatur moderasi anti view once! ${facemoji.joy}\n` +
       `\n` +
       `*Detail:*\n` +
       `> Status: *${result.status ? "Aktif" : "Non-Aktif"}*\n` +
       `> Aksi: *${result.action}*`
     , thumb);
   } catch (e) {
     m.reply(alertMessage["error"]);
     return logs.commandError(import.meta.url, m, e);
   }
 }
}]