export default [{
  tag: "group",
  name: "antimedia",
  command: ["antimedia"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async ({
    m,
    metadata,
    remote,
    text,
    sender,
    facemoji,
    MessageBuilder,
    logs,
    alertMessage
  }) => {
    try {
      let thumb = new MessageBuilder()
        .setStyle(2)
        .build()

      const args = text.match(/--(on|off|action|addfilter|delfilter)/) || [];
      if (!args[1] || !["on", "off", "action", "addfilter", "delfilter"].includes(args[1])) {
        return m.reply(`Tolong berikan argumen nya kak ${facemoji.joy}\n` +
          `\n` +
          `*Argumen:*\n` +
          `> --on (enable)\n` +
          `> --off (disable)\n` +
          `> --action (opsi: delete, kick)\n` +
          `> --addfilter (opsi: image, video, audio, document)\n` +
          `> --delfilter (opsi: image, video, audio, document)\n` +
          `\n` +
          `*Contoh:*\n` +
          `> .antimedia --on\n` +
          `> .antimedia --on --action delete`, thumb);
      }
      const actions = ["DELETE", "KICK"];
      const action = text.match(/--action (\w+)/) || [];
      if (action[1] && !actions.includes(action[1].toUpperCase())) {
        return m.reply(`Maaf kak, tipe aksi *${action[1]}* tidak ada ${facemoji.sad}`, thumb);
      }
      const modes = ["image", "video", "audio", "document"];
      const addFilters = text.match(/--addfilter ([\w,]+)/) || [];
      const delFilters = text.match(/--delfilter ([\w,]+)/) || [];

      const antimedia = await client.db.get(metadata.id.split("@")[0] + ".moderation.antimedia", "grup");

      if (addFilters[1]) {
        const filtersToAdd = addFilters[1].split(',').map(word => word.trim()).filter(f => modes.includes(f));
        antimedia.blacklist = [...new Set([...antimedia.blacklist, ...filtersToAdd])];
      }

      if (delFilters[1]) {
        const filtersToDel = delFilters[1].split(',').map(word => word.trim()).filter(f => modes.includes(f));
        antimedia.blacklist = antimedia.blacklist.filter(v => !filtersToDel.includes(v));
      }

      const result = await client.db.set(metadata.id.split("@")[0] + ".moderation.antimedia", {
        status: (/--on/.test(text) ? true : (/--off/.test(text) ? false : antimedia.status)),
        blacklist: antimedia.blacklist,
        action: (action[1] || antimedia.action).toUpperCase()
      }, "grup");

      await m.reply(`Berhasil mengatur moderasi anti media! ${facemoji.joy}\n` +
        `\n` +
        `*Detail:*\n` +
        `> Status: *${result.status ? "Aktif" : "Non-Aktif"}*\n` +
        `> Aksi: *${result.action}*\n` +
        `> Filter: *${result.blacklist.join(", ")}*`, thumb);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]