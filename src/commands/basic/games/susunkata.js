export default [{
  tag: "games",
  name: "susun kata",
  command: ["susunkata"],
  code: async({ client, m, remote, sender, isCommand, fs, dirname, path, MessageCollector, MessageBuilder, facemoji, userId, hint }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build()
      
      let games = JSON.parse(await fs.readFileSync(path.join(dirname(import.meta.url), "../../../../assets/games/susunkata.json"), "utf8"));
      let game = games[Math.floor(Math.random() * games.length)];
      
      await m.reply(`*_"${game.soal}"_*

*Detail:*
> Hint: *Ketik .hint untuk membuka petunjuk, biaya 1 ticket!*
> Reward: *1 Ticket*
> Waktu habis: *60 detik*
> Menyerah: *ketik .nyerah untuk mengakhiri game*

*Keterangan:*
> Jawab pertanyaan diatas dengan benar, sebutkan saja jawabannya kak tidak perlu balas pesan karna amira akan otomatis merespon ya kak.`, message);
      const col = new MessageCollector(m, {
        timeout: 60000
      });
      
      let currentHint = ["_"];
      col.on("collect", async(msg) => {
        var user = await client.knex("users").where({ user_id: sender }).first() || {},
        ticket = parseInt(user?.ticket);
        const answer = game.jawaban.toLowerCase();
        
        // exit session
        if(new RegExp(".nyerah", "gmi").test(msg.body)) {
          col.collected();
          return m.reply(`Kamu telah menyerah pada game ini, sesi telah berakhir dan kamu bisa buat sesi game baru lagi ${facemoji.joy}`, message);
        }
        
        // hint session
        if(new RegExp(".hint", "gmi").test(msg.body)) {
          if(ticket < 1) return m.reply(`Maaf kak, ticket yg kakak miliki hanya ada *${ticket}* jadi tidak cukup untuk membuka hint ${facemoji.sad}`, message)
          if(!/_/.test(currentHint.join(''))) return m.reply(`Maaf kak, seluruh kata pada jawaban sudah terbuka dari hint ${facemoji.sigh}`, message);
          currentHint = hint(answer, currentHint);
          await client.knex("users").where({ user_id: sender }).update("ticket", Math.floor(ticket - 1));
          await m.reply(`*_"${game.soal}"_*

*Detail:*
> Hint: \`${currentHint.join('')}\`
> Reward: *1 Ticket*
> Waktu habis: *60 detik*

*Keterangan:*
> Jawab pertanyaan diatas dengan benar, sebutkan saja jawabannya kak tidak perlu balas pesan karna amira akan otomatis merespon ya kak.`, message);
          return;
        }
        
        // corrected!
        if(new RegExp(answer, "gmi").test(msg.body)) {
          await m.reply(`Selamat kak, Jawaban *${msg.body}* adalah benar ${facemoji.happy}

*Details:*
> Reward: *+1 Ticket*
> Jawaban: *${game.jawaban}*

> Reward berhasil ditambahkan ke akun kakak ${facemoji.happy}`, message);
          await client.knex("users").where({ user_id: sender }).update("ticket", Math.floor(ticket + 1));
          col.collected()
        } else {
          if(msg.body.startsWith(`.`)) return;
          await m.reply(`Jawabannya salah, dicoba lagi ya kak ${facemoji.joy}`, message);
        }
      });
      
      col.on("end", async({ status }) => {
        if(status === "collected") return;
        await m.reply(`Maaf kak, game nya amira akhiri ya karna waktu nya sudah habis ${facemoji.sad}`)
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]