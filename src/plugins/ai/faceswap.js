import axios from "axios";
import FormData from "form-data";

export default [{
  name: "faceswap",
  code: async(original, face) => {
    try {
      return await new Promise(async (resolve, reject) => {
        if (!original) return reject("missing original image input!");
        if (!face) return reject("missing face image input!");
        if (!Buffer.isBuffer(original)) return reject("invalid buffer on original image input!");
        if (!Buffer.isBuffer(face)) return reject("invalid buffer on face image input!");
  
        const form = new FormData();
        form.append("target_image_file", original, {
          filename: `${Math.random().toString(32).slice(2)}.png`,
          contentType: "image/png"
        });
        form.append("target_face_file", face, {
          filename: `${Math.random().toString(32).slice(2)}.png`,
          contentType: "image/png"
        });
  
        axios.post("https://aifaceswapper.io/api/nicefish/fs/singleface", form, {
          headers: {
            ...form.getHeaders(),
            authorization: Date.now().toString(),
            origin: "https://aifaceswapper.io",
            referer: "https://aifaceswapper.io/en",
          }
        }).then(async res => {
          const data = res.data;
          console.log("[faceswap]", "task submitted...");
          if (!data.data.request_id) return reject("failed while requesting job");
  
          const task_progress = async () => (
            await axios.get("https://aifaceswapper.io/api/nicefish/fs/result?request_id=" + data.data.request_id, {
              headers: { authorization: Date.now().toString() }
            })
          ).data;
  
          let counter = 0;
          async function process() {
            const task = await task_progress();
            console.log("[faceswap]", `${task.data.status || "failed"}...`);
            if (counter >= 60) return reject("failed generating image!");
            if (task.data.result_img_url) {
              return resolve({
                status: true,
                image: task.data.result_img_url
              });
            }
            counter++;
            setTimeout(process, 1000);
          }
          await process();
        }).catch(e => reject(e.response.data));
      });
    } catch (e) {
      return {
        status: false,
        message: e
      };
    }
  }
}]