import { fileTypeFromBuffer } from "file-type";

export default [{
  tag: "downloader",
  name: "mediafire",
  command: ["mediafire", "mf"],
  code: async({ client, m, remote, isPremium, text, Func, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setThumbnailTitle("Mediafire Downloader | Amira Chatbot")
        .build();
      
      if(!text) return m.reply(`Tolong berikan input link mediafire nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .mf https://www.mediafire.com/file/xfzvvr1b8le7eo6/20241103_091140.jpg/file\n` +
        `> .mediafire https://www.mediafire.com/file/xfzvvr1b8le7eo6/20241103_091140.jpg/file`
      , thumb);
      if(!Boolean(Func.isUrl(text))) return m.reply(`Maaf kak, url yang kakak input bukan link yg valid ${facemoji.sad}`, thumb);
      
      const mediafire = await plugins.mediafire(text);
      if(!mediafire.success) return m.reply(`Maaf kak, amira gagal saat mendapatkan data nya ${facemoji.sad}`, thumb);
      
      const buffer = await Func.fetchBuffer(mediafire.result.download)
      const mime = await fileTypeFromBuffer(buffer.data)
      
      if(!isPremium || Func.parseFileSize(mediafire.result.size || buffer.sizeH) >= 102400000) return m.reply(`Maaf kak, media terlalu besar... dibutuhkan akses premium untuk mengirim media di atas 100MB ${facemoji.sad}`, thumb);
      return await client.sendMedia(remote, buffer.data, m, {
        asDocument: true,
        fileName: mediafire.result.filename || "unknown." + mediafire.result.filename.split("/")[1],
        mimetype: mediafire.result.mimetype || "application/zip",
        caption: mediafire.result.description
      })
    } catch (e) {
      logs.commandError(import.meta.url, m, e);
      return m.reply(alertMessage["error"])
    }
  }
}]