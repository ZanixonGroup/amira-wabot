export default [{
  tag: "group",
  name: "linkgroup",
  command: ["linkgroup"],
  options: {
    isAdmin: true,
    isBotAdmin: true,
    isGroup: true
  },
  code: async({ client, m, remote, MessageBuilder }) => {
    let message = new MessageBuilder()
    .setStyle(2)
    .setText(`Ini linknya kak https://chat.whatsapp.com/${await client.groupInviteCode(remote)}`)
    .build()
    
    client.sendMessage(remote, message, { quoted: m })
  }
}]