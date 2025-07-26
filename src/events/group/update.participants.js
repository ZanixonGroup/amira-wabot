import { MessageBuilder } from "./../../utils/Builders.js";

export default {
    name: "group-participants.update",
    code: async (context) => {
      const {
        id,
        participants,
        action,
        author
      } = context;
      try {
        
        if(!id) return
        const client = global.client;
        await client.db.set("metadata", await client.groups(), "groups").catch(e => global.logs.error(import.meta.url, e))
        const groups = await client.db.get("metadata", "groups");
        
        if(!await client.groupMetadata(id)) return
        let validate = await client.db.has(id.split("@")[0] + ".welcome", "grup")
        if(!validate) await client.db.set(id.split("@")[0] + ".welcome", {
        joinMessage: "",
        addMessage: "",
        leaveMessage: "",
        kickMessage: ""
        }, "grup")
        let group = await client.db.get(id.split("@")[0], "grup").catch(e => global.logs.error(import.meta.url, e)) // fetch group settings data from db (look at the table param!)
        
        const groupMetadata = groups[id];
        const user = participants[0].split("@")[0];
        const member = author.split("@")[0];
        const thumb = new MessageBuilder()
        .setStyle(2)
        .setMentions([participants[0], author])
        .build();
        
        // join & add message
        group.welcome.joinMessage = group.welcome.joinMessage ? group.welcome.joinMessage.replaceAll(`{member}`, member).replaceAll(`{user}`, user) : `Halo @${user}, Selamat Datang digroup ${groupMetadata.subject}`;
        group.welcome.addMessage = group.welcome.addMessage ? group.welcome.addMessage.replaceAll(`{member}`, member).replaceAll(`{user}`, user) : `@${user} telah ditambahkan oleh @${member}`;
        // leave & kick message
        group.welcome.leaveMessage = group.welcome.leaveMessage ? group.welcome.leaveMessage.replaceAll(`{member}`, member).replaceAll(`{user}`, user) : `Sampai jumpa @${user}`;
        group.welcome.kickMessage = group.welcome.kickMessage ? group.welcome.kickMessage.replaceAll(`{member}`, member).replaceAll(`{user}`, user) : `@${user} telah dikeluarkan oleh @${member}`;
        if (/^(add|remove)$/.test(action)) {
          // save updated groups metadata
          
          // welcome status checker
          if(!group.welcome.status) return;
          const message = action === "add"
            ?
            (member !== user) ? group.welcome.addMessage : group.welcome.joinMessage
            :
            (member !== user) ? group.welcome.kickMessage : group.welcome.leaveMessage;
          await client.sendMessage(id, {
              text: message,
              users: [participants[0], author],
              mentions: [participants[0], author],
              ...thumb
          });
        } else if (/^(promote|demote)$/.test(action)) {
          const message = action === "promote" ? `Selamat @${user}, kamu telah di jadikan Admin oleh @${member}` : `@${user} Maaf kamu didemote dari Admin oleh @${member}`;
          await client.sendMessage(id, {
              text: message,
              users: [participants[0], author],
              mentions: [participants[0], author],
              ...thumb
          });
        }
      } catch (e) {
        global.logs.error(import.meta.url, e);
      }
    }
}