import {
  GoogleGenAI
} from "@google/genai";
import { fileTypeFromBuffer } from "file-type";

const API_KEY = "AIzaSyBzn0bo0T7tXD_UbgYwXxmyZiHyUrZU224";
const client = new GoogleGenAI({ apiKey: API_KEY });

async function geminiEditor(buffer, prompt) {
    if(!buffer) throw new Error("Missing buffer input!");
    if(!Buffer.isBuffer(buffer)) throw new Error("Invalid buffer input!");
    if(!prompt) throw new Error("Missing prompt input!");
    if(typeof prompt !== "string") throw new Error("Invalid prompt input!");

    const { mime: mimeType } = await fileTypeFromBuffer(buffer);

    const response = await client.models.generateContent({
      model: "gemini-2.0-flash-exp-image-generation",
      config: {
        responseModalities: ["Text", "Image"],
      },
      contents: [
        {
          text: prompt
        },
        {
          inlineData: {
            mimeType,
            data: buffer.toString("base64")
          }
        }
      ]
    });

    const image = Buffer.from(response?.candidates[0].content.parts[0].inlineData.data, "base64");
    if(!image) throw new Error("failed generating response, please check your gemini client!");
    return {
      success: true,
      result: {
        image,
        size: image.length,
        mimetype: (await fileTypeFromBuffer(image)).mime
      }
    }
}

export default geminiEditor;