export default [{
  tag: "downloader",
  name: "gitclone",
  command: ["gitclone"],
  code: async({ client, m, remote, text, Func, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Git Clone | Amira Assistant")
        .build()
      
      if(!text) return m.reply(`Tolong berikan link repo yang ingin di download kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .gitclone https://github.com/ZanixonGroup/amira-bot-base.git`
      , thumb)
      const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
      if(!regex.test(text)) return m.reply(`Maaf kak, link repo tidak valid ${facemoji.sad}`, thumb);
      const url = new URL(text);
      const [user, repo] = url.pathname.replace(/\.git/, "").split("/").slice(1, 3);
      const file = await Func.fetchBuffer(`https://api.github.com/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/zipball`);
      
      // check size limit
      if(file.size >= 104857600) return m.reply(`Maaf kak, repo yang di download terlalu besar. ukuran repo tidak boleh lebih dari 100MB kak ${facemoji.sad}`, thumb);
      
      await client.sendMedia(remote, file.data, m, {
        asDocument: true,
        fileName: `${user}/${repo}.zip`,
        mimetype: "application/zip",
        ...thumb
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]