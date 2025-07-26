export default [{
  tag: "tools",
  name: "translate",
  command: ["translate", "tr"],
  code: async ({
    client, m, text, args = m.args, plugins, MessageBuilder, facemoji, logs, alertMessage 
  }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build();
      
      if (!args[0] && !m.quoted) return m.reply(`Berikan teks yang ingin di translate kak ${facemoji.joy}\n` +
      `\n` +
      `*Contoh:*\n` +
      `> .translate id hello there, i am amira. a smart chatbot by Zanixon Group!`,
      thumb)

      let lang = args[0];
      let translatedText = args.slice(1).join(' ');

      if ((args[0] || '').length !== 2) {
        lang = "id";
        translatedText = args.join(' ');
      }

      if (!translatedText && m.quoted && m.quoted.body) {
        translatedText = m.quoted.body;
      }

      let result = await plugins.translate(translatedText, lang).catch(_ => null);
      if (!result.status) return m.reply(`Maaf kak, amira gagal untuk menerjemahkan teks tersebut ${facemoji.sad}`, thumb)

      m.reply(`*[ ${result.raw.src.toUpperCase()} -> ${lang.toUpperCase()} ]*\n\n${result.text.toString()}`, thumb);
    } catch (e) {
      m.reply(alertMessage["error"])
      return logs.commandError(import.meta.url, m, e);
    }
  }
}];