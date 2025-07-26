export default [{
  tag: "search",
  name: "search lyrics",
  command: ["lirik", "lyrics"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, MessageCollector, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle(`Lyrics Search | Amira Chatbot`)
        .build();
        
      if(!text) return m.reply(`Tolong berikan judul lagu nya kak, lebih detail lebih baik ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .lirik blue yung kai`
      , thumb);
      
      const lyrics = await plugins.searchLyrics(text);
      if(!lyrics.status) return m.reply(`Maaf kak, amira tidak dapat menemukan lirik yang kakak cari ${facemoji.sad}`, thumb);
      let counter = 1;
      const lyricsList = lyrics.result.map(d => `${counter++}. ${d.title} - ${d.artist}`).join("\n");
      await m.reply(`Silahkan kakak pilih urutan lagu yang sesuai dengan yang kakak cari ${facemoji.joy}\n` +
        `\n` +
        `*Lirik lagu ditemukan:*\n` +
        lyricsList + `\n` +
        `\n` +
        `> ketik angka untuk memilih judul lagu, hanya angka ya kak ${facemoji.joy}`
      , thumb)
      
      const col = new MessageCollector(m, {
        timeout: 60 * 1000
      });
      
      col.on("collect", async(ctx) => {
        await ctx.react("⏱️", ctx);
        await client.readMessages([ctx.key]);
        const selected = parseInt(ctx.body);
        if(!Number.isInteger(selected)) return ctx.reply(`Maaf kak, input yang kakak masukan bukan angka ${facemoji.sigh}`, thumb);
        let lyricsCount = lyrics.result.length;
        if(selected > lyricsCount) return ctx.reply(`Maaf kak, urutan judul hanya sampai ${lyricsCount} saja kak ${facemoji.sigh}`, thumb);
        const selectedLyrics = lyrics.result[selected - 1];
        const lyric = await plugins.getLyrics(selectedLyrics.id);
        if(!lyric.status) {
          col.collected();
          return m.reply(`Maaf kak, amira gagal mendapatkan data liriknya ${facemoji.sad}`, thumb)
        }
        await ctx.reply(`Ini liriknya kak ${facemoji.joy}\n` +
          `\n` +
          `*Detail:*\n` +
          `> Judul: *${lyric.result.name}*\n` +
          `> Artist: *${lyric.result.artistName}*\n` +
          `> Album: *${lyric.result.albumName}*\n` +
          `\n` +
          lyric.result.plainLyrics
        , thumb)
        return col.collected()
      });
      
      col.on("exit", (ctx) => {
        if(ctx.status === "collected") return;
        m.reply(`Maaf kak, sesi pencarian lirik telah habis, amira akan menutup sesi ${facemoji.joy}`, thumb)
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]