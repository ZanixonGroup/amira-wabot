export default [{
  tag: "downloader",
  name: "igdl",
  command: ["instagram", "instagramdl", "igdl", "ig"],
  code: async ({ client, m, remote, text, plugins, MessageBuilder, MessageCollector, facemoji, alertMessage, Func }) => {
    try {
      const message = new MessageBuilder().setStyle(2).build();
      
      if (!text) {
        return m.reply(`Berikan link video nya kak ${facemoji.joy}\n\n*Contoh:*\n> .igdl https://www.instagram.com/p/CxkCaUeL-0C`, message);
      }

      const igdl = await plugins.igdl(text);
      if (!igdl.status) {
        return m.reply(`Maaf kak, Link video instagram nya tidak valid atau ada kendala lain ${facemoji.sad}`, message);
      }

      const medias = igdl.media;
      const thumbnail = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Instagram Downloader | Amira Assistant")
        .build();
      const mediaUrls = medias.map(d => d.url);

      if (mediaUrls.length === 1) {
        const mediaBuffer = await Func.fetchBuffer(mediaUrls[0]);
        return await client.sendMedia(remote, mediaBuffer.data, m, {
          mimetype: mediaBuffer.mime.replace(/webp|jpg/, "png")
        });
      }

      const menu = new MessageBuilder()
        .setStyle(2)
        .setText(`Silahkan pilih kak, ingin mendownload media pada urutan berapa ${facemoji.joy}\n\nPilih media antara *1* sampai *${mediaUrls.length}* atau kirim *all* untuk mendownload semua media nya kak.`)
        .setThumbnailTitle("Instagram Downloader | Amira Assistant")
        .build();
      await client.sendMessage(remote, menu);

      const col = new MessageCollector(m, { timeout: 60 * 1000 });

      col.on("collect", async (msg) => {
        const selected = msg.body;
        await m.reply(`${alertMessage["wait"]}`, message);

        if (selected === "all") {
          let currentMedia = 0;

          async function sendMedia() {
            if (currentMedia >= mediaUrls.length) {
              await m.reply(`Media sudah berhasil amira kirim semua kak ${facemoji.joy}`, thumbnail);
              return col.collected();
            }
            
            const mediaUrl = mediaUrls[currentMedia];
            const mediaBuffer = await Func.fetchBuffer(mediaUrl);
            await client.sendMedia(remote, mediaBuffer.data, m).catch(async (err) => {
              await m.reply(`Maaf kak, media urutan ke *${currentMedia + 1}* nya gagal dikirim ${facemoji.sad}`, thumbnail);
            });

            currentMedia++;
            setTimeout(sendMedia, 5000);
          }
          
          sendMedia();
        } else {
          const selectedIndex = parseInt(selected);
          if (isNaN(selectedIndex) || selectedIndex < 1 || selectedIndex > mediaUrls.length) {
            return m.reply(`Maaf kak, pilihan kakak tidak valid atau media pada urutan tersebut tidak ada ${facemoji.sad}`, thumbnail);
          }

          const url = mediaUrls[selectedIndex - 1];
          await client.sendMedia(remote, url, m, {
            ...thumbnail
          });
          col.collected();
        }
      });

      col.on("end", (msg) => {
        if (msg.status !== "collected") {
          m.reply(`Maaf kak, sesi download amira akhiri karna batas waktu sesi sudah terlewat ${facemoji.sad}`, message);
        }
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}];