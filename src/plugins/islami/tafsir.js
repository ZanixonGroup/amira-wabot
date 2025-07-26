import axios from "axios";

const equran = axios.create({
  baseURL: "https://equran.id/api/v2",
  timeout: 60 * 1000
})

export default [{
  name: "quran_tafsir",
  code: async(surah) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!surah) return reject("berikan nomor surah yang ingin ditafsir");
        if(!Number.isInteger(surah)) return reject("nomor surah yang diberikan tidak valid!");
        equran.get("/tafsir/" + surah).then(res => {
          const data = res.data;
          if(data.code !== 200) return reject(data.message);
          resolve({
            status: true, 
            data: data.data
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
},{
  name: "quran_surah",
  code: async(surah) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!surah) return reject("berikan nomor surah yang ingin dilihat");
        if(!Number.isInteger(surah)) return reject("nomor surah yang diberikan tidak valid!");
        equran.get("/surat/" + surah).then(res => {
          const data = res.data;
          if(data.code !== 200) return reject(data.message);
          resolve({
            status: true, 
            data: data.data
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
},{
  name: "quran_listsurah",
  code: async() => {
    try {
      return await new Promise((resolve, reject) => {
        equran.get("/surat/").then(res => {
          const data = res.data;
          if(data.code !== 200) return reject(data.message);
          resolve({
            status: true, 
            data: data.data
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