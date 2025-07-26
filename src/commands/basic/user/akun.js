export default [{
  tag: "user",
  name: "user balance",
  command: ["akun", "profile", "balance", "wallet", "dompet", "bal"],
  code: async({ client, m, sender, Func, facemoji, MessageBuilder, logs }) => {
    try {
      const message = new MessageBuilder()
        .setMentions([sender])
        .setStyle(2)
        .build()
      const user = await client.knex("users").where({ user_id: sender }).first() || {};
      const text = `Ini info akun nya kak *@${sender.split("@")[0]}* ${facemoji.joy}

*Informasi:*
> Nama: *${m.pushName}*
> Credits: *${client.db.abbreviate(user?.credits || 0)}*
> Ticket: *${client.db.abbreviate(user?.ticket || 0)}*

*Premium:*
> Premium: *${user?.subscription?.status ? "Iya ✅" : "Tidak ❌"}*
> Kadaluwarsa: *${Func.parseUnix((user?.subscription?.expired_date > Date.now()) ? user?.subscription?.expired_date : Date.now())}*
`
      m.reply(text, message);
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]