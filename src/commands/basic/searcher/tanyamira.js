export default [{
  tag: "search",
  name: "tanya mira",
  command: ["tanyamira", "tanyaamira"],
  cooldown: {
    status: true,
    duration: 10_000
  },
  code: async({ client, m, text, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build();
      
      if(!text) return m.reply(`Berikan query pencarian nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .tanyamira judul lagu dari lirik i meet you in the dark`
      , thumb);
      const search = await plugins.amira_search(text);
      if(!search.status) return m.reply(`Maaf kak, amira tidak dapat menemukan informasi tersebut atau ada kendala lain ${facemoji.sad}`, thumb);
      m.reply(search.answer + "\n\n*# Referensi:*\n" + (search.referensi.filter(d => d).map(d => `- ${d}`).join("\n") || "- referensi tidak ditemukan"), thumb)
    } catch (e) {
      m.reply(alertMessage["error"]);
      logs.commandError(import.meta.url, m, e);
    }
  }
}]