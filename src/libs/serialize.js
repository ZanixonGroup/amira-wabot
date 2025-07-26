import "../config.js"
import Function from "./function.js"
import { writeExif } from "./sticker.js"

import baileys, { prepareWAMessageMedia } from "@whiskeysockets/baileys"
const { jidNormalizedUser, proto, areJidsSameUser, extractMessageContent, generateMessageIDV2, generateWAMessageContent, generateWAMessageFromContent, downloadContentFromMessage, toBuffer, getDevice, getContentType, generateWAMessage } = baileys
import fs from "fs"
import axios from "axios"
import path from "path"
import { fileTypeFromBuffer } from 'file-type'
import { parsePhoneNumber } from "libphonenumber-js"
import { fileURLToPath } from "url"
import Crypto from 'crypto'
import knex from "./../utils/Database.js";
import MiddlewareManager from "./../cores/managers/Middleware.js";
const Middleware = new MiddlewareManager();

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export async function BindClient({ client, db }) {
  global.db = db;
   
   /* Combining Store to Client
   for (let v in store) {
      client[v] = store[v];
   }
   */

   
   const bind = Object.defineProperties(client, {
      groups: { async value() { return await client.groupFetchAllParticipating() }, enumerable: true },
      
      // middleware 
      use: {
        async value(f, o) { Middleware.use(f, o) }
      },
      run: {
        async value(c) { Middleware.run(c) }
      },
      loadMiddlewares: {
        async value(d) { Middleware.loadMiddlewares(d) }
      },
      
      db: { value: db },
      knex: { value: knex },
      
      getContentType: {
         value(content) {
            if (content) {
               const keys = Object.keys(content);
               const key = keys.find(k => (k === 'conversation' || k.endsWith('Message') || k.endsWith('V2') || k.endsWith('V3')) && k !== 'senderKeyDistributionMessage');
               return key
            }
         },
         enumerable: true
      },

      decodeJid: {
         value(jid) {
            if (/:\d+@/gi.test(jid)) {
               const decode = jidNormalizedUser(jid);
               return decode
            } else return jid;
         }
      },

      generateMessageID: {
         value(id = "3EB0", length = 18) {
            return id + Crypto.randomBytes(length).toString('hex').toUpperCase()
         }
      },

      getName: {
         value(jid) {
            let id = client.decodeJid(jid)
            let v
            if (id?.endsWith("@g.us")) return new Promise(async (resolve) => {
               v = client.contacts[id] || client.messages["status@broadcast"]?.array?.find(a => a?.key?.participant === id)
               if (!(v.name || v.subject)) v = client.groupMetadata[id] || {}
               resolve(v?.name || v?.subject || v?.pushName || (parsePhoneNumber('+' + id.replace("@g.us", "")).format("INTERNATIONAL")))
            })
            else v = id === "0@s.whatsapp.net" ? {
               id,
               name: "WhatsApp"
            } : id === client.decodeJid(client?.user?.id) ?
               client.user : (client.contacts[id] || {})
            return (v?.name || v?.subject || v?.pushName || v?.verifiedName || (parsePhoneNumber('+' + id.replace("@s.whatsapp.net", "")).format("INTERNATIONAL")))
         }
      },
      
      getFile: {
          /**
           * getBuffer hehe
           * @param {fs.PathLike} PATH 
           * @param {Boolean} saveToFile
           */
          async value(PATH, saveToFile = false) {
              let res, filename
              const data = Buffer.isBuffer(PATH) ? PATH : PATH instanceof ArrayBuffer ? PATH.toBuffer() : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await axios.get(PATH, { responseType: "arraybuffer" })).data : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
              if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
              const type = await fileTypeFromBuffer(data) || {
                  mime: 'application/octet-stream',
                  ext: '.bin'
              }
              if (data && saveToFile && !filename) (filename = path.join(__dirname, '../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
              return {
                  res,
                  filename,
                  ...type,
                  data,
                  deleteFile() {
                      return filename && fs.promises.unlink(filename)
                  }
              }
          },
          enumerable: true
      },
      
      sendFile: {
          /*
           * Send Media/File with Automatic Type Specifier
           * @param {String} jid
           * @param {String|Buffer} path
           * @param {String} filename
           * @param {String} caption
           * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
           * @param {Boolean} ptt
           * @param {Object} options
           */
          async value(jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) {
              let type = await client.getFile(path, true)
              let { res, data: file, filename: pathFile } = type
              if (res && res.status !== 200 || file.length <= 65536) {
                  try { throw { json: JSON.parse(file.toString()) } }
                  catch (e) { if (e.json) throw e.json }
              }
              const fileSize = fs.statSync(pathFile).size / 1024 / 1024
              if (fileSize >= 100) throw new Error('File size is too big!')
              let opt = {}
              if (quoted) opt.quoted = quoted
              if (!type) options.asDocument = true
              let mtype = '', mimetype = options.mimetype || type.mime, convert
              if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
              else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
              else if (/video/.test(type.mime)) mtype = 'video'
              else if (/audio/.test(type.mime)) (
                  convert = await toAudio(file, type.ext),
                  file = convert.data,
                  pathFile = convert.filename,
                  mtype = 'audio',
                  mimetype = options.mimetype || 'audio/ogg; codecs=opus'
              )
              else mtype = 'document'
              if (options.asDocument) mtype = 'document'

              delete options.asSticker
              delete options.asLocation
              delete options.asVideo
              delete options.asDocument
              delete options.asImage

              let message = {
                  ...options,
                  caption,
                  ptt,
                  [mtype]: { url: pathFile },
                  mimetype,
                  fileName: filename || pathFile.split('/').pop()
              }
              /**
               * @type {import('@adiwajshing/baileys').proto.WebMessageInfo}
               */
              let m
              try {
                  m = await client.sendMessage(jid, message, { ...opt, ...options, ...ephemeral })
              } catch (e) {
                  console.error(e)
                  m = null
              } finally {
                  if (!m) m = await client.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options, ...ephemeral })
                  file = null // releasing the memory
                  return m
              }
          },
          enumerable: true
      },
      
      sendContact: {
         async value(jid, number, quoted, options = {}) {
            let list = []
            for (let v of number) {
               list.push({
                  displayName: await client.getName(v),
                  vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await client.getName(v + "@s.whatsapp.net")}\nFN:${await client.getName(v + "@s.whatsapp.net")}\nitem1.TEL;waid=${v}:${v}\nitem1.X-ABLabel:Ponsel\nitem2.EMAIL;type=INTERNET:${global?.exif.packEmail}\nitem2.X-ABLabel:Email\nitem3.URL:${global?.exif.packWebsite}\nitem3.X-ABLabel:Instagram\nitem4.ADR:;;Indonesia;;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
               })
            }
            return client.sendMessage(jid, {
               contacts: {
                  displayName: `${list.length} Contact`,
                  contacts: list
               },
               mentions: quoted?.participant ? [client.decodeJid(quoted?.participant)] : [client.decodeJid(client?.user?.id)],
               ...options
            }, { quoted, ...options })
         },
         enumerable: true
      },

      parseMention: {
         value(text) {
            return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') || []
         }
      },

      downloadMediaMessage: {
         async value(message, filename) {
            let mime = {
               imageMessage: "image",
               videoMessage: "video",
               stickerMessage: "sticker",
               documentMessage: "document",
               audioMessage: "audio",
               ptvMessage: "video"
            }[message.type]

            if ('thumbnailDirectPath' in message.msg && !('url' in message.msg)) {
               message = {
                  directPath: message.msg.thumbnailDirectPath,
                  mediaKey: message.msg.mediaKey
               };
               mime = 'thumbnail-link'
            } else {
               message = message.msg
            }

            return await toBuffer(await downloadContentFromMessage(message, mime))
         },
         enumerable: true
      },

      sendMedia: {
         async value(jid, url, quoted = "", options = {}) {
            try {
              let { mime, data: buffer, ext, size } = await Function.getFile(url)
              mime = options?.mimetype ? options.mimetype : mime
              let data = { text: "" }, mimetype = /audio/i.test(mime) ? "audio/mp4" : mime
              if (size > 45000000) data = { document: buffer, mimetype: mime, fileName: options?.fileName ? options.fileName : `${client.user?.name} (${new Date()}).${ext}`, ...options }
              else if (options.asDocument) data = { document: buffer, mimetype: mime, fileName: options?.fileName ? options.fileName : `${client.user?.name} (${new Date()}).${ext}`, ...options }
              else if (options.asSticker || /webp/.test(mime)) {
                 let pathFile = await writeExif({ mimetype, data: buffer }, { ...options })
                 data = { sticker: fs.readFileSync(pathFile), mimetype: "image/webp", ...options }
                 fs.existsSync(pathFile) ? await fs.promises.unlink(pathFile) : ""
              }
              else if (/image/.test(mime)) data = { image: buffer, mimetype: options?.mimetype ? options.mimetype : 'image/png', ...options }
              else if (/video/.test(mime)) data = { video: buffer, mimetype: options?.mimetype ? options.mimetype : 'video/mp4', ...options }
              else if (/audio/.test(mime)) data = { audio: buffer, mimetype: options?.mimetype ? options.mimetype : 'audio/mp4', ...options }
              else data = { document: buffer, mimetype: mime, ...options }
              let msg = await client.sendMessage(jid, data, { quoted, ...options })
              return msg
            } catch (e) {
              return e;
            }
         },
         enumerable: true
      },
      
      sendAIMessage: {
        async value(jid, config, options) {
          let msg;
          let message = await generateWAMessageContent(config, { upload: client.waUploadToServer });
          let type = await getContentType(message);
          if(!options) message[type].contextInfo = {
            stanzaId: options?.quoted.key.id,
            participant: options?.quoted.key.participant || options?.quoted.key.remoteJid,
            quotedMessage: options?.quoted
          };
          msg = await client.relayMessage(jid, message, {
            messageId: generateMessageIDV2(client.user.id),
            additionalNodes: [{
              attrs: {
                biz_bot: '1'
              },
              tag: 'bot'
            }]
          })
          return {
            id: msg,
            fromMe: true,
            remoteJid: jid
          }
        }
      },

      cMod: {
         value(jid, copy, text = '', sender = client.user.id, options = {}) {
            let mtype = client.getContentType(copy.message)
            let content = copy.message[mtype]
            if (typeof content === "string") copy.message[mtype] = text || content
            else if (content.caption) content.caption = text || content.text
            else if (content.text) content.text = text || content.text
            if (typeof content !== "string") {
               copy.message[mtype] = { ...content, ...options }
               copy.message[mtype].contextInfo = {
                  ...(content.contextInfo || {}),
                  mentionedJid: options.mentions || content.contextInfo?.mentionedJid || []
               }
            }
            if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant
            if (copy.key.remoteJid.includes("@s.whatsapp.net")) sender = sender || copy.key.remoteJid
            else if (copy.key.remoteJid.includes("@broadcast")) sender = sender || copy.key.remoteJid
            copy.key.remoteJid = jid
            copy.key.fromMe = areJidsSameUser(sender, client.user.id)
            return proto.WebMessageInfo.fromObject(copy)
         }
      },

      sendPoll: {
         async value(chatId, name, values, options = {}) {
            let selectableCount = options?.selectableCount ? options.selectableCount : 1
            return await client.sendMessage(chatId, {
               poll: {
                  name,
                  values,
                  selectableCount
               },
               ...options
            }, { ...options })
         },
         enumerable: true
      },

      setProfilePicture: {
         async value(jid, media, type = "full") {
            let { data } = await Function.getFile(media)
            if (/full/i.test(type)) {
               data = await Function.resizeImage(media, 720)
               await client.query({
                  tag: 'iq',
                  attrs: {
                     to: await client.decodeJid(jid),
                     type: 'set',
                     xmlns: 'w:profile:picture'
                  },
                  content: [{
                     tag: 'picture',
                     attrs: { type: 'image' },
                     content: data
                  }]
               })
            } else {
               data = await Function.resizeImage(media, 640)
               await client.query({
                  tag: 'iq',
                  attrs: {
                     to: await client.decodeJid(jid),
                     type: 'set',
                     xmlns: 'w:profile:picture'
                  },
                  content: [{
                     tag: 'picture',
                     attrs: { type: 'image' },
                     content: data
                  }]
               })
            }
         },
         enumerable: true
      },

      sendGroupV4Invite: {
         async value(jid, groupJid, inviteCode, inviteExpiration, groupName, jpegThumbnail, caption = "Invitation to join my WhatsApp Group", options = {}) {
            const media = await prepareWAMessageMedia({ image: (await Function.getFile(jpegThumbnail)).data }, { upload: client.waUploadToServer })
            const message = proto.Message.fromObject({
               groupJid,
               inviteCode,
               inviteExpiration: inviteExpiration ? parseInt(inviteExpiration) : +new Date(new Date() + (3 * 86400000)),
               groupName,
               jpegThumbnail: media.imageMessage?.jpegThumbnail || jpegThumbnail,
               caption
            })

            const m = generateWAMessageFromContent(jid, message, { userJid: client.user?.id })
            await client.relayMessage(jid, m.message, { messageId: m.key.id })

            return m
         },
         enumerable: true
      },
      
      generateMessage: {
        async value(jid, message, quoted = {}, options = {}) {
          let generate = await generateWAMessage(jid, message, quoted)
          const type = getContentType(generate.message)
          if ('contextInfo' in message) generate.message[type].contextInfo = {
            ...generate.message[type].contextInfo,
            ...message.contextInfo
          }
          if ('contextInfo' in options) generate.message[type].contextInfo = {
            ...generate.message[type].contextInfo,
            ...options.contextInfo
          }
          return await generate;
        }
      }
   })
   
   return client
}

export async function Serialize(client, msg, store) {
   const m = {}
   const botNumber = client.decodeJid(client.user?.id)

   if (!msg.message) return;
   if (msg.key && msg.key.remoteJid == "status@broadcast") return;

   m.message = extractMessageContent(msg.message)

   if (msg.key) {
      m.key = msg.key
      m.from = client.decodeJid(m.key.remoteJid)
      m.fromMe = m.key.fromMe
      m.id = m.key.id
      m.device = getDevice(m.id)
      m.isBaileys = m.id.startsWith("BAE5")
      m.isGroup = m.from.endsWith("@g.us")
      m.participant = jidNormalizedUser(msg?.participant || m.key.participant) || false
      m.sender = client.decodeJid(m.fromMe ? client.user.id : m.isGroup ? m.participant : m.from)
   }
   
   m.pushName = msg.pushName
   m.isOwner = m.sender && global.bot.owner.includes(m.sender.replace(/\D+/g, ""))
   m.isModerator = m.sender && global.bot.moderator.includes(m.sender.replace(/\D+/g, ""))
   /*
   if (m.isGroup) {
      m.metadata = groups[m.from]
      m.admins = (m.metadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []))
      m.isAdmin = !!m.admins.find((member) => member.id === m.sender)
      m.isBotAdmin = !!m.admins.find((member) => member.id === botNumber)
   }
   */
   
   if (m.message) {
      m.type = client.getContentType(m.message) || Object.keys(m.message)[0]
      m.msg = extractMessageContent(m.message[m.type]) || m.message[m.type]
      m.mentions = m.msg?.contextInfo?.mentionedJid || []
      m.body = m.msg?.text || m.msg?.conversation || m.msg?.caption || m.message?.conversation || m.msg?.selectedButtonId || m.msg?.singleSelectReply?.selectedRowId || m.msg?.selectedId || m.msg?.contentText || m.msg?.selectedDisplayText || m.msg?.title || m.msg?.name || ""
      m.prefix = global.bot.prefix.test(m.body) ? m.body.match(global.bot.prefix)[0] : ""
      m.command = m.body && m.body.replace(m.prefix, '').trim().split(/ +/).shift()
      m.arg = m.body.trim().split(/ +/).filter(a => a) || []
      m.args = m.body.trim().replace(new RegExp("^" + Function.escapeRegExp(m.prefix), 'i'), '').replace(m.command, '').split(/ +/).filter(a => a) || []
      m.text = m.args.join(" ")
      m.expiration = m.msg?.contextInfo?.expiration || 0
      m.timestamp = (typeof msg.messageTimestamp === "number" ? msg.messageTimestamp : msg.messageTimestamp.low ? msg.messageTimestamp.low : msg.messageTimestamp.high) || m.msg.timestampMs * 1000
      m.isMedia = !!m.msg?.mimetype || !!m.msg?.thumbnailDirectPath
      if (m.isMedia) {
         m.mimetype = m.msg?.mimetype
         m.size = m.msg?.fileLength
         m.height = m.msg?.height || ""
         m.width = m.msg?.width || ""
         if (/webp/i.test(m.mimetype)) {
            m.isAnimated = m.msg?.isAnimated
         }
      }
      m.reply = async (text, options = {}) => {
         let chatId = options?.from ? options.from : m.from
         let quoted = options?.quoted ? options.quoted : m

         if ((Buffer.isBuffer(text) || /^data:.?\/.*?;base64,/i.test(text) || /^https?:\/\//.test(text) || fs.existsSync(text))) {
            let data = await Function.getFile(text)
            if (!options.mimetype && (/utf-8|json/i.test(data.mime) || data.ext == ".bin" || !data.ext)) {
               if (!!global.alertMessage[text]) text = global.alertMessage[text]
               return client.sendMessage(chatId, { text, mentions: [m.sender, ...client.parseMention(text)], ...options }, { quoted, ephemeralExpiration: m.expiration, ...options })
            } else {
               return client.sendMedia(m.from, data.data, quoted, { ephemeralExpiration: m.expiration, ...options })
            }
         } else {
            if (!!global.alertMessage[text]) text = global.alertMessage[text]
            return client.sendMessage(chatId, { text, mentions: [m.sender, ...client.parseMention(text)], ...options, }, { quoted, ephemeralExpiration: m.expiration, ...options });
         }
      }
      m.download = (filepath) => {
         if (filepath) return client.downloadMediaMessage(m, filepath)
         else return client.downloadMediaMessage(m)
      }
      m.react = async (react, msg) => react ? (msg ? await client.sendMessage(msg.from, { react: { text: react, key: msg.key }}) : null) : null
   }

   // quoted line
   m.isQuoted = false
   if (m.msg?.contextInfo?.quotedMessage) {
      m.isQuoted = true
      m.quoted = {}
      m.quoted.message = extractMessageContent(m.msg?.contextInfo?.quotedMessage)

      if (m.quoted.message) {
         m.quoted.type = client.getContentType(m.quoted.message) || Object.keys(m.quoted.message)[0]
         m.quoted.msg = extractMessageContent(m.quoted.message[m.quoted.type]) || m.quoted.message[m.quoted.type]
         m.quoted.key = {
            remoteJid: m.msg?.contextInfo?.remoteJid || m.from,
            participant: m.msg?.contextInfo?.remoteJid?.endsWith("g.us") ? client.decodeJid(m.msg?.contextInfo?.participant) : false,
            fromMe: areJidsSameUser(client.decodeJid(m.msg?.contextInfo?.participant), client.decodeJid(client?.user?.id)),
            id: m.msg?.contextInfo?.stanzaId
         }
         m.quoted.from = m.quoted.key.remoteJid
         m.quoted.fromMe = m.quoted.key.fromMe
         m.quoted.id = m.msg?.contextInfo?.stanzaId
         m.quoted.device = getDevice(m.quoted.id)
         m.quoted.isBaileys = m.quoted.id.startsWith("BAE5")
         m.quoted.isGroup = m.quoted.from.endsWith("@g.us")
         m.quoted.sender = client.decodeJid(m.msg?.contextInfo?.participant)

         m.quoted.isOwner = m.quoted.sender && global.bot.owner.includes(m.quoted.sender.replace(/\D+/g, ""))
         m.quoted.isModerator = m.quoted.sender && global.bot.moderator.includes(m.quoted.sender.replace(/\D+/g, ""))
         /*
         if (m.quoted.isGroup) {
            m.quoted.metadata = groups[m.quoted.from]
            m.quoted.admins = (m.quoted.metadata.participants.reduce((memberAdmin, memberNow) => (memberNow.admin ? memberAdmin.push({ id: memberNow.id, admin: memberNow.admin }) : [...memberAdmin]) && memberAdmin, []))
            m.quoted.isAdmin = !!m.quoted.admins.find((member) => member.id === m.quoted.sender)
            m.quoted.isBotAdmin = !!m.quoted.admins.find((member) => member.id === botNumber)
         }
         */
         
         m.quoted.mentions = m.quoted.msg?.contextInfo?.mentionedJid || []
         m.quoted.body = m.quoted.msg?.text || m.quoted.msg?.caption || m.quoted?.message?.conversation || m.quoted.msg?.selectedButtonId || m.quoted.msg?.singleSelectReply?.selectedRowId || m.quoted.msg?.selectedId || m.quoted.msg?.contentText || m.quoted.msg?.selectedDisplayText || m.quoted.msg?.title || m.quoted?.msg?.name || ""
         m.quoted.prefix = global.bot.prefix.test(m.quoted.body) ? m.quoted.body.match(global.bot.prefix)[0] : "#"
         m.quoted.command = m.quoted.body && m.quoted.body.replace(m.quoted.prefix, '').trim().split(/ +/).shift()
         m.quoted.arg = m.quoted.body.trim().split(/ +/).filter(a => a) || []
         m.quoted.args = m.quoted.body.trim().replace(new RegExp("^" + Function.escapeRegExp(m.quoted.prefix), 'i'), '').replace(m.quoted.command, '').split(/ +/).filter(a => a) || []
         m.quoted.text = m.quoted.args.join(" ")
         m.quoted.isMedia = !!m.quoted.msg?.mimetype || !!m.quoted.msg?.thumbnailDirectPath
         if (m.quoted.isMedia) {
            m.quoted.mimetype = m.quoted.msg?.mimetype
            m.quoted.size = m.quoted.msg?.fileLength
            m.quoted.height = m.quoted.msg?.height || ''
            m.quoted.width = m.quoted.msg?.width || ''
            if (/webp/i.test(m.quoted.mimetype)) {
               m.quoted.isAnimated = m?.quoted?.msg?.isAnimated || false
            }
         }
         m.quoted.reply = (text, options = {}) => {
            return m.reply(text, { quoted: m.quoted, ...options })
         }
         m.quoted.download = (filepath) => {
            if (filepath) return client.downloadMediaMessage(m.quoted, filepath)
            else return client.downloadMediaMessage(m.quoted)
         }
         m.quoted.react = (react) => react ? (client.sendMessage(m.quoted.from, { react: { text: react, key: m.quoted.key }})) : undefined
      }
   }

   return m
}