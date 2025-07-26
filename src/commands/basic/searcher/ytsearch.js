export default [{
  tag: "search",
  name: "ytsearch",
  command: ["ytsearch", "yts"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, facemoji, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan judul video nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .yts lagu reckless",
      message);
      const yts = await plugins.ytsearch(text);
      if(!yts.status) return m.reply(`Maaf kak, amira tidak menemukan data dari apa yang kakak cari ${facemoji.sad}`, message);
      const resultData = yts.data;
      const searchCount = resultData.length;
      let currentCount = 0;
      let list = "";
      resultData.map(d => {
        currentCount++
        list += `*${currentCount} ▹ ${d.title}*\n` +
        `> Views: *${client.db.abbreviate(d.views || 0)}*\n` +
        `> Durasi: *${d.duration}*\n` +
        `> Upload: *${d.uploadDate}*\n` +
        `> Video: *${d.url}*\n\n`
      })
      
      let textToSend = `Amira menemukan sekitar *${searchCount}* hasil kak ${facemoji.joy}\n\n` +
      list;
      
      const result = new MessageBuilder()
        .setStyle(2)
        .setText(textToSend)
        .setThumbnailTitle("YouTube Search | Amira Assistant")
        .build()
        
      await client.sendMessage(remote, result)
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]