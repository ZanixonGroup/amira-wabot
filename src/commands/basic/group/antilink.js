export default [{
 tag: "group",
 name: "antilink",
 command: ["antilink"],
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
     
     const args = text.match(/--(on|off|action|filter)/) || [];
     if (!args[1] || !["on", "off", "action", "mode"].includes(args[1])) {
       return m.reply(`Tolong berikan argumen nya kak ${facemoji.joy}\n` +
         `\n` +
         `*Argumen:*\n` +
         `> --on (enable)\n` +
         `> --off (disable)\n` +
         `> --action (opsi: delete, kick)\n` +
         `> --filter (opsi: all, grup)\n` +
         `\n` +
         `*Contoh:*\n` +
         `> .antilink --on\n` +
         `> .antilink --on --action delete`
       , thumb);
     }
     const actions = ["DELETE", "KICK"];
     const action = text.match(/--action (\w+)/) || [];
     if (action[1] && !actions.includes(action[1].toUpperCase())) {
       return m.reply(`Maaf kak, tipe aksi *${action[1]}* tidak ada ${facemoji.sad}`, thumb);
     }
     const modes = ["ALL", "GRUP"];
     const mode = text.match(/-filter (\w+)/) || [];
     if (mode[1] && !modes.includes(mode[1].toUpperCase())) {
       return m.reply(`Maaf kak, mode *${mode[1]}* tidak ada ${facemoji.sad}`, thumb);
     }
     
     const antilink = await client.db.get(metadata.id.split("@")[0] + ".moderation.antilink", "grup");
     const result = await client.db.set(metadata.id.split("@")[0] + ".moderation.antilink", {
       status: (/--on/.test(text) ? true : (/--off/.test(text) ? false : antilink.status)),
       action: (action[1] || antilink.action).toUpperCase(),
       mode: (mode[1] || antilink.mode).toUpperCase()
     }, "grup");
     
     await m.reply(`Berhasil mengatur moderasi anti link! ${facemoji.joy}\n` +
       `\n` +
       `*Detail:*\n` +
       `> Status: *${result.status ? "Aktif" : "Non-Aktif"}*\n` +
       `> Aksi: *${result.action}*\n` +
       `> Filter: *${result.filter}*`
     , thumb);
   } catch (e) {
     m.reply(alertMessage["error"]);
     return logs.commandError(import.meta.url, m, e);
   }
 }
}]