import axios from "axios";

export default [{
  name: "pinsearch",
  code: async(query) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!query) return reject("missing query input!");
        axios.get("https://api.ryzendesu.vip/api/search/pinterest?query=" + query).then(res => {
          const data = res.data;
          if(!data.length) return reject("failed search pins");
          resolve({
            status: true,
            data
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