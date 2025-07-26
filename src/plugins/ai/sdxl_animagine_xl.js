import axios from "axios";
import JSONStream from "JSONStream";

function string(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const headers = {
  'authority': 'cagliostrolab-animagine-xl-3-1.hf.space'
}

export default [{
  name: "animagineXL",
  code: async(options) => {
    try {
      options = {
        prompt: options?.prompt, // str  in 'Prompt' Textbox component
        negative: options?.negative || "nsfw, nudes, bad quality", // str  in 'Negative Prompt' Textbox component
        seed: options?.seed || Math.floor(Math.random() * 2147483647), // float (numeric value between 0 and 2147483647) in 'Seed' Slider component
        width: options?.width || 1024, // float (numeric value between 512 and 2048) in 'Width' Slider component
        height: options?.height || 1024, // float (numeric value between 512 and 2048) in 'Height' Slider component
        sas_scale: options?.sas_scale || 7, // float (numeric value between 1 and 12) in 'Guidance scale' Slider component
        sas_steps: options?.sas_steps || 28, // float (numeric value between 1 and 50) in 'Number of inference steps' Slider component
        schedule: options?.schedule || "Euler a", // Literal['DPM++ 2M Karras', 'DPM++ SDE Karras', 'DPM++ 2M SDE Karras', 'Euler', 'Euler a', 'DDIM']  in 'Sampler' Dropdown component
        aspect_ratio: options?.aspect_ratio || "896 x 1152", // Literal['1024 x 1024', '1152 x 896', '896 x 1152', '1216 x 832', '832 x 1216', '1344 x 768', '768 x 1344', '1536 x 640', '640 x 1536', 'Custom']  in 'Aspect Ratio' Radio component
        style: options?.style || "Anime", // Literal['(None)', 'Cinematic', 'Photographic', 'Anime', 'Manga', 'Digital Art', 'Pixel art', 'Fantasy art', 'Neonpunk', '3D Model']  in 'Style Preset' Radio component
        quality: options?.quality || "Standard v3.1", // Literal['(None)', 'Standard', 'Light', 'Heavy']  in 'Quality Tags Presets' Dropdown component
        upscale: options?.upscale || false, // bool  in 'Use Upscaler' Checkbox component
        strength: options?.strength || 1, // float (numeric value between 0 and 1) in 'Strength' Slider component
        upscale_by: options?.upscale_by || 1.5, // float (numeric value between 1 and 1.5) in 'Upscale by' Slider component
        add_quality_tags: options?.add_quality_tags || true // bool  in 'Add Quality Tags' Checkbox component
      };
  
      if (!options.prompt) return { status: false, message: "undefined reading prompt!" };
  
      return await new Promise((resolve, reject) => {
        const session_hash = string(11);
        axios.post("https://cagliostrolab-animagine-xl-3-1.hf.space/queue/join", {
          data: [
            options.prompt, // str  in 'Prompt' Textbox component
            options.negative, // str  in 'Negative Prompt' Textbox component
            options.seed, // float (numeric value between 0 and 2147483647) in 'Seed' Slider component
            options.width, // float (numeric value between 512 and 2048) in 'Width' Slider component
            options.height, // float (numeric value between 512 and 2048) in 'Height' Slider component
            options.sas_scale, // float (numeric value between 1 and 12) in 'Guidance scale' Slider component
            options.sas_steps, // float (numeric value between 1 and 50) in 'Number of inference steps' Slider component
            options.schedule, // Literal['DPM++ 2M Karras', 'DPM++ SDE Karras', 'DPM++ 2M SDE Karras', 'Euler', 'Euler a', 'DDIM']  in 'Sampler' Dropdown component
            options.aspect_ratio, // Literal['1024 x 1024', '1152 x 896', '896 x 1152', '1216 x 832', '832 x 1216', '1344 x 768', '768 x 1344', '1536 x 640', '640 x 1536', 'Custom']  in 'Aspect Ratio' Radio component
            options.style, // Literal['(None)', 'Cinematic', 'Photographic', 'Anime', 'Manga', 'Digital Art', 'Pixel art', 'Fantasy art', 'Neonpunk', '3D Model']  in 'Style Preset' Radio component
            options.quality, // Literal['(None)', 'Standard', 'Light', 'Heavy']  in 'Quality Tags Presets' Dropdown component
            options.upscale, // bool  in 'Use Upscaler' Checkbox component
            options.strength, // float (numeric value between 0 and 1) in 'Strength' Slider component
            options.upscale_by, // float (numeric value between 1 and 1.5) in 'Upscale by' Slider component
            options.add_quality_tags // bool  in 'Add Quality Tags' Checkbox component
          ],
          event_data: null,
          fn_index: 5,
          trigger_id: 49,
          session_hash
        }, { headers }).then(res => {
          axios.get("https://cagliostrolab-animagine-xl-3-1.hf.space/queue/data?session_hash=" + session_hash, {
            responseType: "stream"
          }, { headers }).then(res => {
            let chunks = [];
            res.data.on("data", chunk => chunks.push(chunk));
            res.data.on("end", () => {
              const rawData = Buffer.concat(chunks).toString('utf8');
              const lines = rawData.split('\n');
              const jsonObjects = [];
  
              lines.forEach(line => {
                if (line.startsWith('data: ')) {
                  try {
                    const jsonString = line.substring(6).trim();
                    const jsonObject = JSON.parse(jsonString);
                    jsonObjects.push(jsonObject);
                  } catch (error) {
                    reject("failed generating image!")
                  }
                }
              });
              
              const before = jsonObjects.filter(d => d.msg == "process_completed")[0] || {}
              if(!before?.success) return reject(before)
              const data = jsonObjects.filter(d => d.msg == "process_completed").map(d => d.output);
              const images = data[0]?.data[0].map(d => d.image.url)
              resolve({
                status: true,
                data: {
                  images,
                  metadata: data[0].data[1]
                }
              });
            });
          }).catch(reject);
        }).catch(reject);
      });
    } catch (e) {
      return { status: false, message: e.message };
    }
  }
}]