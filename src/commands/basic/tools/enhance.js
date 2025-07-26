export default [{
  tag: "tools",
  name: "enhance",
  command: ["enhance", "hd", "upscale"],
  options: {
    isPremium: false
  },
  cooldown: {
    status: true,
    duration: 10000
  },
  code: async({ client, m, remote, text, mimetype, quoted, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build();

      if (!/image\/(jpg|jpeg|png|webp)/.test(mimetype)) {
        return m.reply(`Tolong balas gambar yang ingin di tingkatkan kualitasnya kak ${facemoji.joy}\n` +
          `\n` +
          `*Argumen:*\n` +
          `1. --quality 16 (Opsi: 2, 4, 6, 8, 16)\n` +
          `2. --anime (Info: enhance anime art image)\n` +
          `\n` +
          `*Contoh:*\n` +
          `> .hd --q 16\n` +
          `> .hd --q 8 --anime`
        , message);
      }

      const qualityMatch = text.match(/--(q|quality) (\d+)/);
      const quality = qualityMatch ? qualityMatch[2] : "2";
      if (!/(2|4|6|8|16)/.test(quality)) {
        return m.reply(`Maaf kak, pilihan kualitas nya salah, silahkan cek argumen di command nya ya kak ${facemoji.joy}`, message);
      }

      const isAnime = /--anime/.test(text);

      const buffer = await quoted.download();
      if (buffer.length <= 1024) {
        return m.reply(`Gambar tersebut tidak valid kak ${facemoji.sigh}`, message);
      }

      const image = await plugins.enhance(buffer, quality.toString(), isAnime);
      if (!image.success) {
        return m.reply(`Maaf kak, proses peningkatan kualitas gambarnya gagal ${facemoji.sad}`, message);
      }

      client.sendMedia(remote, image.result, m, { mimetype: "image/png", caption: `Ini gambarnya kak ${facemoji.happy}`, ...message });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}, {
  tag: "tools",
  name: "hdr",
  command: ["hdr", "hdrestore"],
  options: {
    isPremium: false
  },
  cooldown: {
    status: true,
    duration: 10000
  },
  code: async({ client, m, remote, text, mimetype, quoted, plugins, MessageBuilder, facemoji, logs, alertMessage }) => {
    try {
      const message = new MessageBuilder()
        .setStyle(2)
        .build();
      
      if (!/image\/(jpg|jpeg|png|webp)/.test(mimetype)) {
        return m.reply(`Tolong balas gambar yang di tingkatkan kualitasnya kak ${facemoji.joy}`, message);
      }

      const buffer = await quoted.download();
      if (buffer.length <= 1024) {
        return m.reply(`Gambar tersebut tidak valid kak ${facemoji.sigh}`, message);
      }

      const image = await plugins.upscaleRestoration(buffer);
      if (!image.status) {
        return m.reply(`Maaf kak, proses peningkatan kualitas dan restorasi gambarnya gagal ${facemoji.sad}`, message);
      }

      client.sendMedia(remote, image.image, m, { mimetype: "image/png", caption: `Ini gambarnya kak ${facemoji.happy}`, ...message });
    } catch (e) {
      m.reply(alertMessage["error"]);
      return logs.commandError(import.meta.url, m, e);
    }
  }
}];