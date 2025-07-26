export default [{
  tag: "group",
  name: "add",
  command: ["add", "+", "tambah"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ client, m, text, isQuoted, quoted, facemoji, sender, remote, MessageBuilder, participants }) => {
    let numberBot = client.user?.["id"]["split"](":")[0] + "@s.whatsapp.net";
    let target = "";
    if (isQuoted) {
      target = quoted.sender;
    } else if (typeof text === "number") {
      target = text + "@s.whatsapp.net";
    } else return m.reply(`Tolong masukkan nomor target atau reply pesan target kak ${facemoji.joy}`);
    
    let findAndMatch = participants.find(d => d.id === target);
    if (findAndMatch) return m.reply(`Dia sudah berada disini kak ${facemoji.joy}`);
    if (numberBot === target) return m.reply(`Kakak tidak bisa menambahkanku karena aku sudah disini ${facemoji.confused}`);
    if (sender === target) return m.reply(`Kakak tidak bisa menambahkan nomor kakak sendiri ${facemoji.joy}`);
    
    let message = new MessageBuilder()
    .setStyle(2)
    .setText(`Sukses menambahkannya kak ${facemoji.happy}`)
    .build()
    
    await client.groupParticipantsUpdate(remote, [target], "add");
    client.sendMessage(remote, message, { quoted: m });
  }
},{
  tag: "group",
  name: "kick",
  command: ["kick", "-", "tendang"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ client, m, text, isQuoted, quoted, facemoji, sender, remote, MessageBuilder, participants }) => {
    let numberBot = client.user?.["id"]["split"](":")[0] + "@s.whatsapp.net";
    let target = "";
    if (isQuoted) {
      target = quoted.sender;
    } else if (typeof text === "number") {
      target = text + "@s.whatsapp.net";
    } else return m.reply(`Tolong masukkan nomor target atau reply pesan target kak ${facemoji.joy}`);
    
    let findAndMatch = participants.find(d => d.id !== target)
    if (!findAndMatch) return m.reply(`Dia tidak berada disini kak ${facemoji.joy}`);
    if (numberBot === target) return client.groupLeave(remote);
    
    let message = new MessageBuilder()
    .setStyle(2)
    .setText(`Sukses mengeluarkan kak ${facemoji.happy}`)
    .build()
    
    await client.groupParticipantsUpdate(remote, [target], "remove");
    client.sendMessage(remote, message, { quoted: m });
  }
},{
  tag: "group",
  name: "promote",
  command: ["promote"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ client, m, isQuoted, quoted, facemoji, sender, remote, MessageBuilder, mentions, participants }) => {
    let numberBot = client.user?.["id"]["split"](":")[0] + "@s.whatsapp.net";
    let target = "";
    if (isQuoted) {
      target = quoted.sender;
    } else if (typeof mentions[0] === "string") {
      target = mentions[0];
    } else return m.reply(`Tolong masukkan nomor target atau reply pesan target kak ${facemoji.joy}`);
   
    let findAndMatch = participants.find(d => d.id === target);
    if (!findAndMatch) return m.reply(`Dia tidak disini kak ${facemoji.sad}`);
    if (numberBot === target) return m.reply(`Kakak tidak bisa mempromote aku karena aku sudah menjadi admin ${facemoji.shy}`);
    if (sender === target) return m.reply(`Kakak tidak bisa mempromote kakak sendiri karena kakak sudah menjadi admin ${facemoji.joy}`);
    
    let message = new MessageBuilder()
    .setStyle(2)
    .setText(`Sukses mempromote kak ${facemoji.happy}`)
    .build()
    
    await client.groupParticipantsUpdate(remote, [target], "promote");
    client.sendMessage(remote, message, { quoted: m });
  }
},{
  tag: "group",
  name: "demote",
  command: ["demote"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ client, m, isQuoted, quoted, facemoji, sender, remote, MessageBuilder, mentions, participants }) => {
    let numberBot = client.user?.["id"]["split"](":")[0] + "@s.whatsapp.net";
    let target = "";
    if (isQuoted) {
      target = quoted.sender;
    } else if (typeof mentions[0] === "string") {
      target = mentions[0];
    } else return m.reply(`Tolong masukkan nomor target atau reply pesan target kak ${facemoji.joy}`);
   
    let findAndMatch = participants.find(d => d.id === target);
    if (!findAndMatch) return m.reply(`Dia tidak disini kak ${facemoji.sad}`);
    if (numberBot === target) return m.reply(`Kakak tidak bisa mendemote aku karena aku admin ${facemoji.shy}`);
    
    let message = new MessageBuilder()
    .setStyle(2)
    .setText(`Sukses mendemote kak ${facemoji.happy}`)
    .build()
    
    await client.groupParticipantsUpdate(remote, [target], "demote");
    client.sendMessage(remote, message, { quoted: m });
  }
}];