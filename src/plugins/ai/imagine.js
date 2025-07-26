import axios from "axios";
import { format } from "util";

export default [{
  name: "imagine",
  code: async(prompt, model = 2) => {
    try {
      if(!prompt) return { status: false, message: "Undefined reading prompt" };
      if(model > 3) return { status: false, message: "Invalid model" };
      return await new Promise(async(resolve, reject) => {
        const baseUrl = "https://text2image-wine.vercel.app";
        const resBaseUrl = "https://progress-black.vercel.app/progress?imageid=";
        axios.get(baseUrl + "/kshitiz?prompt=" + prompt + "&model=" + model).then(async res => {
          const task_id = res.data?.task_id;
          const job = async(id) => {
            const res = await axios.get(resBaseUrl + id);
            return res.data;
          }
          let image = {};
          while(image?.data?.status !== 2) {
            await new Promise((resolve) => setTimeout(resolve, 2500));
            image = await job(task_id);
          }
          if(image?.data?.status == 1) return reject("Failed generating image")
          resolve({ status: true, data: image.data })
        }).catch(err => reject(format(err)));
      })
    } catch (e) {
      return { status: false, message: format(e) };
    }
  }
}]