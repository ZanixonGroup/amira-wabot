export default [{
  tag: "downloader",
  name: "play",
  disable: {
    status: false,
    message: "fitur ini sedang error, segera akan kami perbaiki"
  },
  command: ["play"],
  code: async({ client, m, remote, text, MessageBuilder, plugins, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle(`YouTube Play | Amira Assistant`)
        .build();
      
      if(!text) return m.reply(`Berikan query nya kak ${facemoji.joy}\n` +
      `\n` +
      `*Contoh:*\n` +
      `> .play koiiro mosawo`, thumb);
      const yts = await plugins.ytsearch(text);
      if(!yts.status) return m.reply(`Maaf kak, amira gagal mendapatkan konten dari query tersebut ${facemoji.sad}`, thumb);
      if(!yts.data.length) return m.reply(`Maaf kak, query yang kakak cari tidak ada ${facemoji.sad}`, thumb);
      const meta = yts.data[0];
      const song = await plugins.ytmp3(meta.url)
      
      if(!song.success) return m.reply(`Maaf kak, amira gagal saat mendownload media nya ${facemoji.sad}`, thumb);
      
      const thumbnail = new MessageBuilder()
        .setStyle(1)
        .setThumbnailTitle(meta.title)
        .setThumbnailBody(meta.description)
        .setThumbnailImage(meta.thumbnail)
        .build();
      
      await m.reply(`Tunggu sebentar ya kak, audio sedang dikirim  ${facemoji.joy}\n` +
      `\n` +
      `> *Judul:* ${meta.title}\n` +
      `> *Url:* ${meta.url}\n`, thumbnail);
      await client.sendMedia(remote, song.media, m, {
        mimetype: "audio/mp4",
        fileName: meta.title + ".mp3"
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]