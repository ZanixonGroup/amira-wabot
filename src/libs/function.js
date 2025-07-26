import axios from "axios";
import fs from "fs";
import { fileTypeFromBuffer } from "file-type";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { platform } from "os";
import moment from "moment-timezone";
import * as cheerio from "cheerio";
import { format } from "util";
import FormData from "form-data"
import mimes from "mime-types"
import Jimp from "jimp"
import baileys from "@whiskeysockets/baileys";


export default new (class Function {
   constructor() {
      this.axios = axios;
      this.cheerio = cheerio;
      this.fs = fs;
      this.path = path;
      this.baileys = baileys;
      this.FormData = FormData;;
   }

   async dirSize(directory) {
      const files = await fs.readdirSync(directory);
      const stats = files.map((file) =>
         fs.statSync(path.join(directory, file))
      );

      return (await Promise.all(stats)).reduce(
         (accumulator, { size }) => accumulator + size,
         0
      );
   }

   sleep(ms) {
      return new Promise((a) => setTimeout(a, ms));
   }
   
//     clearSession(folderPath) {
// 	fs.readdir(folderPath, (err, files) => {
//     if (err) {
//       console.error('Error reading directory:', err);
//       return;
//     }
//     files.forEach(file => {
//       if (file !== 'creds.json') {
//         fs.unlinkSync(path.join(folderPath, file));
//       }
//     });
//   })
//  }

   format(str) {
      return format(str)
   }

   Format(str) {
      return JSON.stringify(str, null, 2);
   }

   jam(numer, options = {}) {
      let format = options.format ? options.format : "HH:mm";
      let jam = options?.timeZone
         ? moment(numer).tz(options.timeZone).format(format)
         : moment(numer).format(format);

      return `${jam}`;
   }

   tanggal(numer, timeZone = "") {
      const myMonths = [
         "Januari",
         "Februari",
         "Maret",
         "April",
         "Mei",
         "Juni",
         "Juli",
         "Agustus",
         "September",
         "Oktober",
         "November",
         "Desember",
      ];
      const myDays = [
         "Minggu",
         "Senin",
         "Selasa",
         "Rabu",
         "Kamis",
         "Jum’at",
         "Sabtu",
      ];
      var tgl = new Date(numer);
      timeZone ? tgl.toLocaleString("en", { timeZone }) : "";
      var day = tgl.getDate();
      var bulan = tgl.getMonth();
      var thisDay = tgl.getDay(),
         thisDay = myDays[thisDay];
      var yy = tgl.getYear();
      var year = yy < 1000 ? yy + 1900 : yy;
      let gmt = new Date(0).getTime() - new Date("1 January 1970").getTime();
      let weton = ["Pahing", "Pon", "Wage", "Kliwon", "Legi"][
         Math.floor((tgl * 1 + gmt) / 84600000) % 5
      ];

      return `${thisDay}, ${day} ${myMonths[bulan]} ${year}`;
   }

   async getFile(PATH, save) {
      try {
         let filename = null;
         let data = (await this.fetchBuffer(PATH))

         if (data?.data && save) {
            filename = path.join(process.cwd(), "temp", Date.now() + "." + data.ext)
            fs.promises.writeFile(filename, data?.data);
         }
         return {
            filename: data?.name ? data.name : filename,
            ...data
         };
      } catch (e) {
         throw e
      }
   }

   async fetchJson(url, options = {}) {
      try {
         let data = await axios.get(url, {
            headers: {
               ...(!!options.headers ? options.headers : {})
            },
            responseType: "json",
            ...options
         })

         return await data?.data;
      } catch (e) {
         throw e;
      }
   }

   async fetchText(url, options = {}) {
      try {
         let data = await axios.get(url, {
            headers: {
               ...(!!options.headers ? options.headers : {})
            },
            responseType: "text",
            ...options
         })

         return await data?.data;
      } catch (e) {
         throw e;
      }
   }

   fetchBuffer(string, options = {}) {
      return new Promise(async (resolve, reject) => {
         try {
            if (/^https?:\/\//i.test(string)) {
               let data = await axios.get(string, {
                  headers: {
                     ...(!!options.headers ? options.headers : {}),
                  },
                  responseType: "arraybuffer",
                  ...options,
               })
               let buffer = await data?.data
               let name = /filename/i.test(data.headers?.get("content-disposition")) ? data.headers?.get("content-disposition")?.match(/filename=(.*)/)?.[1]?.replace(/["';]/g, '') : ''
               let mime = mimes.lookup(name) || data.headers.get("content-type") || (await fileTypeFromBuffer(buffer))?.mime
               resolve({
                  data: buffer,
                  size: Buffer.byteLength(buffer),
                  sizeH: this.formatSize(Buffer.byteLength(buffer)),
                  name,
                  mime,
                  ext: mimes.extension(mime)
               });
            } else if (/^data:.*?\/.*?;base64,/i.test(string)) {
               let data = Buffer.from(string.split`,`[1], "base64")
               let size = Buffer.byteLength(data)
               resolve({ data, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }) });
            } else if (fs.existsSync(string) && fs.statSync(string).isFile()) {
               let data = fs.readFileSync(string)
               let size = Buffer.byteLength(data)
               resolve({ data, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }) });
            } else if (Buffer.isBuffer(string)) {
               let size = Buffer?.byteLength(string) || 0
               resolve({ data: string, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(string)) || { mime: "application/octet-stream", ext: ".bin" }) });
            } else if (/^[a-zA-Z0-9+/]={0,2}$/i.test(string)) {
               let data = Buffer.from(string, "base64")
               let size = Buffer.byteLength(data)
               resolve({ data, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }) });
            } else {
               let buffer = Buffer.alloc(20)
               let size = Buffer.byteLength(buffer)
               resolve({ data: buffer, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(buffer)) || { mime: "application/octet-stream", ext: ".bin" }) });
            }
         } catch (e) {
            reject({ message: e })
         }
      });
   }

   mime(name) {
      let mimetype = mimes.lookup(name)
      if (!mimetype) return mimes.extension(name)
      return { mime: mimetype, ext: mimes.extension(mimetype) }
   }

   isUrl(url) {
      let regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "gi")
      if (!regex.test(url)) return false
      return url.match(regex)
   }

   escapeRegExp(string) {
      return string.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, '\\$&')
   }

   toUpper(query) {
      const arr = query.split(" ")
      for (var i = 0; i < arr.length; i++) {
         arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
      }

      return arr.join(" ")
      //return query.replace(/^\w/, c => c.toUpperCase())
   }

   getRandom(ext = "", length = "10") {
      var result = "";
      var character =
         "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      var characterLength = character.length;
      for (var i = 0; i < length; i++) {
         result += character.charAt(
            Math.floor(Math.random() * characterLength)
         );
      }

      return `${result}${ext ? `.${ext}` : ""}`;
   }

   formatSize(bytes, si = true, dp = 2) {
      const thresh = si ? 1000 : 1024;

      if (Math.abs(bytes) < thresh) {
         return `${bytes} B`;
      }

      const units = si
         ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
         : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
      let u = -1;
      const r = 10 ** dp;

      do {
         bytes /= thresh;
         ++u;
      } while (
         Math.round(Math.abs(bytes) * r) / r >= thresh &&
         u < units.length - 1
      );

      return `${bytes.toFixed(dp)} ${units[u]}`;
   }

    parseFileSize(sizeStr) {
      const units = {
        B: 1,
        KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12, PB: 1e15, EB: 1e18,
        KIB: 1024, MIB: 1024 ** 2, GIB: 1024 ** 3, TIB: 1024 ** 4, PIB: 1024 ** 5, EIB: 1024 ** 6
      };
    
      const match = sizeStr.toUpperCase().match(/^([\d.]+)\s*(B|KB|MB|GB|TB|PB|EB|KIB|MIB|GIB|TIB|PIB|EIB)$/i);
      if (!match) throw new Error("Invalid size format");
    
      const value = parseFloat(match[1]);
      const unit = match[2].toUpperCase();
    
      return value * (units[unit] || 1);
    }

   async resizeImage(buffer, height) {
      buffer = (await this.getFile(buffer)).data

      return new Promise((resolve, reject) => {
         Jimp.read(buffer, (err, image) => {
            if (err) {
               reject(err)
               return
            }

            image.resize(Jimp.AUTO, height)
               .getBuffer(Jimp.MIME_PNG, (err, resizedBuffer) => {
                  if (err) {
                     reject(err)
                     return
                  }
                  resolve(resizedBuffer)
               })
         })
      })
   }

   runtime(seconds) {
      seconds = Number(seconds);
      var d = Math.floor(seconds / (3600 * 24));
      var h = Math.floor((seconds % (3600 * 24)) / 3600);
      var m = Math.floor((seconds % 3600) / 60);
      var s = Math.floor(seconds % 60);
      var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return dDisplay + hDisplay + mDisplay + sDisplay;
   }

   async correct(mainString, targetStrings) {
      function compareTwoStrings(first, second) {
         first = first.replace(/\s+/g, "");
         second = second.replace(/\s+/g, "");

         if (first === second) return 1; // identical or empty
         if (first.length < 2 || second.length < 2) return 0; // if either is a 0-letter or 1-letter string

         let firstBigrams = new Map();
         for (let i = 0; i < first.length - 1; i++) {
            const bigram = first.substring(i, i + 2);
            const count = firstBigrams.has(bigram)
               ? firstBigrams.get(bigram) + 1
               : 1;

            firstBigrams.set(bigram, count);
         }

         let intersectionSize = 0;
         for (let i = 0; i < second.length - 1; i++) {
            const bigram = second.substring(i, i + 2);
            const count = firstBigrams.has(bigram)
               ? firstBigrams.get(bigram)
               : 0;

            if (count > 0) {
               firstBigrams.set(bigram, count - 1);
               intersectionSize++;
            }
         }

         return (
            (2.0 * intersectionSize) / (first.length + second.length - 2)
         );
      }

      targetStrings = Array.isArray(targetStrings) ? targetStrings : [];

      const ratings = [];
      let bestMatchIndex = 0;

      for (let i = 0; i < targetStrings.length; i++) {
         const currentTargetString = targetStrings[i];
         const currentRating = compareTwoStrings(
            mainString,
            currentTargetString
         );
         ratings.push({
            target: currentTargetString,
            rating: currentRating,
         });
         if (currentRating > ratings[bestMatchIndex].rating) {
            bestMatchIndex = i;
         }
      }

      const bestMatch = ratings[bestMatchIndex];

      return {
         all: ratings,
         indexAll: bestMatchIndex,
         result: bestMatch.target,
         rating: bestMatch.rating,
      };
   }
   
  parseTime(timeRaw) {
      const regex = /^(\d+)([smhdwmyo]{1,2})$/;
      const match = timeRaw.match(regex);
  
      if (match) {
          const value = parseInt(match[1]);
          const unit = match[2];
  
          let multiplier;
          switch (unit) {
              case 's':
                  multiplier = 1000; // 1 detik = 1000 milidetik
                  break;
              case 'm':
                  multiplier = 60 * 1000; // 1 menit = 60 detik = 60000 milidetik
                  break;
              case 'h':
                  multiplier = 60 * 60 * 1000; // 1 jam = 60 menit = 3600 detik = 3600000 milidetik
                  break;
              case 'd':
                  multiplier = 24 * 60 * 60 * 1000; // 1 hari = 24 jam = 86400 detik = 86400000 milidetik
                  break;
              case 'w':
                  multiplier = 7 * 24 * 60 * 60 * 1000; // 1 minggu = 7 hari = 604800 detik = 604800000 milidetik
                  break;
              case 'mo':
                  // Penggunaan 30 hari sebagai perkiraan
                  multiplier = 30 * 24 * 60 * 60 * 1000;
                  break;
              case 'y':
                  // Perhitungan tahun dengan mengasumsikan setiap tahun memiliki 365 hari
                  multiplier = 365 * 24 * 60 * 60 * 1000;
                  break;
              default:
                  throw new Error('Unit waktu tidak valid.');
          }
  
          const timestamp = value * multiplier;
          const formatted = `${value}${unit}${unit.length === 1 ? '' : ''}`;
          return timestamp;
      } else {
          throw new Error('Format waktu tidak valid.');
      }
  }
  
  parseUnix(timestamp, format) {
    format = format ? format : "{d} hari, {h} jam, {min} menit, {sec} detik";
    let milliseconds = Math.floor(parseInt(timestamp, 10));
    let now = Math.floor(Date.now());
    if (isNaN(milliseconds)) {
      throw new Error("Timestamp is not valid number!");
    }
  
    let ms = Math.floor((milliseconds - now) / 1000);
    let days = Math.floor(ms / 86400);
    let hours = Math.floor((ms % 86400) / 3600);
    let minutes = Math.floor(((ms % 86400) % 3600) / 60);
    let seconds = ((ms % 86400) % 3600) % 60;
  
    return format
      .replaceAll("{d}", days)
      .replaceAll("{h}", hours)
      .replaceAll("{min}", minutes)
      .replaceAll("{sec}", seconds);
  }
  
  parseArgs(input) {
    const args = input.match(/--\w+(?:[= ](?:[^\s"']+|".+?"|'.+?'))?/g) || [];
    const result = {};
    const argRegex = /--(\w+)(?:[= ]((?:[^\s"']+)|(?:"[^"]*")|(?:'[^']*')))?/;
  
    args.forEach(arg => {
      const match = arg.match(argRegex);
      if (match) {
        const key = match[1];
        let value = match[2];
        if (value === undefined) {
          result[key] = true; // flag tanpa nilai
        } else if (/^["']/.test(value)) {
          value = value.slice(1, -1); // hapus tanda kutip di sekitar nilai
        }
        result[key] = value;
      }
    });
  
    return result;
  }
})()
