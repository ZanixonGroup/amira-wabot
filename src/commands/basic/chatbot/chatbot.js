export default [{
  tag: "AI Chatbot",
  name: "chatbot",
  command: ["chatbot"],
  code: async({ client, m, db = client.db, userId, text, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Tolong pilih opsi chatbot nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Opsi:*\n` +
        `- on\n` +
        `- off\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .chatbot off`, message);
      
      const status = await db.get(userId + ".settings.chatbot", "user");
      switch (text) {
        case 'on':
            if(status) return m.reply(`Mode chatbot sudah di aktifkan sebelumnya kak ${facemoji.joy}`, message);
            await db.set(userId + ".settings.chatbot", true, "user");
            await m.reply(`Mode chatbot berhasil di aktifkan kak ${facemoji.joy}`, message);
          break;
        
        case 'off':
            if(!status) return m.reply(`Mode chatbt sudah di non-aktifkan sebelumnya kak ${facemoji.joy}`, message);
            await db.set(userId + ".settings.chatbot", false, "user");
            await m.reply(`Mode chatbot berhasil di non-aktifkan kak ${facemoji.joy}`, message);
          break;
        default:
          m.reply(`Maaf kak, opsi tersebut tidak valid ${facemoji.sad}`, message);
      }
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]