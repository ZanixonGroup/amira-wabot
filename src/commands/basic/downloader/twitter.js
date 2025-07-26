export default [{
  name: "twitter",
  tag: "downloader",
  command: ["twitter", "twitterdl", "twdl", "tw"],
  code: async({ client, remote, m, plugins, text, MessageBuilder, MessageCollector, facemoji, logs, alertMessage}) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Twitter Downloader | Amira Assistant")
        .build()
      
      if(!text) return m.reply(`Tolong berikan url twitter nya kak ${facemoji.joy}\n` +
      `\n` +
      `*Contoh:*\n` +
      `> .tw https://twitter.com/ShouldHaveCat/status/1799286502003728783`);
      
      const tw = await plugins.twdl(text);
      if(!tw.status) return m.reply(`Maaf kak, amira gagal mengambil data nya atau url tidak valid ${facemoji.sad}`, message);
      const media = tw?.data?.media;
      let mediaCount = media.length;
      
      if(mediaCount === 1) {
        const url = async() => {
          const data = media[0];
          return /video/.test(data.content_type) ? data.url : data.image;
        };
        return await client.sendMedia(remote, await url(), m, {
          caption: `Ini media nya kak ${facemoji.joy}`,
          ...message
        })
      }
      
      let menu = `Silahkan pilih kak, ingin mendownload media pada urutan berapa ${facemoji.joy}\n` +
      `\n` +
      `Pilih media antara *1* sampai *${mediaCount}* atau kirim *all* untuk mendownload semua media nya kak.`;
      await client.sendMessage(remote, {
        text: menu,
        ...message
      });
      
      const col = new MessageCollector(m, {
        timeout: 60 * 1000
      });
      
      col.on("collect", async(ctx) => {
        let selected = ctx.body;
        await m.reply(`${alertMessage["wait"]}`, message);
        if(!selected) return m.reply(`Maaf kak, pilihan kakak tidak valid ${facemoji.sad}`, message);
        if(selected === "all") {
          let currentMedia = 0;
          async function send_media() {
            if(currentMedia >= mediaCount) {
              await m.reply(`Media sudah berhasil amira kirim semua kak ${facemoji.joy}`, message);
              return col.collected();
            }
            const content = media[currentMedia];
            const url = /video/.test(content.content_type) ? content.url : content.image;
            await client.sendMedia(remote, url, m);
            currentMedia++;
            setTimeout(send_media, 5000);
          }
          send_media()
        } else {
          selected = parseInt(selected);
          if(!Number.isInteger(selected)) return m.reply(`Maaf kak, pilihan kakak tidak valid ${facemoji.sad}`, message);
          if(parseInt(selected) > (mediaCount +1)) return m.reply(`Maaf kak, media pada urutan tersebut tidak ada setelah amira cek ${facemoji.sad}`, message);
          const content = media[parseInt(selected) - 1];
          const url = /video/.test(content.content_type) ? content.url : content.image;
          await client.sendMedia(remote, url, m);
          col.collected()
        }
      });
      col.on("end", (ctx) => {
        if(ctx.status === "collected") return;
        m.reply(`Maaf kak, sesi download amira akhiri karna batas waktu sesi sudah terlewat ${facemoji.sad}`, message);
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]