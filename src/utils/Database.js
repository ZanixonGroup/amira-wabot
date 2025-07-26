import Knex from "knex";
import { dirname } from "desm";
import dotenv from "dotenv";
const __dirname = dirname(import.meta.url)
dotenv.config();

const knex = Knex({
  client: "pg",
  connection: {
    host: '',
    user: '',
    password: '',
    database: '',
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  debug: false,
//searchPath: ["public"],
  asyncStackTraces: true,
});

Object.defineProperties(knex, {
  isAvailable: {
    async value(data, table = "users") {
      const key = Object.keys(data);
      return typeof await knex(table).select(key[0]).where(data).first() == "object";
    }}
});

/*
knex.transaction(async trx => {
  try {
    await trx.schema.raw(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR NOT NULL UNIQUE,
        ticket INTEGER DEFAULT 0,
        credits INTEGER DEFAULT 0,
        subscription JSONB DEFAULT '{"status":false,"expired_date":0}',
        banned BOOLEAN DEFAULT false,
        banned_duration INTEGER DEFAULT 0,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
      
      CREATE TABLE IF NOT EXISTS sewa (
        sewa_id VARCHAR NOT NULL UNIQUE,
        status BOOLEAN NOT NULL DEFAULT FALSE,
        duration BIGINT DEFAULT 0,
        price BIGINT NOT NULL DEFAULT 0,
        paid_by VARCHAR NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW(),
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
      
      CREATE TABLE IF NOT EXISTS config (
        public BOOLEAN DEFAULT FALSE
      )
    `);
    console.log("Table users created!")
  } catch (e) {
    console.error("Error while creating table on db:", e)
  }
});
*/

export default knex;
