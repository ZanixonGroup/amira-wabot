import cobalt from "./../../libs/scrapers/cobalt.js"

export default [{
  name: "bilidl",
  code: async(url,quality = 720) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!url) return reject("missing url input!");
        // TEMPAT REGEX
        cobalt({
        	url,
        	"videoQuality": quality.toString()
        }).then(data => {
          if(!data.success) return reject("failed fetch content");
          return resolve({
            status: true,
            media: data.result.url,
            filename: data.result.filename
          })
        }).catch(reject);
      })
    } catch (e) {
      return {
        status: false,
        message: e
      }
    }
  }
}]