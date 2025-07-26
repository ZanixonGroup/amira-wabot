export default [{
  tag: "group",
  name: "hidetag",
  command: ["hidetag", "ht", "htag"],
  options: {
    isAdmin: true,
    isGroup: true
  },
  code: async({ client, m, quoted, remote, text, participants, sender, facemoji, MessageBuilder, logs, alertMessage }) => {
    try {
      const freply = { 
          "key": {
              "participants": "0@s.whatsapp.net",
              "remoteJid": "status@broadcast",
              "fromMe": false,
              "id": "Amira-MD"
          },
          "message": {
              "contactMessage": {
                  "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
              }
          },
          "participant": "0@s.whatsapp.net"
      };
      
      if(!text) return m.reply(`Berikan teks yang akan jadi pesan tag kak ${facemoji.joy}`);
      if(m.isMedia || quoted.isMedia) {
        const media = quoted.isMedia ? await quoted.download() : m.download();
        await client.sendMedia(remote, media, m, {
          caption: text,
          mentions: await participants.map(d => d.id),
          quoted: freply
        });
      } else {
        await client.sendMessage(remote, {
          text, 
          mentions: await participants.map(d => d.id)
        }, { quoted: freply })
      }
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]