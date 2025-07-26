import ryzen from "./../../libs/api/ryzen.js";

export default [{
  name: "mediafire",
  code: async function mediaFire(url) {
    try {
      return await ryzen.get("/api/downloader/mediafire", {
        params: {
          url
        }
      });
    } catch (error) {
      return e;
    }
  }
}]