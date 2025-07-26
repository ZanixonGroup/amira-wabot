import axios from "axios";
import FormData from "form-data";

export default [{
  name: "tiktokSearch",
  code: async(query, page = 1, count = 1, mode = 1) => {
    try {
      return await new Promise((resolve, reject) => {
        if(!query) return reject("missing query input!");
        if(!Number.isInteger(mode)) return reject("search mode must be a number between 1 and 2");
        let searchMode = (mode === 1) ? "feed" : "photo";
        const form = new FormData();
        form.append("keywords", query);
        form.append("count", count.toString());
        form.append("cursor", page.toString());
        axios.post(`https://tikwm.com/api/${searchMode}/search`, form, {
          headers: {
            ...form.getHeaders()
          }
        }).then(res => {
          const data = res.data;
          if(!data?.data?.videos) return reject("no data found!");
          return resolve({
            status: true,
            result: data.data.videos
          })
        }).catch(reject)
      });
    } catch (e) {
      return {
        status: false,
        errors: e
      }
    }
  }
}]