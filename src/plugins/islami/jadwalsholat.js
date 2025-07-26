import axios from "axios";

async function jadwal(address) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!address) return reject("missing address input!");
      axios.get("https://api.aladhan.com/v1/timingsByAddress/26-11-2024?method=20&country=ID&address=" + address).then(res => {
        const data = res.data;
        if(data.status !== "ok") return reject()
      })
    })
  } catch (e) {
    return {
      success: false,
      errors: e
    }
  }
}