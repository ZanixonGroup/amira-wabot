export default [{
  tag: "search",
  name: "pins",
  command: ["pinterest", "pins", "pin"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, facemoji, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan link video nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .pins anime wallpaper",
      message);
      const pinsearch = await plugins.pinsearch(text);
      if(!pinsearch.status) return m.reply(`Maaf kak, foto yang kakak cari gk bisa amira temukan ${facemoji.sad}`, message);
      const lengthData = pinsearch.data.length;
      const selectedData = Math.floor(Math.random() * lengthData)
      const data = pinsearch.data.map(d => d.directLink)[selectedData]
      
      const textToSend = `Ini dia kak data yang diminta\n` +
      "\n" +
      `\n> Url: ${data}`;
      
      const result = new MessageBuilder()
        .setStyle(2)
        .setCaption(textToSend)
        .setThumbnailTitle("Pinterest Search | Amira Chatbot")
        .setThumbnailImage(data)
        .build();
        
      await client.sendMedia(remote, data, m, { mimetype: "image/png", ...result })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]