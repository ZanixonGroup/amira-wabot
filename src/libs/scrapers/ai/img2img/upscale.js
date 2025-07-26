import axios from "axios";
import FormData from "form-data";

const form = new FormData();
const api = axios.create({
  baseURL: "https://api.imggen.ai",
  timeout: 120_000,
  headers: {
    'Accept': '*/*',
    'Origin': 'https://imggen.ai',
    'Referer': 'https://imggen.ai',
    'User-Agent': 'Zanixon/1.0.0'
  }
});

async function upscale(image) {
  try {
    return await new Promise(async(resolve, reject) => {
      if(!image) return reject("missing image input!");
      if(!Buffer.isBuffer(image)) return reject("invalid buffer image input!");
      
      // #1 - upload file
      form.append("image", "{}");
      form.append("image", image, {
        mimetype: 'image/png',
        filename: Math.random().toString(32) + ".png"
      });
      const upload = await api.post("/guest-upload", form, {
        headers: {
          ...form.getHeaders()
        }
      }).catch(reject);
      
      // #2 - upscale image 
      if(!upload?.data?.image.url) return reject("failed upload image");
      const upscale = await api.post("/guest-upscale-image", {
        image: {
          ...upload.data?.image,
          url: 'https://api.imggen.ai' + upload.data?.image.url
        }
      }).catch(e => reject(e.response.data));
      
      // #3 - download image 
      if(!upscale?.data?.upscaled_image) return reject("failed upscaling image");
      const result = await api.get("/download", {
        params: {
          url: upscale.data?.upscaled_image
        },
        responseType: "arraybuffer"
      }).catch(reject);
      
      // #final
      if(!result?.data) return reject("failed downloading image");
      if(result?.data.length <= 1024) return reject("upscaling process has no result");
      return resolve({
        success: true,
        image: Buffer.from(result.data)
      })
    })
  } catch (e) {
    return {
      success: false,
      errors: e
    }
  }
}

export default upscale;