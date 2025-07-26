import util from "util";

export default [{
  tag: "user",
  name: "add premium",
  command: ["addpremium", "addprem", "setprem", "setpremium"],
  options: {
    isOwner: true
  },
  code: async({ client, m, sender, remote, isQuoted, quoted, text, knex = client.knex, Func, parseTime = Func.parseTime, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle(`Add Premium | Amira Assistant`)
        .build()
      
      if(!text) return m.reply(`Masukan format nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .addprem +62 8XX-XXXX-XXXX|30d`
      , thumb);
      let [number, duration] = text.split("|");
      let user;
      let time;
      if(isQuoted) user = quoted?.sender;
      if(number) {
        if(text.startsWith("@62")) user = client.parseMention(text)[0];
        if(text.startsWith("+62")) user = number.replace(/^\+\s?|[\s-]/g, "") + "@s.whatsapp.net";
        if(text.startsWith("62")) user = number.replace(/^\+\s?|[\s-]/g, "") + "@s.whatsapp.net";
      }
      time = Date.now() + parseTime(duration || text || "30d");
      knex("users").where({ user_id: user }).select("subscription").update("subscription", {
        status: true,
        expired_date: time
      }).then(res => {
        m.reply(`Berhasil menambahkan premium ke @${user.split("@")[0]} selama ${duration || text || "30d"} ${facemoji.joy}`, {
          mentions: client.parseMention(user),
          ...thumb
        })
      }).catch(e => {
        m.reply(`Maaf kak, penambahan premium gagal.. silahkan cek logs di private chat ${facemoji.sad}`, thumb)
        client.sendMessage(sender, { text: `*Add Premium Error Logs:*\n` +
          util.format(e),
        ...thumb })
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]