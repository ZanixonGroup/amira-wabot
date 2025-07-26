export default [{
  tag: "AI Chatbot",
  name: "reset sesi",
  command: ["resetsesi", "resetchatbot"],
  code: async({ client, db = client.db, m, sender, facemoji, MessageBuilder, logs }) => {
    try {
      const userId = sender.split("@")[0]
      let session = await db.get(userId + ".session", "chats");
      if(!session) return m.reply(`Maaf kak, sesi chat masih kosong ${facemoji.joy}`);
      await db.set(userId + ".session", [], "chats");
      m.reply(`Berhasil membersihkan sesi chatbot amira ${facemoji.joy}`);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]