export default [{
  tag: "group",
  name: "hidetag",
  command: ["ohidetag", "oht", "ohtag"],
  options: {
    isGroup: true,
    isOwner: true
  },
  code: async({ client, m, quoted, remote, text, participants, sender, facemoji, MessageBuilder, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build();
      
      if(!text) return m.reply(`Berikan teks yang akan jadi pesan tag kak ${facemoji.joy}`);
      if(m.isMedia || quoted.isMedia) {
        const media = quoted.isMedia ? await quoted.download() : m.download();
        await client.sendMedia(remote, media, m, {
          caption: text,
          mentions: await participants.map(d => d.id),
          ...thumb
        });
      } else {
        await client.sendMessage(remote, {
          text, 
          mentions: await participants.map(d => d.id),
          ...thumb
        })
      }
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]