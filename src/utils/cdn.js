import dotenv from "dotenv"; dotenv.config();
import { randomBytes } from "crypto";
import { fileTypeFromBuffer } from "file-type";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const storage = new S3Client({
  endpoint: process.env.DO_SPACES_ENDPOINT,
  region: "us-east-1", // Sesuaikan dengan region Anda
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
});

async function upload(payload) {
  try {
    if (!payload?.content) throw new Error("undefined content payload!");
    if (!Buffer.isBuffer(payload.content)) throw new Error("invalid content!");

    const ftype = await fileTypeFromBuffer(payload.content);
    const string = randomBytes(12).toString("base64").replace(/[\-+\/=]/g, "");

    const key = payload.fileName
      ? payload.fileName.split(".")[1]
        ? `${string}.${payload.fileName.split(".")[1]}`
        : ftype?.ext
        ? `${string}.${ftype?.ext}`
        : `${string}`
      : ftype?.ext
      ? `${string}.${ftype?.ext}`
      : `${string}`;

    const command = new PutObjectCommand({
      Bucket: process.env.DO_SPACES_BUCKET,
      Key: key,
      Body: payload.content,
      ACL: "public-read",
    });

    const data = await storage.send(command);
    return {
      status: true,
      data: {
        name: key,
        url: `https://${process.env.DO_SPACES_BUCKET}.${process.env.DO_SPACES_ENDPOINT}/${key}`.replace("https://sgp1", "sgp1"),
      },
    };
  } catch (e) {
    console.error(e);
    return { status: false, message: e.message };
  }
}

export default { storage, upload };