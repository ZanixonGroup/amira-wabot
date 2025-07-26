import cobalt from "./../../libs/scrapers/cobalt.js";

export default [{
  name: "bsky",
  code: async(url) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if (!/^(https?:\/\/)?(www\.)?bsky\.app\/profile\/[a-zA-Z0-9_.]+\/post\/[a-zA-Z0-9]+$/.test(url)) reject("invalid url input!");
        cobalt({
          url
        }).then(res => {
          if(!res.success) return reject("failed fetch media");
          let media = [];
          if(res.result.status === "redirect") media.push({
            url: res.result.url
          });
          if(res.result.status === "picker") media = res.result.picker;
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
        errors: e
      }
    }
  }
}]
