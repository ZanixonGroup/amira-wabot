export default [{
  tag: "AI Text2image",
  name: "text2image",
  command: ["txt2img", "text2image", "t2i"],
  cooldown: {
    status: true,
    duration: 5000
  },
  code: async({
    client,
    m,
    remote,
    text,
    plugins,
    text2image = plugins.flux,
    MessageBuilder,
    facemoji,
    logs,
    alertMessage
  }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle(`Text to Image AI | Amira Assistant`)
        .build()
      
      if(!text) return m.reply(`Berikan prompt nya kak ${facemoji.joy}\n` +
        `\n` +
        `*Contoh:*\n` +
        `> .t2i 1girl, zero two, darling in the franxx`
      ,thumb);
      
      const ai = await text2image(text);
      if(!ai.status) return m.reply(`Maaf kak, amira gagal membuatkan gambarnya ${facemoji.sad}`, thumb);
      client.sendMedia(remote, ai.image, m, {
        caption: `Ini dia gambarnya kak ${facemoji.joy}`,
        mimetype: "image/png",
        ...thumb
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]