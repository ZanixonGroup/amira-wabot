import fs from "fs";
import path from "path";
import { dirname } from "desm";
const badwords_db = JSON.parse(await fs.readFileSync(path.join(dirname(import.meta.url), "../../assets/profanity/badwords.json"), "utf8"));

class Badwords {
  constructor(opt) {
    this.badwords = [...(opt?.fromDb ? badwords_db : []), ...opt.badwords];
    this.updateRegex();
  }

  updateRegex() {
    const variations = this.badwords.map(word => this.createVariations(word));
    this.regex = new RegExp(variations.join('|'), 'gi');
  }

  createVariations(word) {
    const replacements = {
      'a': '(a|@|4)',
      'b': '(b|8)',
      'e': '(e|3)',
      'g': '(g|9|6)',
      'i': '(i|1|!|l)',
      'o': '(o|0)',
      's': '(s|5|\\$)',
      't': '(t|7|\\+)',
      'l': '(l|1|i)',
      'u': '(u|v)',
      'z': '(z|2)'
    };

    let variation = word.split('').map(char => {
      let replacement = replacements[char] || char;
      return `(${replacement})+`;
    }).join('[\\W_]*');
    
    return variation;
  }

  addBadWord(word) {
    this.badwords.push(word);
    this.updateRegex();
  }

  check(text) {
    return this.regex.test(text);
  }
}

export default Badwords;