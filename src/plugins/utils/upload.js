import cdn from "./../../utils/cdn.js";

export default [{
  name: "upload",
  code: async(buffer) => {
    try {
      return await cdn.upload({ content: buffer })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]