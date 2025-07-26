import { v4 as uuid } from "uuid";

class Chatbot {
  #db
  
  constructor(options){
    this.options = options;
    
    this.#db = global.client.db;
  }
  
  async getAllTask() {
    if(!(await this.#db.has(`queue`, "tasks"))) {
      await this.#db.set("taskAdded", 0, "tasks");
      await this.#db.set("taskCompleted", 0, "tasks");
      await this.#db.set("queue", [], "tasks");
    }
    return (await this.#db.get(`queue`, "tasks") || []);
  }
  
  async addTask(data) {
    const taskId = uuid();
    const queues = await this.getAllTask();
    queues.push({
      taskId,
      status: "pending",
      data
    });
    await this.#db.set(`queue`, queues, "tasks");
    //await this.#db.set(`taskAdded`, (await this.#db.get(`taskAdded`, "tasks").catch() || 0) + 1, "tasks").catch();
    return {
      taskId,
      status: "pending",
      data
    }
  }
  
  async removeTask(taskId) {
    const queues = await this.getAllTask();
    console.log("Remove:", taskId, queues.filter(d => d.taskId === taskId))
    if(!(queues.filter(d => d.taskId === taskId)).length) return false;
    await this.#db.set(`queue`, queues.filter(d => d.taskId !== taskId), "tasks")
    //await this.#db.set(`taskCompleted`, (await this.#db.get(`taskCompleted`, "tasks").catch() || 0) + 1, "tasks").catch();
    return true
  }
  
  async hasSession(user_id, store  = "session") {
    return await this.#db.has(`${user_id}.` + store, "chats");
  }

  async createSession(user_id, store = "session") {
    return await this.#db.set(`${user_id}.` + store, [], "chats");
  }

  async fetchSession(user_id, store = "session") {
    return await this.#db.get(`${user_id}.` + store, "chats");
  }

  async pushToSession(user_id, contents = [], store = "session") {
    return await this.#db.set(`${user_id}.` + store, contents, "chats");
  }
}

export default Chatbot;