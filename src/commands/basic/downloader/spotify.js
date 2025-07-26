export default [{
  tag: "downloader",
  name: "spotidl",
  command: ["spotify", "spotifydl", "spotidl"],
  disable: {
    status: true,
    message: "maaf ya kak, spotiy downloader kami matikan dulu krn perbaikan nya cukup rumit. terimakasih\n\n_~ Regards ZTRdiamond_"
  },
  code: async({
    client,
    m,
    remote,
    plugins,
    spotidl = plugins.spotiMeta,
    spotiDown = plugins.spotiDown,
    spotifySearch = plugins.spotiSearch,
    text,
    isPremium,
    MessageBuilder,
    MessageCollector,
    facemoji, 
    logs, 
    alertMessage
  }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Spotify Downloader | Amira Assistant")
        .setThumbnailBody("Chatbot terbaik dengan berbagai tools di dalamnya!")
        .build();
      
      if(!text) return m.reply(`Tolong berikan nama lagu, link lagu atau playlist spotify nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .spotify here with me\n` +
        `> .spotify https://open.spotify.com/track/1zKGm1uMH5qKgpM7T2U3RY\n` +
        `> .spotify https://open.spotify.com/playlist/3SSxGGDJHFW606dWX8yokX\n` +
        `> .spotify https://open.spotify.com/album/7aJuG4TFXa2hmE4z1yxc3n`
      ,thumb);
      
      const isUrl = /(http:\/\/|https:\/\/)/.test(text);
      if(isUrl) {
        const spoti = await spotidl(text);
        if(!spoti.status) return m.reply(`Maaf kak, amira gagal mendapatkan konten media nya ${facemoji.sad}`, thumb);
        const track = spoti.result;
        if(track.type == "track") {
          let song = track.tracks[0]
          song = (await spotiDown(song.id)).result;
          const thumbnail = new MessageBuilder()
            .setStyle(1)
            .setThumbnailTitle(`Track | ${song.title} - ${song.artists}`)
            .setThumbnailBody(`Sedang mendownload lagu dari spotify...`)
            .setThumbnailImage(song.cover)
            .build()
          console.log(song)
          await m.reply(`Tunggu sebentar ya kak, lagu nya lagi di kirim nih ${facemoji.joy}\n` +
            `\n` +
            `*Details:*\n` +
            `> Nama: *${song.title}*\n` +
            `> Artist: *${song.artists}*\n` +
            `> Release: *${song.releaseDate}*`
          , thumbnail);
          if(!song.download) return m.reply(`Maaf kak, amira gagal saat mendownload lagu nya ${facemoji.sad}`, thumb)
          await client.sendMedia(remote, song.download, m);
        } else if(track.type === "playlist" || track.type === "album") {
          const songs = (track.tracks.length > 130) ? track.tracks.slice(0, 130) : track.tracks;
          const songsCount = songs.length;
          let sCount = 0;
          let songsList = "";
          songs.map(d => {
            sCount++
            songsList += `${sCount}. *${d.title}* - ${d.artists}\n`
          });
            
          const thumbList = new MessageBuilder()
            .setStyle(1)
            .setThumbnailTitle(`Playlist | ${track.title} - ${track.artist}`)
            .setThumbnailBody("Spotify playlist downloader")
            .setThumbnailImage(track.cover)
            .build()
          await m.reply(`Berikut list lagu dari playlist *${track.title}* nya kak ${facemoji.joy}\n` +
            `\n` +
            `Silahkan pilih lagu dengan ketik angka antara *1* sampai *${songsCount}* atau ketik *all* untuk mendownload semua lagu dan ketik *end* untuk mengakhiri sesi download!\n` +
            `\n` +
            `*Playlist:*\n` +
            songsList
          , thumbList)
            
          const col = new MessageCollector(m, {
            timeout: 120 * 1000
          });
          
          col.on("collect", async(ctx) => {
            let selected = ctx.body;
            if(selected == "end") {
              await m.reply(`Sesi download spotify berhasil diakhiri ${facemoji.joy}`, thumb);
              return col.collected()
            }
            if(selected == "all") {
              let currentTrack = 0;
              let downloadLimit = isPremium ? songsCount : 20;
              async function download() {
                if(currentTrack >= downloadLimit) {
                  await m.reply(`Media nya berhasil amira kirim kak, sesuai limit yaitu *${downloadLimit}* lagu ${facemoji.joy}` +
                   (isPremium ? "" : `\n\n` +
                   `*Note:*\n` +
                   `> Ingin download lagu dari playlist dengan limit lebih dari *20*? coba premium sekarang juga!`)
                  , thumb)
                  return col.collected()
                }
                let song = songs[currentTrack];
                const songMedia = await spotiDown(song.id);
                if(!songMedia) {
                  await m.reply(`Maaf kak, amira gagal saat mengambil media pada lagu di urutan *${currentTrack}* ${facemoji.sad}`, thumb);
                  currentTrack++;
                  return download();
                }
                const thumbnail = new MessageBuilder()
                  .setStyle(1)
                  .setThumbnailTitle(`${song?.title} - ${song?.artists}`)
                  .setThumbnailBody(`Sedang mendownload lagu dari spotify...`)
                  .setThumbnailImage(song.cover)
                  .build()
                m.reply(`Mulai mendownload lagu pada urutan *${currentTrack + 1}* ${facemoji.joy}\n` +
                  `\n` +
                  `*Details:*\n` +
                  `> Nama: *${song.title}*\n` +
                  `> Artist: *${song.artists}*\n` +
                  `> Release: *${song.releaseDate}*`
                , thumbnail).then(res => {
                  if(!song.download) {
                    m.reply(`Maaf kak, amira gagal saat mendownload lagu *${song.title}* - *${song.artists}* pada urutan *${currentTrack}* dari playlist ${facemoji.sad}`, thumb)
                    return download();
                  }
                  client.sendMedia(remote, song.download, m).then(res => {
                    download()
                  }).catch(new Error);
                })
                currentTrack++
              }
              download()
            } else if(Number.isInteger(parseInt(selected))) {
              selected = parseInt(selected);
              if(selected > songsCount) return m.reply(`Maaf kak, pilihan tidak boleh lebih dari *${songsCount}* kak ${facemoji.sigh}`, thumb);
              let song = songs[selected - 1];
              song = (await spotiDown(song.id)).result;
              const thumbnail = new MessageBuilder()
                .setStyle(1)
                .setThumbnailTitle(`${song.title} - ${song.artists}`)
                .setThumbnailBody(`Sedang mendownload lagu dari spotify...`)
                .setThumbnailImage(track.cover)
                .build()
              await m.reply(`Tunggu sebentar ya kak, lagu nya lagi di kirim nih ${facemoji.joy}\n` +
                `\n` +
                `*Details:*\n` +
                `> Nama: *${song.title}*\n` +
                `> Artist: *${song.artists}*\n` +
                `> Release: *${song.releaseDate}*`
              , thumbnail);
              if(!song.download) {
                await m.reply(`Maaf kak, amira gagal saat mendownload lagu nya ${facemoji.sad}`, thumb)
                return col.collected()
              }
              await client.sendMedia(remote, song.download, m);
              return col.collected()
            }
          })
          
          col.on("exit", (ctx) => {
            if(ctx.status == "collected") return;
            m.reply(`Maaf kak, sesi download nya amira akhiri karna waktu sesi sudah habis ${facemoji.sad}`, thumb);
          });
        } else {
          m.reply(`Maaf kak, amira gagal mendapatkan konten media nya ${facemoji.sad}`, thumb);
        }
      } else {
        const data = await spotifySearch(text);
        let list = "";
        let currentCount = 1;
        data.tracks.map(d => {
          list +=`*${currentCount} ▹ ${d.details.name}*\n` +
            `> Artis: *${d.details.artists.map(d => d.name)}*\n` +
            `> Track: *${d.url}*\n\n`
          currentCount++
        })
        await m.reply(`Amira menemukan *${data.tracks.length}* hasil kak ${facemoji.joy}\n` +
          `\n` +
          list
        , thumb);
      }
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]