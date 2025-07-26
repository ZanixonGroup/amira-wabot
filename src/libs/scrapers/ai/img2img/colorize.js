import axios from "axios";
import FormData from "form-data";

async function colorize(image) {
  try {
    if(!image) throw new Error("missing image input");
    if(!Buffer.isBuffer(image)) throw new Error("invalid buffer image input");
    
    const form = new FormData();
    form.append("file", Buffer.from(image), {
      mimetype: "image/jpg",
      filename: Math.random().toString(32) + ".jpg"
    });
    
    const response = await axios.post("https://ai-services.visual-paradigm.com/api/deoldify/file", form, {
      responseType: 'arraybuffer',
      headers: {
        ...form.getHeaders(),
        'Accept': '*/*',
        'Origin': 'https://online.visual-paradigm.com',
        'Referer': 'https://online.visual-paradigm.com/',
        'User-Agent': 'Zanixon/1.0.0'
      }
    });
    
    const buffer = Buffer.from(response?.data);
    if(!buffer) throw new Error("failed generating image")
    if(buffer.length <= 1024) throw new Error("failed generating image");
    
    return {
      success: true,
      image: buffer
    }
  } catch (e) {
    return {
      success: false,
      errors: e
    }
  }
}

export default colorize;