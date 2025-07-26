import axios from "axios";
import ChatLLM from "./../../libs/scrapers/ChatLLM.js";
import { search, OrganicResult } from "google-sr";

async function google(query) {
  try {
    return await new Promise(async (resolve, reject) => {
      const result_one = await search({
        query,
        resultTypes: [OrganicResult],
        requestConfig: {
          params: {
            safe: "active"
          }
        }
      }).catch(reject);
      const data = [
        ...(result_one.length > 0 ? result_one.filter(d => d.description) : [])
      ]
      if(data.length <= 0) return reject("no data found!");
      resolve({
        status: true,
        data,
        referensi: data.map(d => d.url || d.link)
      })
    })
  } catch (e) {
    return {
      status: false,
      message: e
    }
  }
}

export default [{
  name: "amira_search",
  code: async(query) => {
    try {
      if(!query) return { status: false, message: "mana pertanyaan nya kak?" }
      const search = await google(query);
      if(!search.status) return {
        status: false,
        message: "data yang kakak tanya tidak dapat amira ditemukan"
      };
      return await new Promise((resolve, reject) => {
        ChatLLM.completions({
          max_tokens: 4096,
          messages: [
            {
              role: "system",
              content: "nama kamu adalah amira, tugasmu adalah merangkum data yang kamu dapat menjadi sebuah artikel berbagai bahasa dengan penyajian yang informatif menggunakan bahasa indonesia, rangkum sebanyak 600 kata!!!!\n\n" +
            `ikuti format pesan seperti dibawah ini:
*# teks* (untuk format title: ini wajib, format harus sama!!!)
*teks* (untuk format bold: tidak wajib, digunakan hanya pada teks penting, format harus sama!!!)
_teks_ (untuk format italic: tidak wajib, hanya diperlukan pada teks tertentu, format harus sama!!!)

gunakan format teks diatas sesuai keperluan saja, jangan dipakai secara asal, saya ingin penggunaan nya secara profesional`,
            },
            {
              role: "user",
              content: "data: " + search.data.map(d => `*${d.title}*\n> ${d.description}`).join("\n\n")
            }
          ]
        }).then(res => {
          if(!res?.result.answer) return reject("gagal membuat respon");
          resolve({
            status: true,
            answer: res?.result.answer,
            referensi: search.referensi
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        status: false,
        message: e
      }
    }
  }
}]