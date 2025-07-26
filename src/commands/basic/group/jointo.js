let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i

export default [{
  tag: "group",
  name: "jointo",
  command: ["jointo"],
  options: {
    isOwner: true
  },
  code: async({ client, m, text, MessageBuilder, alertMessage, logs }) => {
    try {
      let message = new MessageBuilder()
      .setStyle(2)
      .build()
      
      if(!text) return m.reply("Mana link grup nya?", message)
      let [_, code] = text.match(linkRegex) || []
      let id = await client.groupAcceptInvite(code)
      let metadata = await client.groupMetadata(id)
      
      await m.reply(`Sukses bergabung ke group ${metadata.subject}`, message)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]
