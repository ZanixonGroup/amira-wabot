import jimp from "jimp";

export default [{
  name: "lowres",
  code: async(buffer, blur, pix) => {
    try {
      if(!buffer) return { status: false, message: "undefined reading buffer" };
      return await new Promise(async(resolve, reject) => {
        const img = await jimp.read(buffer);
        img.pixelate(parseInt(pix) || 5);
        img.quality(parseInt(blur) || 8);
        const image = await img.getBufferAsync(jimp.MIME_JPEG);
        return resolve({
          status: true,
          image
        })
      })
    } catch (e) {
      return { status: false, message: e };
    }
  }
}]