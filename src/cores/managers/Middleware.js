import * as glob from "glob";
import path from "path";
import { dirname } from "desm";
const __dirname = dirname(import.meta.url);

class MiddlewareManager {
  constructor() {
    this.middlewares = [];
  }

  /**
   * Menambahkan middleware ke dalam antrian
   * @param {function} middleware - Fungsi middleware
   * @param {Object} [options] - Opsi tambahan
   * @param {number} [options.priority=0] - Prioritas eksekusi middleware (lebih besar = lebih awal)
   * @param {boolean} [options.parallel=false] - Menjalankan middleware secara paralel
   * @param {boolean} [options.isErrorHandler=false] - Menandai middleware sebagai error handler
   */
  use(middleware, options = {}) {
    if (typeof middleware !== "function") {
      throw new TypeError("Middleware must be a function");
    }
    this.middlewares.push({ 
      fn: middleware, 
      priority: options.priority || 0, 
      parallel: options.parallel || false,
      isErrorHandler: options.isErrorHandler || false
    });
    this.middlewares.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * Memuat middleware secara otomatis dan dinamis
   * @param {string} directory - Path direktori diletakannya middleware
   */
  async loadMiddlewares(directory) {
    const filesPath = path.join(__dirname, directory);
    const files = glob.sync(filesPath + "/**/*.js");
    files.forEach(async(file) => {
      const code = await import(file);
      if(!code) return;
      this.use(code)
    });
  }

  /**
   * Menjalankan semua middleware secara berurutan
   * @param {Object} context - Konteks yang akan diteruskan ke setiap middleware
   */
  async run(context) {
    let index = -1;
    let stopped = false;
    let paused = false;
    
    const stop = () => { stopped = true; };
    const pause = () => { paused = true; };
    const resume = async () => {
      if (!paused) return;
      paused = false;
      await next(index + 1);
    };

    /**
     * Menjalankan middleware berikutnya
     * @param {number} i - Indeks middleware saat ini
     * @param {Error|null} [error] - Objek error jika terjadi kesalahan
     */
    const next = async (i, error = null) => {
      if (stopped || paused || i <= index) return;
      index = i;
      const middleware = this.middlewares[i];

      if (middleware) {
        try {
          if (error) {
            if (middleware.isErrorHandler) {
              await middleware.fn(context, error, next.bind(null, i + 1), stop, pause, resume);
            } else {
              await next(i + 1, error);
            }
          } else {
            if (middleware.parallel) {
              middleware.fn(context, next.bind(null, i + 1), stop, pause, resume)
                .catch(err => next(i + 1, err));
              await next(i + 1);
            } else {
              await middleware.fn(context, next.bind(null, i + 1), stop, pause, resume);
            }
          }
        } catch (err) {
          await next(i + 1, err);
        }
      }
    };

    await next(0);
  }
}

export default MiddlewareManager;