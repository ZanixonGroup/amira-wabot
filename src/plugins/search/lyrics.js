import axios from "axios";

const api = axios.create({
  baseURL: "https://lrclib.net/api",
  timeout: 60000,
  headers: {
    "Lrcpib-Client": "LRCLIB Web Client (https://github.com/tranxuanthang/lrclib)",
    "x-user-agent": "LRCLIB Web Client (https://github.com/tranxuanthang/lrclib)"
  }
})

export default [{
  name: "searchLyrics",
  code: async(query) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!query) return reject("missing query input!");
        api.get("/search?q=" + encodeURIComponent(query), {
        }).then(async res => {
          const data = res.data;
          if(!data.length) return reject("failed fetch content!");
          return resolve({
            status: true, 
            result: data.filter(d => !d.instrumental).map(d => ({
              id: d.id,
              title: d.name,
              artist: d.artistName,
              album: d.albumName,
            }))
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        status: false,
        errors: e
      }
    }
  }
}, {
  name: "getLyrics",
  code: async(id) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!id) return reject("missing id input!");
        api.get("/get/" + id).then(res => {
          const data = res.data;
          if(!data.plainLyrics) return reject("failed get lyrics info");
          return resolve({
            status: true,
            result: data
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        status: false,
        errors: e
      }
    }
  }
}]