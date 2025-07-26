import axios from "axios";
import FormData from "form-data";

class NsfwFilter{
  constructor(options){
    this.options = options;
  }
  
  async createSignature() {
    try {
      return await new Promise(async(resolve, reject) => {
        const timestamp = Date.now()
        axios.post("https://cloudinary-tools.netlify.app/.netlify/functions/sign-upload-params", {
        	"paramsToSign": {
        		"timestamp": timestamp,
        		"upload_preset": "cloudinary-tools",
        	  "source": "ml"
        	}
        }).then(res => {
          const data = res.data;
          if(!data.signature) return reject("failed get signature");
          resolve({
            success: true,
            signature: data.signature,
            timestamp
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
  
  async analyze(media) {
    try {
      return await new Promise(async(resolve, reject) => {
        const isBuffer = Buffer.isBuffer(media);
        if(!media) return reject("missing media input!");
        if (!(isBuffer || /(www|http:|https:)+[^\s]+[\w]/.test(media))) return reject("missing media input!");
        const token = await this.createSignature();
        if(!token.success) return reject("failed generate signature token!");
        const form = new FormData();
        form.append("file", isBuffer ? media : media.toString(), isBuffer ? {
          mimetype: "image/png",
          filename: token.timestamp + ".png"
        } : null);
        form.append("upload_preset", "cloudinary-tools");
        form.append("source", "ml");
        form.append("signature", token.signature.toString());
        form.append("timestamp", token.timestamp.toString());
        form.append("api_key", "985946268373735");
        axios.post("https://api.cloudinary.com/v1_1/dtz0urit6/auto/upload", form, {
          headers: {
            ...form.getHeaders()
          }
        }).then(res => {
          const data = res.data;
          if(!data.moderation) return reject("failed analyze media");
          const mod = data.moderation[0];
          const sensitivity = parseInt(((mod.response.moderation_labels.reduce((total, label) => total + label.confidence, 0) / (100 * mod.response.moderation_labels.length)) * 100).toFixed(2))
          resolve({
            success: true,
            result: {
              status: mod.status,
              sensitivity: (isNaN(sensitivity) ? 0 : sensitivity),
              labels: mod.response.moderation_labels.map(d => ({ sensitivity: d.confidence, label: d.name, parent_label: d.parent_name }))
            }
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
}

export default new NsfwFilter();