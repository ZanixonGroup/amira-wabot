export default [{
  tag: "convert",
  name: "quotly",
  command: ["quotly", "quotlychat", "qc"],
  cooldown: {
    status: true,
    duration: 5000
  },
  code: async({ client, m, quoted, isQuoted, remote, text, plugins, mimetype, facemoji, MessageBuilder, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build();
      
      let quotly = {
        sender: {
          name: await client.getName(quoted.sender) || m.pushName, 
          text: m?.quoted?.body || text,
          avatar: await client.profilePictureUrl(quoted.sender, "image")
        }
      }
      if(!quotly.sender.text) return m.reply(`Tolong isi text pada perintah kak ${facemoji.joy}`, thumb)
      if(quoted.isMedia || m.isMedia) {
        const media = await plugins.upload(await quoted.download() || await m.download());
        if(media.status) {
          quotly.media = media.data.url
        } else {}
      }
      const exif = {
        packName: "Created by Amira Chatbot\n" +
          "\n" +
          "Bot: +62 856-9710-39023\n" +
          "Gc: s.id/znxnwa\n" +
          "\n" +
          "Copyright © Zanixon Group 2024",
        packPublish: ""
      };
      const sticker = await plugins.quotlyChat(quotly);
      await client.sendMedia(remote, sticker.data.image, m, {
        asSticker: true,
        ...exif
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]