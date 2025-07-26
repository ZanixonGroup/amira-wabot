import { format } from "util";

export default [{
  tag: "owner",
  name: "eval",
  command: [">>", ">","eval"],
  options: {
    nonPrefix: true,
    isOwner: true
  },
  code: async(ctx) => {
    var {
    // client
    isPublic,
    Commands,
    Plugins,
    client,
    rawMessage,
    m,
    quoted,
    
    // message property 
    args,
    text,
    body,
    mentions,
    mimetype,
    isQuoted,
    isMedia,
    isBaileys,
    
    // user property
    from,
    sender,
    userId,
    remote,
    pushName,
    isPremium,
    
    // group property
    isGroup,
    groups,
    metadata,
    participants,
    participantIds,
    groupAdmins,
    groupSuperAdmin,
    isAdmin,
    isSuperAdmin,
    isBotAdmin,
    
    // command property
    prefix,
    commandName,
    command,
    commandOptions,
    isCommand,
    plugins,
    alertMessage,
    
    // additional properties
    facemoji,
    logs,
    Func,
    dirname,
    filename,
    hint,
    
    // additional modules
    MessageCollector,
    MessageBuilder,
    VCardBuilder,
    Uploader,
    path,
    fs,
    axios,
    isPubic
  } = ctx;
    let __filename = filename(import.meta.url)
    let __dirname = dirname(import.meta.url)
    
    let evalCmd
    if(!text) return m.reply("Mana kode yang mau di eval?");
    try {
        evalCmd = /await/i.test(text) ? eval("(async() => { " + text + " })()") : eval(m.text)
    } catch (e) {
        m.reply(format(e))
    }
    new Promise(async (resolve, reject) => {
        try {
            resolve(evalCmd);
        } catch (err) {
            reject(err)
        }   
    })
    ?.then((res) => m.reply(format(res)))
    ?.catch((err) => m.reply(format(err)))
  }
}]
