import colors from "colors";
import moment from "moment-timezone";
import { format } from "util";
import { fileURLToPath } from 'url';
import { dirname, filename } from "desm";

// important
global.dirname = (path) => { return dirname(path) };
global.filename = (path) => { return filename(path) };

// main configs
global.botNumber = "6285888213719";
global.bot = {
  public: true,
  antiCall: true,
  owner: ["6285697103902", "6289520306297", "6285888213719"],
  moderator: ["6285697103902", "6289520306297", "6285647936393", "62895334731266", "6281387562900", "6281212035575", "6281804205438"],
  sessionName: "session",
  prefix: /^[.]/i
}
Object.defineProperty(global, 'clock', {
  get: function() {
    return moment(Date.now()).tz("Asia/Jakarta").format("DD-MM-YY HH:mm:ss");
  },
  enumerable: true,
  configurable: true
});

global.variables = {
  user: {
    premium: false
  }
}

global.api = {
  amira: {
    base: "https://amira-ai.zanixon.xyz",
    key: "@ZNgroup22"
  },
  zxn: {
    base: "https://api.zanixon.my.id",
    key: "zanixon22"
  },
  samir: {
    base: "https://www.samirxpikachu.run.place"
  }
}

// beautify logs
colors.setTheme({
   main: ['brightBlue', 'bold'],
   plain: "brightGrey",
   info: "brightGreen",
   warn: "brightYellow",
   danger: "brightRed"
});

// sticker exif
global.exif = {
  packId: "https://github.com/ZanixonGroup",
  packName: `s.id/amirabot`,
  packPublish: "© Amira-MD",
  packEmail: "zanixon.group@gmail.com",
  packWebsite: "https://github.com/ZanixonGroup",
  androidApp: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
  iOSApp: "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
  emojis: [],
  isAvatar: 0,
}

global.facemoji = {
  greet: `⸜(｡˃ ᵕ ˂ )⸝♡`,
  bye: `(ฅ^•ﻌ•^ฅ)`,
  thanks: `(づ๑•ᴗ•๑)づ♡`,
  fun: `ヾ( ˃ᴗ˂ )◞ • *✰`,
  happy: `⸜(｡˃ ᵕ ˂ )⸝♡`,
  joy: `(˶ᵔ ᵕ ᵔ˶)`,
  sad: `(｡•́︿•̀｡)`,
  cry: `(⁠╥⁠﹏⁠╥⁠)`,
  angry: `( ｡ •̀ ᴖ •́ ｡)`,
  shy: `(,,>﹏<,,)`,
  tired: `( ꩜ ᯅ ꩜;)⁭ ⁭`,
  lose: `( „ •\` ◠ \´• „ )`,
  confused: `(ó﹏ò｡)`,
  sigh: `(ᵕ—ᴗ—)`,
  laugh: `(๑˃́ꇴ˂̀๑)`
}

// alert messages
global.alertMessage = {
  owner: `Maaf kak, fitur ini khusus untuk pengembang amira saja ${global.facemoji.sad}`,
  moderator: `Maaf kak, fitur ini khusus untuk moderator amira saja ${global.facemoji.sad}`,
  group: `Maaf kak, fitur ini hanya untuk di grup saja ${global.facemoji.sad}`,
  private: `Maaf kak, fitur ini hanya untuk di chat pribadi saja ${global.facemoji.sad}`,
  admin: `Maaf kak, fitur ini hanya untuk admin di grup saja ${global.facemoji.sad}`,
  botAdmin: `Maaf kak, amira bukan admin jadi tidak bisa pakai fitur ini ${global.facemoji.sad}`,
  bot: `Maaf kak, fitur ini khusus untuk amira saja ${global.facemoji.sad}`,
  media: `Tolong balas pesan media nya kak ${global.facemoji.joy}`,
  query: `Maaf, kakak mau cari apa? amira bingung sama apa yang kakak cari ${global.facemoji.sad}`,
  error: `Maaf kak, sistem amira terjadi masalah saat memproses permintaan kakak ${global.facemoji.cry}`,
  quoted: `Tolong balas pesan nya kak ${global.facemoji.joy}`,
  wait: `Tunggu sebentar ya kak... ${global.facemoji.joy}`,
  urlInvalid: `Maaf kak, url atau link tidak valid ${global.facemoji.sad}`,
  premium: `Maaf kak, fitur ini khusus pengguna premium ${global.facemoji.sad}`,
  banned: `Maaf kak, akun kakak telah dibanned oleh moderator kami selama *{duration}*, jika ingin membuka kembali akses, silahkan melakukan laporan ke admin kami. terimakasih ${global.facemoji.joy}\n\n*Kontak kami:*\n- Admin: wa.me/6285697103902\n- Email: zanixkn.group@gmail.com`,
  follow: `Maaf kak, sebelum menggunakan amira chatbot. silahkan kakak follow channel amira terlebih dulu, terimakasih. ${global.facemoji.joy}

*Syarat*
- *Follow:* https://whatsapp.com/channel/0029VaFOXjs7tkj2OGoypH1V
- *Verifikasi:* ketik .verif setelahh follow, kamu akan terverifikasi setelah itu.`
}

global.logs = {
  error: (path, logs) => {
    if(!logs) return;
    console.log(global.clock.info, "[ERROR]".danger, `location: ${filename(path)}`.warn,
    "\n" + format(logs).danger);
  },
  warn: (path, logs) => {
    if(!logs) return;
    console.log(global.clock.info, "[WARN]".warn, `location: ${filename(path)}`.warn,
    "\n" + format(logs).warn);
  },
  commandError: (path, m = {}, logs) => {
    if(!logs) return;
    console.log(global.clock.info, "[COMMAND ERROR]".danger, `location: ${filename(path)}`.warn,
    "\n" + "Sender: ".info + m?.sender,
    "\n" + "Command: ".info + m?.command,
    "\n" + "Body: ".info + m?.body,
    "\n" + "Logs: ".info + format(logs).danger);
  },
  
}
