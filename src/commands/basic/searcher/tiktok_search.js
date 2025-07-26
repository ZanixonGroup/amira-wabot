export default [{
  tag: "search",
  name: "tiktok search",
  command: ["tiktoksearch", "ttsearch", "ttcari", "tts"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Tiktok Search | Amira Chatbot")
        .build()
      
      if(!text) return m.reply(`Tolong berikan query nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .ttcari blue yung kai`
      , thumb);
      
      // API request
      const tiktok = await plugins.tiktokSearch(text);
      if(!tiktok.status) return m.reply(`Maaf kak, amira gagal saat mencoba mendapatkan data nya ${facemoji.sad}`, thumb);
      if(!tiktok.result) return m.reply(`Maaf kak, amira tidak dapat menemukan video yang kakak cari ${facemoji.sad}`, thumb);
      const video = tiktok.result[0];
      
      const content = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Tiktok Search | Amira Chatbot")
        .setThumbnailBody(`https://www.tiktok.com/@${video.author.unique_id}/video/${video.video_id}`)
        .build()
      
      await client.sendMedia(remote, video.play, m, {
        caption: `${video.title || `Ini video tiktoknya kak ${facemoji.joy}`}\n` +
          `\n` +
          `*Details:*\n` +
          `> *Author:* ${video.author.unique_id}\n` +
          `> *Views:* ${client.db.abbreviate(video.play_count || 0)}\n` +
          `> *Source:* https://www.tiktok.com/@${video.author.unique_id}/video/${video.video_id}`,
        mimetype: "video/mp4",
        ...content
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      logs.commandError(import.meta.url, m, e);
    }
  }
}]