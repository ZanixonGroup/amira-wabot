import util from "util";

export default [{
  tag: "owner",
  name: "banned user",
  command: ["banned"],
  options: {
    isModerator: true
  },
  code: async({ client, m, sender, quoted, isQuoted, knex = client.knex, text, Func, parseTime = Func.parseTime, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle(`Banned User | Amira Assistant`)
        .build();
      
      if(!text) return m.reply(`Masukan format nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .banned +62 8XX-XXXX-XXXX|30d`
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
      time = Date.now() + parseTime((duration || text || "30d").trim());
      knex("users").where({ user_id: user }).update({
        banned: true,
        banned_duration: time
      }).then(res => {
        m.reply(`Berhasil mem-banned pengguna @${user.split("@")[0]} selama ${duration || text || "30d"} ${facemoji.joy}`, {
          mentions: client.parseMention(user),
          ...thumb
        })
      }).catch(e => {
        m.reply(`Maaf kak, prosedur banned gagal.. silahkan cek logs di private chat ${facemoji.sad}`, thumb)
        client.sendMessage(sender, { text: `*Banned procedure Error Logs:*\n` +
          util.format(e),
        ...thumb })
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]