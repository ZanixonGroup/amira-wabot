import util from "util";

export default [{
  tag: "user",
  name: "del premium",
  command: ["delpremium", "delprem"],
  options: {
    isOwner: true
  },
  code: async({ client, m, sender, remote, isQuoted, quoted, text, knex = client.knex, Func, parseTime = Func.parseTime, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle(`Delete Premium | Amira Assistant`)
        .build()
      
      if(!isQuoted && !text) return m.reply(`Masukan format nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .addprem +62 8XX-XXXX-XXXX`
      , thumb);
      let user;
      if(isQuoted) user = quoted?.sender;
      if(text) {
        if(text.startsWith("@62")) user = client.parseMention(text)[0];
        if(text.startsWith("+62")) user = text.replace(/^\+\s?|[\s-]/g, "") + "@s.whatsapp.net";
        if(text.startsWith("62")) user = text.replace(/^\+\s?|[\s-]/g, "") + "@s.whatsapp.net";
      }
      knex("users").where({ user_id: user }).select("subscription").update("subscription", {
        status: false,
        expired_date: 0
      }).then(res => {
        m.reply(`Berhasil menghapus premium user @${user.split("@")[0]} ${facemoji.joy}`, {
          mentions: client.parseMention(user),
          ...thumb
        })
      }).catch(e => {
        m.reply(`Maaf kak, penghapusan premium gagal.. silahkan cek logs di private chat ${facemoji.sad}`, thumb)
        client.sendMessage(sender, { text: `*Delete Premium Error Logs:*\n` +
          util.format(e),
        ...thumb })
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]