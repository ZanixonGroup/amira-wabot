import ImgEdit from "./../../../libs/scrapers/imgedit.js";

export default [{
  name: "imgedit",
  code: async(buffer, prompt) =>  {
    try {
      return await ImgEdit(buffer, prompt);
    } catch (e) {
      return {
        success: false,
        errors: e
      }
    }
  }
}]