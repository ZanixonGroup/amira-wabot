import colorize from "./../../../libs/scrapers/ai/img2img/colorize.js";

export default [{
  name: "colorize",
  code: async(image) => {
    return await new Promise(async(resolve, reject) => {
      colorize(image)
        .then(resolve)
        .catch(reject)
    })
  }
}]