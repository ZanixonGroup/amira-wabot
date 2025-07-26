import loadCommands from "./../../cores/managers/Command.js";
import loadPlugins from "./../../cores/managers/Plugin.js";
import Queue from "p-queue";
import { Serialize } from "./../../libs/serialize.js";
import Func from "./../../libs/function.js";
import { Uploader } from "./../../utils/Uploader.js";
import { dirname, filename } from "desm";
import fs from "fs";
import path from "path";
import lodash from "lodash";

import hint from "./../../utils/Hint.js";
import Cooldown from "./../../libs/CooldownManager.js";
import MessageCollector from "./../../handler/MessageCollector.js";
import { MessageBuilder, VCardBuilder } from "./../../utils/Builders.js";

const messageStyle = new MessageBuilder().setStyle(2).build();

let isLoaded = false;

const queue = new Queue({
  autoStart: true,
  concurrency: 1,
  intervalCap: 1,
  interval: 15 * 1000
})

const getQueuePriority = (condition) => {
  let priority = 1;
  switch (true) {
    case condition.isOwner:
        priority = 100;
      break;
    case condition.isAdmin:
        priority = 70;
      break;
    case condition.isPremium:
        priority = 50;
      break;
    case condition.isGroup:
        priority = 30;
      break;
    
    default:
      priority = 1;
  }
  return priority;
}

const getMessageProperties = (m) => {
  const quoted = m?.isQuoted ? m?.quoted : m;
  return {
    from: m.from,
    isBaileys: m.isBaileys,
    device: m.device,
    isGroup: m.isGroup,
    isMedia: m.isMedia,
    isOwner: m.isOwner,
    isModerator: m.isModerator,
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
  };
};

const getGroupProperties = async (client, isGroup, from, sender) => {
  if (!isGroup) return {};
  const groups = await client.db.get("metadata", "groups");
  const metadata = groups[from] || {};
  const participants = metadata.participants || [{ id: sender, admin: null }];
  const participantIds = participants.map(d => d.id);
  const groupAdmins = participants.filter(d => d.admin).map(d => d.id);
  const groupSuperAdmin = participants.filter(d => d.admin === "superadmin").map(d => d.id);
  const isAdmin = groupAdmins.includes(sender);
  const isSuperAdmin = groupSuperAdmin.includes(sender);
  const isBotAdmin = groupAdmins.includes(client.user.id.split(":")[0] + "@s.whatsapp.net");

  return {
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

const setupUserDatabase = async (client, sender) => {
  if (!await client.knex.isAvailable({ user_id: sender })) {
    await client.knex("users").insert({
      user_id: sender,
      ticket: 0,
      credits: 0,
      subscription: JSON.stringify({ status: false, expired_date: 0 }),
      banned: false,
      banned_duration: 0
    });
  }
};

const checkPremiumStatus = async (client, sender, date) => {
  let isPremium = (await client.knex("users").where({ user_id: sender }).select("subscription").first())?.subscription?.status ? true : false;
  if (isPremium) {
    const premium = await client.knex("users").where({ user_id: sender }).select("subscription").first();
    if (date >= premium?.subscription?.expired_date) {
      isPremium = false;
      await client.knex("users").where({ user_id: sender }).update("subscription", {
        status: false,
        expired_date: 0,
      }).catch(e => global.logs.error(import.meta.url, e));
    }
  }
  return isPremium;
};

const checkSewaStatus = async (client, id) => {
    const sewa = await client.knex("sewa").where({ sewa_id: id }).first()
    if (Date.now() >= sewa?.duration) {
      await client.sendMessange(remote, {
        text: `Halo semua, amira ingin memberitahu bahwa masa sewa amira pada grup ini telah berakhir hari ini, terimakasih telah mempercayakan amira disini dan terimakasih sudah mensupport amira. wassallamu'aikum. ${global.facemoji.happy}`,
        ...messageStyle })
      await Func.sleep(1500)
      await client.groupLeave(id)
      await client.knex("sewa").where({ sewa_id: id }).del().catch(e => global.logs.error(import.meta.url, e));
      return true;
    } else return false;
}

const checkBannedStatus = async (client, sender, date) => {
  let user = await client.knex("users").where({ user_id: sender }).first()
  let isBanned = user.banned;
  if (isBanned) {
    if (date >= user.banned_duration) {
      isBanned = false;
      await client.knex("users").where({ user_id: sender }).update({
        banned: false,
        banned_duration: 0,
      }).catch(e => global.logs.error(import.meta.url, e));
    }
  }
  return isBanned;
};

const checkChatStatus = async (client, metadata) => {
  let chat = await client.db.has(metadata.id.split("@")[0] + ".chat", "grup")
  if(!chat) {
    await client.db.set(metadata.id.split("@")[0] + ".chat", false, "grup")
    return false
  }
  return chat
};

export default {
  name: "messages.upsert",
  code: async ({ messages }) => {
    try {
      const client = global.client;
      const m = await Serialize(client, messages[0], global.store);
      const Commands = await loadCommands("./../../commands/basic/");
      const Plugins = await loadPlugins("./../../plugins");
      const sortedPlugins = [...Plugins.values()].sort((a, b) => a.name.localeCompare(b.name));

      if (!isLoaded) {
        await client.db.set("metadata", await client.groups(), "groups");
        isLoaded = true;
      }

      if (!m) return;

      const {
        from, isGroup, sender, userId, quotedUserId, remote, pushName, args,
        text, body, mentions, mimetype, isQuoted, isMedia, isBaileys, fromMe, isOwner, isModerator
      } = getMessageProperties(m);
      
      await setupUserDatabase(client, sender);
      let isFollowedChannel = await client.db.get(sender.split("@")[0] + ".isFollowedChannel", "user") || false;
      let isPremium = await checkPremiumStatus(client, sender, Date.now());
      let isBanned = await checkBannedStatus(client, sender, Date.now());
      /*
      /if(/\bverif(?:y|ikasi)?\b/.test("." + m?.command)) {
        if(isFollowedChannel) return;
        await client.readMessages([m.key])
        await m.react("⏱️")
        await m.reply(`Terimakasih sudah mengikuti saluran amira, sekarang kakak sudah bisa akses fitur amira, semoga amira chatbot dapat membantu dan bermanfaat untuk kakak ${facemoji.joy}`, messageStyle);
        return await client.db.set(sender.split("@")[0] + ".isFollowedChannel", true, "user");
      }
      */

      const {
        groups, metadata, participants, participantIds, groupAdmins,
        groupSuperAdmin, isAdmin, isSuperAdmin, isBotAdmin
      } = await getGroupProperties(client, isGroup, from, sender);

      const prefix = m?.prefix.length > 0 ? m?.prefix : ".";
      const commandName = m?.command;
      const command = Array.from(Commands.values()).find((d) => d?.command?.find((x) => x.toLowerCase() === commandName)) || null;
      const commandOptions = command?.options;
      const isCommand = commandOptions?.nonPrefix ? (body.startsWith(`${prefix}${commandName}`) || commandOptions?.nonPrefix) : body.startsWith(`${prefix}${commandName}`);
      const plugins = { ...sortedPlugins.reduce((acc, v) => ({ ...acc, [v.name]: v.code }), {}) };
      const alertMessage = global.alertMessage;
      const { public: isPublic } = await client.knex("config").first()
      
      if (!isCommand || !command) return;
      if(!isGroup && !isPublic && !isOwner) return /* m.reply(`Maaf kak, saat ini amira hanya akan merespon di grup saja ${global.facemoji.sad}\n` +
        `\n` +
        `silahkan join grup official amira untuk menggunakan amira, terimakasih\n` +
        `\n` +
        `https://chat.whatsapp.com/C7WMDga4RIF21hj2BSzg1c\n` +
        `https://chat.whatsapp.com/C7WMDga4RIF21hj2BSzg1c\n` +
        `https://chat.whatsapp.com/C7WMDga4RIF21hj2BSzg1c`
      , messageStyle); */
      
      if (isGroup) {
        if(await client.knex.isAvailable({ sewa_id: remote }, "sewa")) if(await checkSewaStatus(client, remote)) return;
        if(await checkChatStatus(client, metadata) && !isAdmin) return;
      }

      
      await client.readMessages([m.key]);
      if (commandOptions?.isOwner && !m?.isOwner) return false;
      if (commandOptions?.isModerator && !m?.isModerator) return m.reply(`${alertMessage["moderator"]}`, messageStyle);
      // if (!isFollowedChannel && !m?.fromMe && !m?.isOwner && !m?.isModerator) return m.reply(`${alertMessage["follow"]}`, messageStyle);
      if (commandOptions?.isBot && !m?.fromMe) return m.reply(`${alertMessage["bot"]}`, messageStyle);
      if (commandOptions?.isPrivate && m?.isGroup) return m.reply(`${alertMessage["private"]}`, messageStyle);
      if (commandOptions?.isGroup && !m?.isGroup) return m.reply(`${alertMessage["group"]}`, messageStyle);
      if (commandOptions?.isBotAdmin && !isBotAdmin) return m?.isGroup ? m.reply(`${alertMessage["botAdmin"]}`, messageStyle) : m.reply(`${alertMessage["group"]}`, messageStyle);
      if (commandOptions?.isAdmin && !isAdmin) return m?.isGroup ? m.reply(`${alertMessage["admin"]}`, messageStyle) : m.reply(`${alertMessage["group"]}`, messageStyle);
      if (commandOptions?.isPremium && !isPremium && !isOwner) return m.reply(`${alertMessage["premium"]}`, messageStyle);
      if (command?.disable?.status) return m.reply(`${command?.disable?.message}`, messageStyle);
      if(isBanned && !isOwner && !isModerator) return m.reply(`${alertMessage["banned"].replace("{duration}", Func.parseUnix((await client.knex("users").where({ user_id: sender }).select("banned_duration").first()).banned_duration))}`, messageStyle);
  
      if (command?.cooldown?.status && !isOwner) {
        const cooldown = new Cooldown(m, command?.cooldown?.duration);
        if (cooldown.onCooldown) return m.reply(`${command?.cooldown?.message.replace("{time}", cooldown.timeFormatted)}`, messageStyle);
      }

      const options = {
        client,
        Commands,
        Plugins,
        ...Plugins,
        rawMessage: messages,
        m,
        quoted: m?.isQuoted ? m?.quoted : m,
        args,
        text,
        body,
        mentions,
        mimetype,
        isQuoted,
        isMedia,
        isBaileys,
        from,
        sender,
        userId,
        quotedUserId,
        remote,
        pushName,
        isPremium,
        isGroup,
        groups,
        metadata,
        participants,
        participantIds,
        groupAdmins,
        groupSuperAdmin,
        isAdmin,
        isSuperAdmin,
        isBotAdmin,
        prefix,
        commandName,
        command,
        commandOptions,
        isCommand,
        plugins,
        alertMessage,
        facemoji: global.facemoji,
        logs: global.logs,
        Func,
        ...Func,
        dirname,
        filename,
        upperFirst: (q) => lodash.upperFirst(q),
        hint,
        MessageCollector,
        MessageBuilder,
        VCardBuilder,
        Uploader,
        path,
        fs,
        axios: Func.axios,
        isPublic
      };

      try {
        const priority = getQueuePriority(m);
        const requestState = (isOwner || isModerator || isPremium) || (m.command === "menu")
        requestState ?
          null//await m.reply(`Mohon tunggu sebentar...`)
        :
          null//await m.reply(`Mohon tunggu sebentar, permintaan sedang dalam antrian...\n\n*Antrian:*\n> *Berjalan:* ${queue.pending}\n> *Menunggu:* ${queue.size}`, messageStyle);
        requestState ?
          await command.code(options)
        :
          await queue.add(async() => {
            await m.reply(`Memulai proses permintaan...`, messageStyle)
            await command.code(options)
          }, { priority })
      } catch (e) {
        global.logs.error(import.meta.url, e);
      }
    } catch (e) {
      global.logs.error(import.meta.url, e);
    }
  }
};