import cobalt from "./../../libs/scrapers/cobalt.js";

export default [{
  name: "soundcloud",
  code: async(url) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("missing url input!");
        cobalt({
          url,
          downloadMode: "auto"
        }).then(data => {
          if(!data.success) return reject(data.errors)
          resolve({
            status: true,
            media: data.result.url
          })
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]