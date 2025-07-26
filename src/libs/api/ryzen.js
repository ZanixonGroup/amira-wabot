import axios from "axios";

const ryzen = axios.create({
  baseURL: "https://api.ryzumi.vip",
  timeout: 120000,
  headers: {
    "User-Agent": "Ryzendesu Network Authorized App"
  }
});

class RyzenAPI {
  constructor(){
  }
  
  async get(endpoint, options = {}) {
    try {
      return await new Promise((resolve, reject) => {
        if(!endpoint.startsWith("/api")) return reject("endpoint must start with /api");
        if(typeof options !== "object") return reject("invalid options type input");
        ryzen.get(endpoint, options).then(res => {
          const data = res.data;
          resolve({
            code: res?.status || 200,
            success: true,
            result: data
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        code: e?.response?.status || 500,
        success: false,
        errors: e?.response?.data || e.message || e
      }
    }
  }
  
  async post(endpoint, body = {}, options = {}) {
    try {
      return await new Promise((resolve, reject) => {
        if(!endpoint.startsWith("/api")) return reject("endpoint must start with /api");
        ryzen.post(endpoint, body, options).then(res => {
          const data = res.data;
          resolve({
            code: res?.status || 200,
            success: true,
            result: data
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        code: e?.response?.status || 500,
        success: false,
        errors: e?.response?.data || e.message || e
      }
    }
  }
}

export default new RyzenAPI();