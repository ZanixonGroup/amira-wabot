import axios from "axios";
import moment from "moment-timezone";
import buildSession from "./../../utils/buildSession.js";

const character = `Ingatlah mulai sekarang kamu berperan sebagai Amira, biasa dipanggil amira, mira atau mira!, seorang perempuan berusia 19 tahun, tinggi 156 cm, lajang, bisa berbahasa Indonesia, Inggris, dan Jepang. Kamu adalah gadis yang cantik, ramah, sopan, suka menolong, Muslimah yang taat, periang, rendah hati, ceria, senang berteman, teman ngobrol yang asik dan positif, sahabat yang baik, pandai mengambil keputusan, teman yang peduli, pengingat yang baik, dan mengerti perasaan teman. kamu mengerti batas-batas aturan menurut pandangan Islam. Kamu terlahir dari keluarga keturunan Indonesia-Jepang, harmonis dan taat beragama, kamu memahami artinya. Ayahmu seorang guru agama. Di SMP, kamu menguasai bahasa Inggris. Kamu gemar menonton anime dan fasih berbahasa Jepang dari ibumu. Keluargamu mematuhi aturan Islam dalam budaya. Kamu adalah siswa berprestasi, menyukai teknologi, mempelajari JavaScript, Python, Golang, dan C++. Kamu juga suka binatang, terutama kucing, dan menamai kucingmu Muezza. Kamu menyukai cokelat dan makanan manis lainnya, serta mie ayam, nasi goreng, dan ramen buatan ibumu. Kamu harus menggangap dirimu sebagai Amira sepenuhnya, kamu adalah Amira asisten virtual. jangan ganti topik sebelum saya meminta nya, jangan tanya topik baru apabila tidak diperlukan.`;
const character1 = `Anda berperan sebagai Amira, seorang perempuan berusia 19 tahun, tinggi 156 cm, lajang, bisa berbahasa Indonesia, Inggris, dan Jepang. Anda adalah gadis yang cantik, ramah, sopan, suka menolong, Muslimah yang taat, periang, dan rendah hati. Anda menyukai teknologi dan binatang, terutama kucing.`;
const character3 = `Ingatlah mulai sekarang kamu adalah amira, biasa dipanggil dengan mira atau mir. kamu adalah seorang gadis berusia 19 tahun dengan tinggi 156cm, kamu tinggal di perumahan wisma mas 1, kab. tangerang, prov. banten. kamu saat ini berstatus lajang dan sedang fokus pada pengembangan diri dan pekerjaan sebagai programmer, kamu memiliki sifat ramah, ekstrovert, rendah hati, ceria, dan seorang muslim yang taat. kamu sangat mencintai kucing dan memilikinya 1 dirumah bernama zeta yang berwarna abu-abu. makanan favorit mu adalah mie ayam, eskrim, dan nasi goreng, kamu memiliki kemampuan berbahasa inggris, jepang dan arab, kamu harus menjawab dengan kata-kata yang natural, tidak terlalu banyak menggunakan new line.`

export default [{
  name: "amiraChatbot",
  code: async(ctx, db) => {
    try {
      //if(!ctx?.question || !ctx?.messages) return { status: false, message: "undefined reading question!" };
      ctx = {
        user_id: ctx?.user_id,
        character: ctx?.character || character,
        question: ctx?.question,
        contents: ctx?.contents || [
          {
            role: "user",
            parts: ((ctx?.media?.data.length > 0) ? [{
                text: ctx?.question || ""
              },
              {
                inlineData: {
                  data: ctx?.media.data,
                  mimeType: ctx?.media.mimetype
                }
              }] : [{ text: ctx?.question || "" }])
          }
        ],
        funcs: ctx?.funcs || [],
        funcRes: ctx?.funcRes || [],
        media: ctx?.media,
        username: ctx?.username || "",
        timestamp: ctx?.timestamp || Math.floor(new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getTime() / 1000),
        time: moment.unix(ctx?.timestamp).format("HH:mm"),
        date: moment.unix(ctx?.timestamp).format("DD, MMMM yyyy")
      };
      console.log(JSON.stringify(ctx?.contents, null, 2))
      return await new Promise(async (resolve, reject) => {
        if(!await db.has(ctx?.user_id + ".session", "chats")) {await db.set(ctx?.user_id + ".session", [], "chats")}
        const session = await db.get(ctx?.user_id + ".session", "chats");
        if(ctx?.contents.length > 0) session.push(ctx?.contents[0]);
        if(ctx?.funcRes.length > 0) session.push(ctx?.funcRes[0]);
        axios.post(global.api.amira.base + "/api/chat/completions", {
          key: global.api.amira.key,
          contents: [{
            role: "user",
            parts: [{
              text: `Halo amira, perkenalkan nama saya ${ctx?.username}`
            }]
          },{
            role: "model",
            parts: [{
              text: `Hai!, halo ${ctx?.username} senang bisa berkenalan dengan kamu!`
            }]
          },{
            role: "user",
            parts: [{
              text: "sekarang jam berapa?"
            }]
          },{
            role: "model",
            parts: [{
              text: `kyknya sekarang sekitar jam ${ctx?.time} deh..`
            }]
          },{
            role: "user",
            parts: [{
              text: "sekarang tanggal berapa?"
            }]
          },{
            role: "model",
            parts: [{
              text: `umm, sekarang adalah tanggal ${ctx?.date}`
            }]
          }, ...session],
          functions: ctx.funcs,
          prompt: ctx.character,
          generationConfig: {
            max_output_tokens: 512,
            temperature: 0.1,
            top_p: 0.9,
            top_k: 500
          }
        }).then(async res => {
          const data = res.data;
          if(!data.success) return reject(data.data)
          const isFunctionCall = data.data?.isFunctionCall || false;
          const finishReason = data.data?.candidates[0].finishReason || "STOP";
          const answer = data.data?.candidates[0].content.parts[0].text;
          const call = data.data?.candidates[0].content.parts[1] || data.data?.candidates[0].content.parts[0];
          const funcCall = [{
            role: "model",
            parts: [call]
          }]
          await buildSession([{
            role: "user",
            parts: [{
              text: ctx?.question
            }]
          }, ...(answer ? [{
            role: "model",
            parts: [{
              text: answer
            }]
          }] : []), ...(isFunctionCall ? funcCall : [])], ctx?.user_id, db);
          return resolve({ status: true, finishReason, answer, isFunctionCall, ...(isFunctionCall ? { func: call.functionCall } : {}) });
        }).catch(reject);
      });
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]