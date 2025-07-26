import { exec } from 'child_process';
import path from "path";
import fs from "fs";
import { dirname } from "desm";
const __dirname = dirname(import.meta.url);

export default [{
  tag: "downloader",
  name: "ytvideo",
  disable: {
    status: true,
    message: "maaf, ytdl video sedang error dikarnakan akses server amira ke layanan ytdl nya diblokir.\n\n_~ Regards ZTRdiamond_"
  },
  command: ["ytvideo", "ytv", "ytmp4"],
  code: async({ client, m, remote, text, plugins, Func, MessageBuilder, MessageCollector, facemoji, alertMessage, logs }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build();
      
      if (!text) return m.reply(`Berikan link video nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .ytv https://youtu.be/8RmZFUxos3E",
        message
      );

      const meta = (await plugins.ytinfo(text)).data[0];

      const thumbnail = new MessageBuilder()
        .setStyle(1)
        .setThumbnailTitle(meta.title)
        .setThumbnailBody("YouTube Downloader | Amira Assistant")
        .setThumbnailImage(meta.thumbnail)
        .build();
      
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
        `> Setelah memilih kualitas video, silahkan tunggu sebentar sampai video terkirim.`,
        thumbnail
      );

      const col = new MessageCollector(m, { timeout: 60 * 1000 });

      col.on("collect", async(ctx) => {
        const selected = parseInt(ctx.body);
        if (!Number.isInteger(selected)) return m.reply(`Maaf kak, input yang kakak masukan bukan angka ${facemoji.sigh}`, message);

        const quality = [1080, 720, 480, 360, 240, 144];
        if (selected > 6) return ctx.reply(`Maaf kak, kualitas yang kakak pilih tidak tersedia ${facemoji.sad}`, message);

        await ctx.reply(`Tunggu sebentar, amira sedang mengirim videonya...\n` +
          `\n` +
          `*Details:*\n` +
          `> Title: *${meta.title}*\n` +
          `> Kualitas dipilih: *${quality[selected - 1]}p*\n`,
          thumbnail
        );

        let ytmp4 = await plugins.ytmp4(text, quality[selected - 1]);
        if (!ytmp4.media) {
          ctx.reply(`Maaf kak, amira gagal mendapatkan media nya ${facemoji.sad}`, message);
          return col.collected();
        }
        
        await client.sendMedia(remote, ytmp4.media, m, {
          caption: `Ini video youtube nya kak ${facemoji.joy}`,
          fileName: meta.title + ".mp4",
          mimetype: "video/mp4",
          ...thumbnail
        });
        
        /* ffmpeg copy
        let tempFilePath = path.join(__dirname, "./../../../../temp", "ytdl-sve-" + Date.now() + ".mp4");
        let outputFilePath = path.join(__dirname, "./../../../../temp", "ytdl-out-" + Date.now() + ".mp4");

        await fs.writeFileSync(tempFilePath, (await Func.fetchBuffer(ytmp4.media)).data);

        try {
          await exec(`ffmpeg -i "${tempFilePath}" -c copy "${outputFilePath}"`, (error, stdout, stderr) => {
            if (error) {
              logs.commandError(import.meta.url, m, error);
            } else {
              console.log(stdout)
            }
          });

          ytmp4.media = await fs.readFileSync(outputFilePath);

          await client.sendMedia(remote, ytmp4.media, m, {
            caption: `Ini video youtube nya kak ${facemoji.joy}`,
            fileName: meta.title + ".mp4",
            mimetype: "video/mp4",
            ...thumbnail
          });

        } catch (err) {
          m.reply(`Maaf kak, terjadi kesalahan saat memproses video. ${facemoji.sad}\nError: ${err.message}`, message);
        } finally {
          if(await fs.existsSync(tempFilePath)) await fs.unlinkSync(tempFilePath);
          if(await fs.existsSync(outputFilePath)) await fs.unlinkSync(outputFilePath);
        }
        */
      });

      col.on("exit", (ctx) => {
        if (ctx.status == "collected") return;
        m.reply(`Maaf kak, sesi download nya amira akhiri karena waktu sesi sudah habis ${facemoji.sad}`, thumbnail);
      });

    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}];