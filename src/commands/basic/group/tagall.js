export default [{
  tag: "group",
  name: "tag all",
  command: ["tagall"],
  options: {
    isGroup: true,
    isAdmin: true,
    isBotAdmin: true
  },
  code: async({ client, remote, m, text, participants, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setThumbnailTitle("Tag All Member | Amira Chatbot")
        .setThumbnailBody("Mohon maaf bila mengganggu...")
        .build()
      
      const mentions = participants.map(d => d.id);
      const body = (text ? text + "\n\n" : "") +
        `*Total tag ${mentions.length} member:*\n` +
        mentions.map(d => "@" + d.split("@")[0]).join("\n");
      
      await client.sendMessage(remote, {
        text: body, 
        mentions
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]