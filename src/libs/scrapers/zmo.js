import axios from "axios";

class Zmo{
  constructor(){
    this.baseUrl = "https://web-backend-prod.zmo.ai/api/v1.0/microTask/makeUp";
    
    this.api = axios.create({
      baseURL: this.baseUrl,
      headers: {
        contentType: "application/json",
        identify: Math.random().toString(32).slice(2)
      }
    });
  }
  
  async styles() {
    try {
      return await new Promise((resolve, reject) => {
        this.api.get("/category/img2img").then(async res => {
          if(!res.data.category.length) return reject("failed get img2img styles!");
          resolve({
            success: true, 
            result: await Promise.all(res.data.category.map(d => ({
              categoryId: d.categoryId,
              styles: d.children.map(d => ({
                styleId: d.categoryId,
                name: d.label,
                preview: d.image
              }))
            })))
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false,
        errors: [e]
      }
    }
  }
  
  async taskProcess(taskId) {
    try {
      return await new Promise((resolve, reject) => {
        this.api.get("/get?batchTaskId=" + taskId.toString()).then(res => {
          const data = res.data;
          if(!data.images) return reject("no one job found on this task id!");
          resolve({
            success: true,
            result: data
          })
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false,
        errors: [e]
      }
    }
  }
  
  async convert(image, categoryId, styleId) {
    try {
      return await new Promise(async(resolve, reject) => {
        if(!/^(https?:\/\/)?(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d{2,5})?(\/[^\s]*)?$/.test(image)) return reject("invalid iamge url input!");
        this.api.post("/anonymous/create", {
          categoryId,
          styleCategoryIds: [styleId],
          scale: `2048x2048`,
          resolution: `2048x2048`,
          originalImage: image,
          numOfImages: 1, 
          imageWeight: null,
          subject: null // work, but not good output (very bad model for img2img)
        }).then(async res => {
          const data = res.data;
          if(!data.success) return reject("failed sumbitting job!");
          const taskId = data.batchTaskId;
          let limiter = 1;
          const process = async () => {
            const task = await this.taskProcess(taskId);
            if(!task.success) return reject("failed while processing task!");
            if(limiter >= 120) return reject("failed generating image!");
            if(task.result.images && task.result.taskStatus === 22) {
              return resolve({
                success: true,
                images: task.result.images.map(d => ({
                  image: d.original,
                  style: d.text,
                  createdAt: d.createdAt
                }))
              })
            }
            limiter++;
            setTimeout(process, 1000);
          }
          await process();
        }).catch(reject)
      })
    } catch (e) {
      return {
        success: false, 
        errors: [e]
      }
    }
  }
}

export default new Zmo();