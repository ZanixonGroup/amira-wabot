import filter from "./../utils/nsfwFilter.js";

export default [{
  name: "nsfwFilter",
  code: async(buffer) => {
    try {
      return await new Promise(async(resolve, reject) => {
        filter.analyze(buffer).then(res => {
          if(!res.success) return reject("failed detecting image");
          resolve({
            status: true, 
            data: {
              ...res.result,
              nsfwAlertImg: "https://telegra.ph/file/d63e9bdcae6f0e7420cef.jpg"
            }
          })
        }).catch(reject)
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]