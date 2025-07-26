export default [{
  tag: "group",
  name: "antibadword",
  command: ["antibadword"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ m, metadata, remote, text, sender, facemoji, MessageBuilder, logs, alertMessage }) => {
    try {
      let thumb = new MessageBuilder()
        .setStyle(2)
        .build();

      const args = text.match(/--(on|off|action|add|del)/) || [];
      if (!args[1] || !["on", "off", "action", "add", "del"].includes(args[1])) {
        return m.reply(`Tolong berikan argumen nya kak ${facemoji.joy}\n` +
          `\n` +
          `*Argumen:*\n` +
          `> --on (enable)\n` +
          `> --off (disable)\n` +
          `> --action (opsi: delete, kick)\n` +
          `> --add (text)\n` +
          `> --del (text)\n` +
          `\n` +
          `*Contoh:*\n` +
          `> .antibadword --on\n` +
          `> .antibadword --on --action delete\n` +
          `> .antibadword --add ajg\n` +
          `> .antibadword --del ajg`
          , thumb);
      }

      const actions = ["DELETE", "KICK"];
      const action = text.match(/--action (\w+)/) || [];
      if (action[1] && !actions.includes(action[1].toUpperCase())) {
        return m.reply(`Maaf kak, tipe aksi *${action[1]}* tidak ada ${facemoji.sad}`, thumb);
      }

      const antibadword = await client.db.get(metadata.id.split("@")[0] + ".moderation.antibadword", "grup");

      if (/--add/.test(text)) {
        const wordsToAdd = text.match(/--add (.+)/);
        if (wordsToAdd && wordsToAdd[1]) {
          const newWords = wordsToAdd[1].split(',').map(word => word.trim());
          antibadword.badwords.push(...newWords);
        }
      }

      if (/--del/.test(text)) {
        const wordsToDel = text.match(/--del (.+)/);
        if (wordsToDel && wordsToDel[1]) {
          const wordsToRemove = wordsToDel[1].split(',').map(word => word.trim());
          antibadword.badwords = antibadword.badwords.filter(word => !wordsToRemove.includes(word));
        }
      }

      const result = await client.db.set(metadata.id.split("@")[0] + ".moderation.antibadword", {
        status: (/--on/.test(text) ? true : (/--off/.test(text) ? false : antibadword.status)),
        badwords: antibadword.badwords,
        action: (action[1] || antibadword.action).toUpperCase()
      }, "grup");

      await m.reply(`Berhasil mengatur moderasi anti media! ${facemoji.joy}\n` +
        `\n` +
        `*Detail:*\n` +
        `> Status: *${result.status ? "Aktif" : "Non-Aktif"}*\n` +
        `> Aksi: *${result.action}*\n` +
        `> Badwords: *${result.badwords.join(', ')}*`
        , thumb);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]