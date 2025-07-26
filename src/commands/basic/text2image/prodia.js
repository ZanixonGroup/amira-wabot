export default [{
  tag: "AI Text2image",
  name: "prodia",
  command: ["prodia"],
  options: {
    isPremium: true
  },
  cooldown: {
    status: true,
    duration: 30000
  },
  disable: {
    status: true,
    message: "Maaf kak, sistem AI prodia error."
  },
  code: async({ client, m, remote, text, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      if(!text) return m.reply(`Berikan prompt gambar nya kak, amira akan berusaha membuatkan gambar nya ${facemoji.joy}`, message);
      const [prompt, negative] = text.split("|");
      const prodia = await plugins.prodia({
        prompt,
        negative
      });
      if(!prodia.status) return m.reply(`Maaf kak, amira gagal untuk membuatkan gambarnya ${facemoji.sad}`, message);
      
      const caption = `Ini gambarnya kak ${facemoji.happy}

*Model:*
> Prodia Stablediffusion

*Prompt:*
> ${prompt}

*Negative prompt:*
> ${negative || "Unknown"}`;
      client.sendMedia(remote, prodia.data, m, {
        caption,
        mimetype: "image/png",
        filename: "prodia.png",
        ...message
      });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]