export default [{
  name: "calcRatio",
  code: (ratio, maxSize = 1024) => {
    try {
      const [width, height] = ratio.split(":").map(Number);
      const factor = Math.min(maxSize / width, maxSize / height);
      return {
        status: true,
        data: {
          width: Math.round(width * factor),
          height: Math.round(height * factor),
          ratio
        }
      }
    } catch (e) {
      return { status: false, message: e }
    }
  }
}]