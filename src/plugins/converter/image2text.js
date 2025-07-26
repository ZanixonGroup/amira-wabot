import axios from "axios";
import FormData from "form-data";

export default [{
  name: "image2text",
  code: async(buffer) => {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!Buffer.isBuffer(buffer)) return reject("invalid buffer input!");
        const form = new FormData();
        form.append("file", Buffer.from(buffer), "image.jpg")
        form.append("url", "")
        form.append("language", "eng")
        form.append("isOverlayRequired", "false")
        form.append("FileType", ".Auto")
        form.append("isCreateSearchablePDF", "false")
        form.append("isSearchablePdfHideTextLayer", "false")
        form.append("detectOrientation", "true")
        form.append("isTable", "true")
        form.append("scale", "true")
        form.append("OCREngine", "5")
        form.append("detectCheckbox", "false")
        form.append("checkboxTemplate", "0")
        axios.post("https://api8.ocr.space/parse/image", form, {
          headers: {
            ...form.getHeaders(),
            apikey: "donotstealthiskey_ip1"
          }
        }).then(res => {
          const data = res.data;
          if(data.IsErroredOnProcessing) return reject(data.ErrorMessage);
          resolve({
            status: true, 
            text: data.ParsedResults[0].ParsedText
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        status: false, 
        error: e
      }
    }
  }
}]