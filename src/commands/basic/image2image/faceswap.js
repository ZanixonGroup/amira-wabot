export default [{
  tag: "AI Image2image",
  name: "faceswap",
  command: ["faceswap", "swap"],
  options: {
    isPremium: true
  },
  code: async({ client, remote, m, isMedia, mimetype, MessageBuilder, MessageCollector, plugins, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build()
      
      m.reply(`Halo kak, selamat datang di dashboard faceswap amira! ${facemoji.joy}\n` +
        `\n` +
        `*Instruksi:*\n` +
        `> Silahkan kakak kirim foto original yang akan diganti wajahnya, kakak bisa kirim via dokumen/galeri nanti amira akan proses gambarnya.\n` +
        `\n` +
        `*Note:*\n` +
        `> Untuk membatalkan sesi ini, kakak bisa mengirimkan *.batal* untuk menghentikan sesi ini atau kakak bisa biarkan saja sampai sesi keeluar dengan sendirinya.`
      , thumb);
      
      const collector = new MessageCollector(m, {
        timeout: 180 * 1000
      });
      
      let swap = {
        step: 1,
        original: null,
        face: null
      }
      collector.on("collect", async(ctx) => {
        console.log(swap)
        if(/batal/.test(ctx.body)) {
          m.reply(`Baik kak, sesi faceswap akan amira tutup sekarang, terima kasih sudah pakai fitur ini ${facemoji.joy}`, thumb);
          return ctx.collected();
        }
        if(!ctx.isMedia) return;
        if(swap.step === 1) {
          if(!/(jpeg|webp|png|jpg)/.test(ctx.mimetype)) return m.reply(`Maaf kak, media tersebut tidak valid ${facemoji.sad}`, thumb);
          swap.original = await ctx.download();
          swap.step = 2;
          m.reply(`Baik kak, foto nya sudah amira terima, silahkan ikuti instruksi selanjutnya sekaligus langkah terakhir ${facemoji.joy}\n` +
            `\n` +
            `*Instruksi:*\n` +
            `> Silahkan kakak kirim foto muka yang akan digunakan sebagai pengganti wajah pada gambar sebelumnya, kakak bisa kirim via dokumen/galeri nanti amira akan proses gambarnya.\n` +
            `\n` +
            `*Note:*\n` +
            `> Untuk membatalkan sesi ini, kakak bisa mengirimkan *.batal* untuk menghentikan sesi ini atau kakak bisa biarkan saja sampai sesi keeluar dengan sendirinya.`
          , thumb);
        } else if(swap.step === 2) {
          if(!/(jpeg|webp|png|jpg)/.test(ctx.mimetype)) return m.reply(`Maaf kak, media tersebut tidak valid ${facemoji.sad}`, thumb);
          swap.face = await ctx.download();
          swap.step = 3;
          m.reply(`Baik kak, semua media sudah komplit, silahkan tunggu sebentar karna amira sedang memproses gambar nya ${facemoji.joy}`, thumb);
          
          const data = await plugins.faceswap(swap.original, swap.face);
          console.log(data)
          if(!data.status) return m.reply(`Maaf kak, amira gagal melakukan penukaran wajahnya ${facemoji.sad}`, thumb);
          await client.sendMedia(remote, data.image, ctx, {
            caption: `Ini hasilnya kak ${facemoji.joy}`,
            mimetype: "image/png"
          });
          collector.collected();
        } else return;
      });
      
      collector.on("end", (ctx) => {
        if(ctx.status === "collected") return;
        m.reply(`Maaf kak, sesi faceswap akan amira tutup karna sudah melewati batas waktu ${facemoji.sad}`, thumb);
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]