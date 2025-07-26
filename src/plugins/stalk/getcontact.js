import fastapi from "./../../libs/api/fastapi.js";

function parseNumber(number) {
    number = number.replace(/\s+/g, "");
    if (number.startsWith("+62")) {
        return "0" + number.slice(3);
    } else if (number.startsWith("62")) {
        return "0" + number.slice(2);
    } else {
        return number;
    }
}


export default [{
  name: "getcontact",
  code: async(number) => {
    try {
      return await new Promise((resolve, reject) => {
        number = parseNumber(number)
        fastapi.get("/tool/getcontact", {
          params: {
            number
          }
        }).then(res => {
          if(!res.success) return reject("failed fetch contact tags");
          return resolve({
            success: true,
            result: res.result
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false, 
        errors: e
      }
    }
  }
}]