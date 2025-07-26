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
  name: "midjourney",
  code: async(options) => {
    try {
      options = {
        prompt: options?.prompt,
        negative: options?.negative || "nsfw, nudes, nudity, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
        use_negative_prompt: options?.use_negative_prompt || true,
        style: options?.style || "2560 x 1440",
        seed: options?.seed || 0,
        width: options?.width || 512,
        height: options?.height || 512,
        guidance_scale: options?.guidance_scale || 7,
        randomize_seed: options?.randomize_seed || true
      };
  
      if (!options.prompt) return { status: false, message: "undefined reading prompt!" };
  
      return await new Promise((resolve, reject) => {
        const session_hash = string(11);
        axios.post("https://mukaist-midjourney.hf.space/queue/join", {
          data: [
            options?.prompt,
            options?.negative,
            options?.use_negative_prompt,
            options?.style,
            options?.seed,
            options?.width,
            options?.height,
            options?.guidance_scale,
            options?.randomize_seed
          ],
          event_data: null,
          fn_index: 3,
          trigger_id: 6,
          session_hash
        }, { headers }).then(res => {
          axios.get("https://mukaist-midjourney.hf.space/queue/data?session_hash=" + session_hash, {
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
              //console.log(JSON.stringify(jsonObjects, null, 2))
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
      return { status: false, message: e };
    }
  }
}]