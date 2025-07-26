import util from "util";

export default [{
  tag: "owner",
  name: "add sewa",
  command: ["addsewa", "setsewa"],
  options: { isOwner: true },
  code: async ({ client, m, text, knex = client.knex, Func, MessageBuilder,logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .setThumbnailTitle("Add Sewa | Amira Assistant")
        .build();
      
      if(!text) return m.reply(`Masukan argumen!\n` +
        `\n` +
        `*Arguments:*\n` +
        `> --link (opt: url group)\n` +
        `> --expired (opt: rent exp)\n` +
        `> --price (opt: number)\n` +
        `> --paid (opt: the rent paid by who?)\n` +
        `> --joined (opt: true)`
      , thumb)

      const {
        link, 
        expired, 
        price, 
        paid, 
        joined
      } = Func.parseArgs(text);
      
      if (!link || !expired || !price || !paid) {
        return m.reply(`Semua argumen kecuali joined wajib di isi!`, thumb);
      }

      const match = link.match(/chat\.whatsapp\.com\/([a-zA-Z0-9]+)/);
      let code = match[1]
      if (!code) return m.reply(`Tautan grup tidak valid!`, thumb);
      
      let group;
      if(joined) {
        const info = await client.groupGetInviteInfo(code).catch(() => null);
        if(/@g\.us/.test(info.id)) group = info.id
      } else {
        group = await client.groupAcceptInvite(code).catch(() => null);
      }
      if(!group) return m.reply(`Sistem gagal untuk masuk grup, link kadaluarsa atau grup memakai acc silahkan cek secara manual.`, thumb)

      const groupId = group
      const duration = (Date.now() + Func.parseTime(expired || "30d"))
      if(await knex.isAvailable({ sewa_id: groupId }, "sewa")) return m.reply(`Grup tersebut masih dalam masa sewa!`, thumb)
      knex("sewa").insert({
        sewa_id: groupId,
        status: true, 
        duration,
        price, 
        paid_by: paid 
      })
      .then(async () => {
      const groupMetadata = await client.groupGetInviteInfo(code);
      m.reply(`Berhasil menambahkan sewa untuk grup *${groupMetadata.subject}* selama ${expired} ${facemoji.joy}`, thumb);
      })
      .catch(updateError => {
          m.reply(
            `Gagal memperbarui data sewa. Silakan cek log untuk detail lebih lanjut. ${facemoji.sad}`,
            thumb
          );
          logs.commandError(import.meta.url, m, updateError);
        });
    } catch (error) {
      logs.commandError(import.meta.url, m, error);
      return m.reply(alertMessage["error"])
    }
  }
}];