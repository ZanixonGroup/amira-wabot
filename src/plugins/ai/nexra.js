import {
  dalle,
  prodia,
  stablediffusion,
  emi
} from "gpti";
import { format } from "util";

export default [{
  name: "dalle",
  code: async(prompt) => {
    try {
      if(!prompt) return { status: false, message: "undefined reading prompt" };
      const data = await new Promise((resolve, reject) => {
        dalle.v1({
          prompt
        }, (err, data) => {
          if(err) {
            reject(err);
          } else {
            resolve(Buffer.from(data.images[0].split(",")[1], "base64"));
          }
        })
      });
      return { status: true, data };
    } catch (e) {
      return { status: false, message: format(e) };
    }
  }
},{
  name: "prodia",
  code: async({ prompt, negative, model, steps, scale, sampler, width, height }) => {
    try {
      if(!prompt) return { status: false, message: "undefined reading prompt" };
      const data = await new Promise((resolve, reject) => {
        prodia.stablediffusion({
          prompt,
          data: {
            prompt_negative: negative || "",
            model: model || "breakdomain_I2428.safetensors [43cc7d2f]",
            sampling_method: sampler || "DPM++ 2M Karras",
            sampling_steps: steps || 28,
            width: width || 1024,
            height: height || 576,
            cfg_scale: scale || 7
          }
        }, (err, data) => {
          if(err) {
            reject(err);
          } else {
            resolve({ payload: { prompt: data.prompt, ...data.data }, image: Buffer.from(data.images[0].split(",")[1], "base64") });
          }
        })
      });
      return {
        status: true,
        payload: data.payload,
        data: data.image
      };
    } catch (e) {
      return { status: false, message: format(e) };
    }
  }
},{
  name: "stablediffusion",
  code: async(prompt, negative) => {
    try {
      if(!prompt) return { status: false, message: "undefined reading prompt" };
      const data = await new Promise((resolve, reject) => {
        stablediffusion.v2({
          prompt,
          data: {
            prompt_negative: negative || "",
            guidance_scale: 9
          }
        }, (err, data) => {
          if(err) {
            reject(err);
          } else {
            resolve(Buffer.from(data.images[0].split(",")[1], "base64"));
          }
        })
      });
      return { status: true, data };
    } catch (e) {
      return { status: false, message: format(e) };
    }
  }
},{
  name: "emi",
  code: async(prompt) => {
    try {
      if(!prompt) return { status: false, message: "undefined reading prompt" };
      const data = await new Promise((resolve, reject) => {
        emi({
          prompt
        }, (err, data) => {
          if(err) {
            reject(err);
          } else {
            resolve(Buffer.from(data.images[0].split(",")[1], "base64"));
          }
        })
      });
      return { status: true, data };
    } catch (e) {
      return { status: false, message: format(e) };
    }
  }
}]