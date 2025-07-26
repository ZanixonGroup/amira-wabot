import "../config.js";
import util from "util";

// Baileys (WhatsApp Web API)
import * as baileys from "@whiskeysockets/baileys";
const  {
  Browsers,
  //makeInMemoryStore,
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
} = baileys;

// Logging & Error Handling
import Pino from "pino";
import { Boom } from "@hapi/boom";

// Database
import { ZanixonDB } from "zanixon.db";

// Custom Modules
import { BindClient } from "../libs/serialize.js";
import loadEvents from "../handler/Events.js";

const logger = Pino({
  level: 'info',
  formatters: {
    level(label) {
      return { level: label };
    }
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
  base: {
    pid: false,
    hostname: false,
  }
}, Pino.destination('./wa-logs.txt'));
//const store = makeInMemoryStore({ logger });

let timeout = 0;
let client = null;

async function start() {
  try {
    const auth = await useMultiFileAuthState(global.bot.sessionName);
    client = makeWASocket({
      printQRInTerminal: false,
      browser: Browsers.ubuntu("Chrome"),
      auth: auth.state,
      logger,
    });

    // Setup database
    const db = new ZanixonDB({
      directory: "./database",
      showLogs: true,
      tables: {
        user: "/user/users.json",
        chats: "/user/session/chats.json",
        groups: "/groupsMetadata.json",
        grup: "/grup.json",
        tasks: "/chatbot_queue_tasks.json",
      },
    });

    db.variables(global.variables.user, "user");

    /* Bind events
    store.bind(client.ev);
    client.ev.on("contacts.update", (update) => {
      for (let contact of update) {
        let id = contact.id;
        if (!id) return;
        store.contacts[id] = { id, name: contact.notify };
      }
    });
    */

    await BindClient({ client, db });

    // Pairing login jika belum terdaftar
    if (!client.authState.creds.registered) {
      console.log(
        global.clock.info,
        "[Session]".main,
        "Requesting new session..."
      );

      setTimeout(async () => {
        const pairingCode = await client.requestPairingCode(global.botNumber);
        console.log(">", "Pairing Code:".info, pairingCode.warn);
      }, 5000);
    }

    await loadEvents(client, "events");

    // Session manager
    client.ev.on("creds.update", auth.saveCreds);
    client.ev.on("connection.update", async (update) => {
      const { lastDisconnect, connection } = update;

      if (connection) {
        console.log(global.clock.info, "[Session]".main, "Connecting session...");
      }

      if (timeout > 10) {
        console.log(
          global.clock.info,
          "[Session]".main,
          "Program stopped after 10 reconnect attempts."
        );
        return process.exit(1);
      }

      if (connection === "close") {
        const closeReason = new Boom(lastDisconnect?.error)?.output.statusCode;

        switch (closeReason) {
          case DisconnectReason.badSession:
            console.log(
              global.clock.info,
              "[Session]".main,
              "Bad session file. Please delete old session and login again."
            );
            break;
          case DisconnectReason.connectionClosed:
          case DisconnectReason.connectionLost:
          case DisconnectReason.restartRequired:
          case DisconnectReason.connectionTimedOut:
            timeout++;
            console.log(
              global.clock.info,
              "[Session]".main,
              "Connection issue, reconnecting..."
            );
            await start();
            break;
          case DisconnectReason.connectionReplaced:
            console.log(
              global.clock.info,
              "[Session]".main,
              "Connection replaced. Close other sessions first."
            );
            break;
          case DisconnectReason.loggedOut:
            console.log(
              global.clock.info,
              "[Session]".main,
              "Logged out. Please re-login."
            );
            break;
          case DisconnectReason.multideviceMismatch:
            console.log(
              global.clock.info,
              "[Session]".main,
              "Multi-device mismatch. Please re-login."
            );
            break;
          default:
            console.log(global.clock.info, "[Session]".main, "Connection opened...");
            await start();
        }
      }

      if (connection === "open") {
        console.log(
          global.clock.info,
          "[Session]".main,
          "Client connected on:",
          (client?.user?.id.split(":")[0] || global.botNumber).info
        );
        client.sendMessage(`${global.bot.owner[0]}@s.whatsapp.net`, {
          text: "Amira has connected successfully",
        });
      }
    });

    global.client = client;
  } catch (e) {
    console.error(
      global.clock.info,
      "[ERROR]".danger,
      `Something went wrong in "bot.js":`.warn,
      "\n" + util.format(e).danger
    );
  }
}

export { start, client };