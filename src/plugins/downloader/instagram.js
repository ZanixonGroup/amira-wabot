import ryzen from "./../../libs/api/ryzen.js";

export default [{
  name: "igdl",
  code: async(url) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if (!/^https?:\/\/(?:www\.)?instagram\.com\/(?:[a-zA-Z0-9_\/-]+)\/?.*/.test(url)) reject("invalid url input!");
        ryzen.get("/api/downloader/igdl", {
          params: {
            url
          }
        }).then(res => {
          if(!res.success) return reject("failed fetch media");
          let media = res.result.data;
          if(!media.length) return reject("failed fetch media");
          return resolve({
            status: true,
            media
          })
        }).catch(e => reject(e.errors))
      })
    } catch (e) {
      return {
        status: false,
        errors: [e]
      }
    }
  }
}]
