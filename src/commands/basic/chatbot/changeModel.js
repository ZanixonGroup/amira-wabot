export default [{
  tag: "AI Chatbot",
  name: "change model",
  disable: {
    status: true,
    message: "pergantian model chatbot sudah tidak di fungsikan lagi."
  },
  command: ["changemodel", "gantimodel"],
  code: async({ client, remote, m, sender, text, MessageBuilder, MessageCollector, facemoji, logs, alertMessage }) => {
    try {
      const thumb = new MessageBuilder()
        .setStyle(2)
        .build();
      
      await m.reply(`Silahkan pilih model LLM yang ingin kakak pakai!\n` +
        `\n` +
        `*Model:*\n` +
        `1. Llama 3.1 405B\n` +
        `2. Llama 3.1 70B\n` +
        `3. Euryale 70B *(UNCENSORED)*\n` +
        `4. Dolphin Llama 3 70B\n` +
        `5. WizardLM 2 8x22B\n` +
        `\n` +
        `*Note:*\n` +
        `> Balas pesan dengan angka urutan model, model AI yang tersedia hanya yang ditampilkan saja. harap gunakan model dengan bijak!`
      ,thumb)
      
      const col = new MessageCollector(m, {
        timeout: 60 * 1000
      });
      
      col.on("collect", async(ctx) => {
        const selected = parseInt(ctx.body);
        if(!selected) return m.reply(`Maaf kak, pilihan tersebut tidak valid ${facemoji.sad}`, thumb);
        if(selected >= 6) return m.reply(`Maaf kak, model pada urutan tersebut tidak ada ${facemoji.sad}`, thumb);
        const model = await client.chatbot.changeModel(sender.split("@")[0], selected - 1);
        console.log(model)
        if(!model.success) return m.reply(`Maaf kak, sistem amira mengalami kesalahan saat mengganti model  ${facemoji.sad}`, thumb);
        m.reply(`Berhasil mengubah model chatbot ke model *${model.model}* ${facemoji.joy}`, thumb)
        col.collected()
      });
      
      col.on("end", async({ status }) => {
        if(status === "collected") return;
        await m.reply(`Maaf kak, pemilihan model nya amira akhiri ya karna waktu nya sudah habis ${facemoji.sad}`)
      })
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e)
    }
  }
}]