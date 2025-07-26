import axios from "axios";
import FormData from "form-data";

export default [{
  name: "pixelart",
  code: async(prompt) => {
    const baseUrl = "https://aipixelartgenerator.com/wp-admin/admin-ajax.php";
    const form = new FormData();
  
    if(!prompt) return { status: false, message: "undefined reading prompt!" };
    // input
    form.append("action", "generate_pixel_art_image");
    form.append("user-input", prompt + " " + Math.random());
    // execution
    try {
      const res = await axios.post(baseUrl, form)
      const result = res?.data;
      if(!result?.success) return { status: false, message: "Failed generate image!" };
      return { status: true, prompt, image: Buffer.from(result.data, "base64") };
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]