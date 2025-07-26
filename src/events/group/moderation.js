import { Serialize } from "./../../libs/serialize.js";
import { MessageBuilder, VCardBuilder } from "./../../utils/Builders.js";
import Badwords from "./../../utils/filter.badword.js";

const thumb = new MessageBuilder()
  .setStyle(2)
  .setThumbnailTitle("Moderation Alert | Amira Assistant")
  .build();

const getMessageProperties = (m) => {
  const quoted = m?.isQuoted ? m?.quoted : m;
  return {
    from: m.from,
 // isBaileys: m.isBaileys,
    device: m.device,
    isGroup: m.isGroup,
    isMedia: m.isMedia,
    isOwner: m.isOwner,
    fromMe: m.fromMe,
    quoted,
    quotedUserId: (quoted?.key?.participant || quoted?.key?.remoteJid).split("@")[0],
    args: m.args,
    text: m.text,
    body: m.body,
    mentions: quoted?.mentions || m.mentions,
    mimetype: quoted?.msg?.mimetype || m.msg?.mimetype,
    isQuoted: m.isQuoted,
    sender: m.key?.participant || m.key?.remoteJid,
    userId: (m.key?.participant || m.key?.remoteJid).split("@")[0],
    remote: m.key?.remoteJid,
    pushName: m.pushName,
    type: m.type
  };
};

const getGroupProperties = async (client, isGroup, from, sender) => {
  if (!isGroup) return {};
  const groups = await client.db.get("metadata", "groups");
  const metadata = groups[from] || {};
  const participants = metadata.participants || [{ id: sender, admin: null }];
  const participantIds = participants.map(d => d.id);
  const groupAdmins = participants.filter(d => d.admin === "admin" || d.admin === "superadmin").map(d => d.id);
  const groupSuperAdmin = participants.filter(d => d.admin === "superadmin").map(d => d.id);
  const isAdmin = groupAdmins.includes(sender);
  const isSuperAdmin = groupSuperAdmin.includes(sender);
  const isBotAdmin = groupAdmins.includes(client.user.id.split(":")[0] + "@s.whatsapp.net");

  return {
    groupId: metadata.id.split("@")[0],
    groups,
    metadata,
    participants,
    participantIds,
    groupAdmins,
    groupSuperAdmin,
    isAdmin,
    isSuperAdmin,
    isBotAdmin,
  };
};

export default {
  name: "messages.upsert",
  code: async ({ messages }) => {
    try {
      const client = global.client;
      const m = await Serialize(client, messages[0], global.store);
      
      if (!m) return;
      
      const facemoji = global.facemoji;
      
      const {
        quoted, from, isGroup, sender, userId, quotedUserId, remote, pushName, args,
        text, body, mentions, mimetype, isQuoted, isMedia, fromMe, type,
     // isBaileys
      } = getMessageProperties(m);
      
      const {
        groupId, groups, metadata, participants, participantIds, groupAdmins,
        groupSuperAdmin, isAdmin, isSuperAdmin, isBotAdmin
      } = (await getGroupProperties(client, isGroup, from, sender) || {});
      
      if(!isGroup) return;
      if(fromMe) return;
      if(!isBotAdmin) return;
      let validate = await client.db.has(groupId + ".moderation", "grup")
      if(!validate) await client.db.set(groupId + ".moderation", {
        antilink: {
          status: false,
          action: "DELETE",
          mode: "GRUP"
        },
        antimedia: {
          status: false,
          blacklist: [],
          action: "DELETE"
        },
        antiviewonce: {
          status: false,
          action: "RESEND"
        },
        antibadword: {
          status: false,
          action: "ALERT_ONLY",
          badwords: []
        }
      }, "grup")
      
      async function action(action) {
        switch (action) {
              case 'KICK':
                await client.groupParticipantsUpdate(remote, [sender], "remove");
                break;
              case 'RESEND':
                await client.sendMedia(remote, (await m.download() || await quoted.download()), m, {
                  caption: body || ""
                })
                break;
              default:
                  await client.sendMessage(remote, {
                    delete: {
                      ...m.key,
                      participant: sender
                    }
                  })
            }
      }
      const moderation = await client.db.get(groupId + ".moderation", "grup")
      
      if(moderation.antilink.status) {
        let urlRegex = (moderation.antilink.mode === "ALL") ? /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gmi : /https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/gmi;
        let isGroupUrl = urlRegex.test(body)
        if(isGroupUrl) {
          const currentGroupUrl = 'https://chat.whatsapp.com/' + await client.groupInviteCode(metadata.id);
          if(!(new RegExp(currentGroupUrl, "gmi")).test(body)) {
            await client.sendMessage(remote, { text: `Maaf kak, amira ditugaskan untuk me-moderasi konten di grup ini dan kakak telah melakukan kesalahan, maka dari itu kakak akan amira tindak sesuai moderasi yang di atur disini ${facemoji.sigh}\n` +
              `\n` +
              `*Detail:*\n` +
              `> Alasan: *${(moderation.antilink.mode === "ALL") ? "Mengirim sebuah URL ke grup!" : "Mengirim URL grup lain di grup ini!"}*\n` +
              `> Tindakan di ambil: *${moderation.antilink.action}*`
            , ...thumb });
            action(moderation.antilink.action)
          }
        }
      }
      
      if(moderation.antimedia.status) {
        let findBlacklistedMedia = (media) => moderation.antimedia.blacklist.find(v => v === media)
        let mediaRegex = isMedia ? 
          (type === "imageMessage" && findBlacklistedMedia("image") ? true : 
          (type === "audioMessage" && findBlacklistedMedia("audio") ? true :
          (type === "videoMessage" && findBlacklistedMedia("video") ? true : 
          (type === "documentMessage" && findBlacklistedMedia("document") ? true : false )))) : false;
    
        if(mediaRegex) {
            await client.sendMessage(remote, { text: `Maaf kak, amira ditugaskan untuk me-moderasi konten di grup ini dan kakak telah melakukan kesalahan, maka dari itu kakak akan amira tindak sesuai moderasi yang di atur disini ${facemoji.sigh}\n` +
              `\n` +
              `*Detail:*\n` +
              `> Alasan: *Mengirim sebuah MEDIA ke grup*\n` +
              `> Tindakan di ambil: *${moderation.antimedia.action}*`
            , ...thumb });
            action(moderation.antimedia.action)
          }
        }
        
      if(moderation.antiviewonce.status) {
        let mediaRegex = isMedia ? m.msg.viewOnce : false
        if(mediaRegex) {
          await client.sendMessage(remote, { text: `Maaf kak, amira ditugaskan untuk me-moderasi konten di grup ini dan kakak telah mengirim pesan view once, kakak akan ditindak sesuai pengaturan di grup ini ${facemoji.sigh}\n` +
            `\n` +
            `*Detail:*\n` +
            `> Alasan: *Mengirim sebuah MEDIA sekali lihat ke grup*\n` +
            `> Tindakan di ambil: *${moderation.antiviewonce.action}*`
          , ...thumb });
          action(moderation.antiviewonce.action)
        }
      }
      
      if(moderation.antibadword.status) {
        const badword = new Badwords({
          fromDb: true,
          badwords: moderation.antibadword.badwords
        })
        
        if(badword.check(body)) {
            await client.sendMessage(remote, { text: `Maaf kak, amira ditugaskan untuk me-moderasi konten di grup ini dan kakak telah melakukan kesalahan, maka dari itu kakak akan amira tindak sesuai moderasi yang di atur disini ${facemoji.sigh}\n` +
              `\n` +
              `*Detail:*\n` +
              `> Alasan: *Mengirim kata kasar ke grup!*\n` +
              `> Tindakan di ambil: *${moderation.antibadword.action}*`
            , ...thumb });
            action(moderation.antibadword.action)
        }
      }
    } catch (e) {
      global.logs.error(import.meta.url, e)
    }
  }
}
