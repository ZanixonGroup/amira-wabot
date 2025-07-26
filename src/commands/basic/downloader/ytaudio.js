import axios from "axios";

export default [{
  tag: "downloader",
  name: "ytaudio",
  disable: {
    status: false,
    message: "fitur ini sedang error, segera akan kami perbaiki"
  },
  command: ["ytaudio", "yta", "ytmp3"],
  code: async({ client, m, remote, text, plugins, MessageBuilder, MessageCollector, facemoji, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan link video nya kak ${facemoji.joy}\n` + 
        "\n" +
        "*Contoh:*\n" +
        "> .yta https://youtu.be/8RmZFUxos3E",
      message);
      const meta = (await plugins.ytinfo(text)).data[0];
      const ytdl = await plugins.ytmp3(text);
      if(!ytdl.success) return m.reply(`Maaf kak, amira gagal mendapatkan data nya ${facemoji.sad}`, message)
      if(!ytdl.media) return m.reply(`Maaf kak, amira gagal mendownload media nya ${facemoji.sad}`, message)
      
      const thumbnail = new MessageBuilder()
        .setStyle(1)
        .setThumbnailTitle(meta.title)
        .setThumbnailBody("YouTube Downloader | Amira Assistant")
        .setThumbnailImage(meta.thumbnail)
        .build()
      
      await m.reply(`Tunggu sebentar ya kak, audio sedang dikirim  ${facemoji.joy}\n` +
      `\n` +
      `> *Judul:* ${meta.title}\n` +
      `> *Author:* ${meta.author}\n` +
      `> *Url:* ${text}\n`, thumbnail);
      await client.sendMedia(remote, ytdl.media, m, {
        mimetype: "audio/mp4",
        fileName: meta.title + ".mp3"
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]