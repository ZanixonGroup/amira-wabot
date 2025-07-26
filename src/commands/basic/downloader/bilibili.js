import { exec } from 'child_process';
import path from "path";
import fs from "fs";
import { dirname } from "desm";
const __dirname = dirname(import.meta.url);

export default [{
  tag: "downloader",
  name: "bili",
  disable: {
    status: false,
    message: "fitur ini sedang error, segera akan kami perbaiki"
  },
  command: ["bilidl", "bilibilidl", "bili", "bilibili"],
  code: async({ client, m, remote, text, plugins, Func, MessageBuilder, MessageCollector, facemoji, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan link video nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .bilidl https://www.bilibili.tv/id/video/2043554141",
      message);
      
      const thumbnail = new MessageBuilder()
        .setStyle(1)
        .setThumbnailTitle("Bilibili Downloader | Amira Assistant")
        .build()
      await m.reply(`Silahkan kakak pilih kualitas video nya ${facemoji.joy}\n` +
        `\n` +
        `*Kualitas tersedia:*\n` +
        `1. 1080p\n` +
        `2. 720p\n` +
        `3. 480p\n` +
        `4. 360p\n` +
        `5. 240p\n` +
        `6. 144p\n` +
        `\n` +
        `*Note:*\n` +
        `> Setelah memilih kualitas video, silahkan tunggu sebentar sampai video terkirim.`
      , thumbnail);
      
      const col = new MessageCollector(m, {
        timeout: 60 * 1000
      })
      
      col.on("collect", async(ctx) => {
        const selected = parseInt(ctx.body);
        if(!Number.isInteger(selected)) return m.reply(`Maaf kak, input yang kakak masukan bukan angka ${facemoji.sigh}`, message);
        const quality = [1080,720,480,360,240,144];
        if(selected > 6) return m.reply(`Maaf kak, kualitas yang kakak pilih tidak tersedia ${facemoji.sad}`, message);
        await m.reply(`Tunggu sebentar, amira sedang mengirim videonya...\n` +
          `\n` +
          `> Kualitas dipilih: *${quality[selected - 1]}p*\n`
        , thumbnail);
        const bilidl = await plugins.bilidl(text, quality[selected - 1]);
        if(!bilidl.media) {
          m.reply(`Maaf kak, amira gagal mendapatkan media nya ${facemoji.sad}`, message);
          return col.collected();
        }
        let tempFilePath = path.join(__dirname, "./../../../../tmp", "bilidl-sve-" + Date.now() + ".mp4");
        let outputFilePath = path.join(__dirname, "./../../../../tmp", "bilidl-out-" + Date.now() + ".mp4");
        await fs.writeFileSync(tempFilePath, (await Func.fetchBuffer(bilidl.media)).data)
        await new Promise((resolve, reject) => {
          exec(`ffmpeg -i ${tempFilePath} -c copy ${outputFilePath}`, (error) => {
              if (error) reject(error);
              else resolve();
          });
        });
        bilidl.media = await fs.readFileSync(outputFilePath);
        await client.sendMedia(remote, bilidl.media, m, {
          fileName: bilidl.filename + ".mp4",
          mimetype: "video/mp4",
          ...thumbnail
        });
        await fs.unlinkSync(tempFilePath)
        await fs.unlinkSync(outputFilePath)
      });
      
      col.on("exit", (ctx) => {
        if(ctx.status == "collected") return;
        m.reply(`Maaf kak, sesi download nya amira akhiri karna waktu sesi sudah habis ${facemoji.sad}`, thumb);
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]