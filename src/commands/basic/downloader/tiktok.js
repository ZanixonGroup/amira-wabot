export default [{
  tag: "downloader",
  name: "ttdl",
  command: ["tiktok", "tiktokdl", "tikdl", "ttdl", "tt"],
  code: async({ client, m, remote, text, isPremium, plugins, Func, MessageBuilder, MessageCollector, facemoji, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan link video nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .tt https://www.tiktok.com/@gawrgura/video/7213728634132073734",
      message);
      
      
      const tiktok = await plugins.tiktokdl(text);
      if(!tiktok.status) return m.reply(`Maaf kak, amira gagal saat mendapatkan informasi post tiktok tersebut ${facemoji.sad}`, message);
      let result = tiktok.result;
      let metadata = result.metadata;
      let post_type = result.type;
      let media = result.media;
      
      const thumbnail = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Tiktok Downloader | Amira Chatbot")
        .setThumbnailBody(metadata.title)
        .build()
      await m.reply(`Silahkan kakak pilih tipe media yang ingin di download ${facemoji.joy}\n` +
        `\n` +
        `*Tipe tersedia:*\n` +
        `1. ${post_type}\n` +
        `2. audio\n` +
        `\n` +
        `> _Kirim balasan angka saja ya kak, nanti amira akan merespons_\n` +
        `\n` +
        `*Note:*\n` +
        `> setelah mengirim pilihan, silahkan kakak tunggu beberapa saat sampai media terkirim. apabila tidak terkirim juga silahkan ulangi perntah ${facemoji.joy}`
      , thumbnail)
      
      const col_one = new MessageCollector(m, {
        timeout: 60 * 1000
      });
      
      col_one.on("collect", async(ctx) => {
        const choice = parseInt(ctx.body);
        const choice_type = {
          1: post_type,
          2: "audio"
        }[choice];
        
        await ctx.react("⏱️", ctx);
        await client.readMessages([ctx.key]);
        if(choice_type === "video" || choice_type === "audio") {
          const content = (choice_type == "audio") ? media.audio : media.video;
          await m.reply(`Mohon tunggu sebentar kak, amira sedang mengirim ${choice_type} nya ${facemoji.joy}`, thumbnail);
          await client.sendMedia(remote, content, m, {
            mimetype: (choice_type == "audio") ? "audio/mpeg" : "video/mp4",
            fileName: metadata.title + (choice_type == "audio") ? ".mp3" : ".mp4",
            thumbnail
          })
          return col_one.collected()
        } else if(choice_type === "image") {
          const images = media.images;
          const images_count = images.length;
          
          if(images_count <= 1) {
            await client.sendMedia(remote, images[0], m, thumbnail)
            return col_one.collected()
          }
          
          await m.reply(`Silahkan pilih kak, ingin mendownload media pada urutan berapa ${facemoji.joy}\n` +
            `\n` +
            `Pilih media antara *1* sampai *${images_count}* atau ketik *all* untuk mendownload semua gambar nya kak.`
          , thumbnail)
          
          const col_img = new MessageCollector(m, {
            timeout: 60 * 1000
          });
          
          col_img.on("collect", async(ctx) => {
            const choice = ctx.body.toLowerCase();
            
            await ctx.react("⏱️", ctx);
            await client.readMessages([ctx.key]);
            if(choice === "all") {
              let current_image = 0;
              let treshold = (((isPremium ? 50 : 20) > images_count) ? images_count : 20)
              async function process() {
                if(current_image >= treshold) {
                  await m.reply(`Semua gambar sudah amira kirim semua kak ${facemoji.joy}`, thumbnail);
                  return col_img.collected();
                }
                let image = images[current_image];
                await client.sendMedia(remote, image, m, {
                  mimetype: "image/png",
                  fileName: "amira_tiktok_downloader.png"
                });
                current_image++;
                setTimeout(process, 3000);
              }
              await process();
            } else {
              if(!Number.isInteger(parseInt(choice))) return m.reply(`Maaf kak, pilihan kak tidak valid ${facemoji.sad}`, thumbnail);
              if(parseInt(choice) <= 0) return m.reply(`Maaf kak, media pada urutan tersebut tidak ada setelah amira cek ${facemoji.sad}`, thumbnail);
              if(parseInt(choice) > (images_count + 1)) return m.reply(`Maaf kak, media pada urutan tersebut tidak ada setelah amira cek ${facemoji.sad}`, thumbnail);
              const image = images[parseInt(choice) - 1];
              await client.sendMedia(remote, image, m, {
                mimetype: "image/png",
                fileName: "amira_tiktok_downloader.png"
              });
              return col_img.collected();
            }
          })
          
          col_img.on("exit", ctx => {
            if(ctx.status === "collected") return;
            m.reply(`Maaf kak, sesi download amira akhiri karna batas waktu sesi sudah terlewat ${facemoji.sad}`, thumbnail);
          })
          return col_one.collected()
        }
      });
      
      col_one.on("exit", ctx => {
        if(ctx.status === "collected") return;
        m.reply(`Maaf kak, sesi download amira akhiri karna batas waktu sesi sudah terlewat ${facemoji.sad}`, thumbnail);
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]