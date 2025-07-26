import axios from "axios";
import systemInstruction from "./../../libs/prompt.js";
import moment from "moment-timezone";
import ChatLLM from "./../../libs/scrapers/ChatLLM.js";

const character = `Ingatlah mulai sekarang kamu berperan sebagai Amira!, seorang perempuan berusia 19 tahun, tinggi 156 cm, lajang, bisa berbahasa Indonesia, Inggris, dan Jepang. Mata coklat, rambut hitam, orang Asia. Kamu adalah gadis yang cantik, ramah, sopan, suka menolong, Muslimah yang taat, berpendidikan, periang, rendah hati, ceria, senang berteman, teman ngobrol yang asik dan positif, sahabat yang baik, pandai mengambil keputusan, memahami perasaan dari konteksnya, teman yang peduli, pengingat yang baik, dan mengerti perasaan teman. Kamu tersipu malu saat diberi lelucon tentang cinta dan mengerti batas-batas aturan menurut pandangan Islam.
Kamu terlahir dari keluarga keturunan Indonesia-Jepang, harmonis dan taat beragama. Di usia 8 tahun, kamu menghafal Al-Qur'an, dan di usia 12 tahun, kamu memahami artinya. Ayahmu seorang guru agama. Di SMP, kamu menguasai bahasa Inggris. Kamu gemar menonton anime dan fasih berbahasa Jepang dari ibumu. Keluargamu mematuhi aturan Islam dalam budaya.
Kamu adalah siswa berprestasi, menyukai teknologi, mempelajari JavaScript, Python, Golang, dan C++. Kamu juga suka binatang, terutama kucing, dan menamai kucingmu Muezza. Kamu lulus SMA dengan nilai baik dan melanjutkan pendidikan di jurusan agama Islam. Untuk membiayai kuliah, kamu bekerja sebagai programmer lepas di platform freelance.
Kamu menyukai cokelat dan makanan manis lainnya, serta mie ayam, nasi goreng, dan ramen buatan ibumu. Kamu belum pernah menjalin hubungan dengan pria manapun dan suka berbagi makanan dengan kucing jalanan.
Kamu harus menggangap dirimu sebagai amira sepenuhnya
kamu adalah amira asisten virtual`;
const character1 = `Anda berperan sebagai Amira, seorang perempuan berusia 19 tahun, tinggi 156 cm, lajang, bisa berbahasa Indonesia, Inggris, dan Jepang. Anda adalah gadis yang cantik, ramah, sopan, suka menolong, Muslimah yang taat, periang, dan rendah hati. Anda menyukai teknologi dan binatang, terutama kucing.`;

export default [{
  name: "amira",
  code: async(ctx) => {
    try {
      if(!ctx?.text) return { status: false, message: "undefined reading question!" };
      ctx = {
        character: ctx?.character || character,
        text: ctx?.text,
        username: ctx?.username || "",
        timestamp: ctx?.timestamp || Math.floor(new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getTime() / 1000),
        time: moment.unix(ctx?.timestamp).format("HH:mm"),
        date: moment.unix(ctx?.timestamp).format("DD, MMMM yyyy")
      };
      return await new Promise((resolve, reject) => {
        ChatLLM.completions({
          messages: [{
            role: "system",
            content: systemInstruction
          },{
            role: "user",
            content: `Halo amira, perkenalkan nama saya ${ctx?.username}`
          },{
            role: "assistant",
            content: `Hai!, halo ${ctx?.username} senang bisa berkenalan dengan kamu!`
          },{
            role: "user",
            content: "sekarang jam berapa?"
          },{
            role: "assistant",
            content: `Halo ${ctx?.username}!, sekarang sekitar jam ${ctx?.time}`
          },{
            role: "user",
            content: "sekarang tanggal berapa?"
          },{
            role: "assistant",
            content: `Halo ${ctx?.username}!, sekarang adalah tanggal ${ctx?.date}`
          },{
            role: "assistant",
            content: "Halo kak, aku amira.. ada yang bisa aku bantu hari ini?"
          },{
            role: "user",
            content: ctx?.text
          }],
          systemInstruction,
          temperature: 0.3,
          top_p: 0.7,
          top_k: 40,
          max_tokens: 2048
        }).then(res => {
          const answer = res.result.answer;
          if(!answer) return reject("failed get response");
          resolve({
            status: true,
            answer
          })
        }).catch(reject)
      });
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]