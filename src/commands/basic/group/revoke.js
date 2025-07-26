export default [{
  tag: "group",
  name: "revoke",
  command: ["revoke", "renew"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ client, m, remote, MessageBuilder, alertMessage, logs, facemoji }) => {
    try {
    let revoke = await client.groupRevokeInvite(remote)
    let message = new MessageBuilder()
    .setStyle(2)
    .setText(`Sukses memperbarui link group kak ${facemoji.happy}\nIni link terbarunya kak https://chat.whatsapp.com/${await client.groupInviteCode(remote)}`)
    .build()
    
    client.sendMessage(remote, message, { quoted: m })
  } catch (e) {
    m.reply(alertMessage["error"])
    return logs.commandError(import.meta.url, m, e)
  }
  }
}]