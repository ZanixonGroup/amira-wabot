export default [{
  tag: "games",
  name: "family100",
  command: ["family100"],
  code: async({ client, m, remote, sender, isCommand, fs, dirname, path, MessageCollector, MessageBuilder, facemoji, hint }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build();

      let games = JSON.parse(await fs.readFileSync(path.join(dirname(import.meta.url), "../../../../assets/games/family100.json"), "utf8"));
      let game = games[Math.floor(Math.random() * games.length)];

      let foundAnswers = [];
      let totalAnswers = game.jawaban.length;

      await m.reply(`*_${game.soal}_*

*Detail:*
> Hint: *Ketik .hint untuk membuka petunjuk, biaya 1 ticket!*
> Reward: *1 Ticket per jawaban benar*
> Waktu habis: *120 detik*
> Menyerah: *ketik .nyerah untuk mengakhiri game*

*Keterangan:*
> Jawab pertanyaan di atas dengan benar. Kamu dapat memberikan beberapa jawaban dalam sesi ini!`, message);

      const col = new MessageCollector(m, {
        timeout: 120000
      });

      let currentHint = game.jawaban.map(() => "_");

      col.on("collect", async(msg) => {
        var user = await client.knex("users").where({ user_id: sender }).first() || {},
        ticket = parseInt(user?.ticket);

        // Exit session
        if(new RegExp(".nyerah", "gmi").test(msg.body)) {
          col.collected();
          return m.reply(`Kamu telah menyerah pada game ini. Sesi telah berakhir, dan kamu bisa memulai game baru lagi ${facemoji.joy}`, message);
        }

        // Hint session
        if(new RegExp(".hint", "gmi").test(msg.body)) {
          if(ticket < 1) return m.reply(`Maaf kak, ticket yang kakak miliki hanya ada *${ticket}*, jadi tidak cukup untuk membuka hint ${facemoji.sad}`, message);
          if(!currentHint.includes("_")) return m.reply(`Maaf kak, semua jawaban sudah terbuka ${facemoji.sigh}`, message);
          currentHint = hint(game.jawaban.join(" "), currentHint);
          await client.knex("users").where({ user_id: sender }).update("ticket", Math.floor(ticket - 1));
          await m.reply(`*_${game.soal}_*

*Detail:*
> Hint: \`${currentHint.join(" ")}\`
> Reward: *1 Ticket per jawaban benar*
> Waktu habis: *120 detik*

*Keterangan:*
> Jawab pertanyaan di atas dengan benar. Kamu dapat memberikan beberapa jawaban dalam sesi ini!`, message);
          return;
        }

        const userAnswer = msg.body.toLowerCase();

        // Check if the answer is correct and not already found
        if(game.jawaban.includes(userAnswer) && !foundAnswers.includes(userAnswer)) {
          foundAnswers.push(userAnswer);
          await client.knex("users").where({ user_id: sender }).update("ticket", Math.floor(ticket + 1));
          await m.reply(`Jawaban *${userAnswer}* benar! ${facemoji.happy}

*Progress:*
> Jawaban ditemukan: *${foundAnswers.length}/${totalAnswers}*`, message);

          // Check if all answers are found
          if(foundAnswers.length === totalAnswers) {
            col.collected();
            return m.reply(`Selamat kak! Kamu telah menemukan semua jawaban! ${facemoji.happy}

*Jawaban:*
> ${game.jawaban.join(", ")}

*Reward berhasil ditambahkan ke akun kakak!*`, message);
          }
        } else {
          if(msg.body.startsWith(`.`)) return;
          await m.reply(`Jawaban *${userAnswer}* salah atau sudah ditemukan, coba lagi ya kak ${facemoji.joy}`, message);
        }
      });

      col.on("end", async({ status }) => {
        if(status === "collected") return;
        await m.reply(`Maaf kak, waktu game sudah habis. Berikut jawaban yang benar:

*Jawaban:*
> ${game.jawaban.join(", ")} ${facemoji.sad}`);
      });
    } catch (e) {
      m.reply("Terjadi kesalahan, coba lagi nanti.");
      return logs.commandError(import.meta.url, m, e);
    }
  }
}]
