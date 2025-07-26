import cp, { exec as _exec } from 'child_process';
import { promisify } from 'util';
let exec = promisify(_exec).bind(cp);

export default [{
  tag: "owner",
  name: "exec",
  command: ["$", "exec"],
  options: {
    nonPrefix: true,
    isOwner: true
  },
  code: async({ client, m, text, MessageBuilder }) => {
    let message = new MessageBuilder()
      .setStyle(2)
      .build();
    
    if(m.fromMe) return m.reply(`hehe :3\n_~ ztr_`);
    
    let o;
    try {
      o = await exec(text.trimEnd());
    } catch (e) {
      o = e;
    } finally {
      let { stdout, stderr } = o;
      if(!stdout && !stderr) m.reply("no output!");
      if (stdout) m.reply(stdout, message);
      if (stderr) m.reply(stderr, message);
    }
  }
}]