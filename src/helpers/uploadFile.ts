import * as fs from "fs/promises";
import path from "path";
import dotenv from "dotenv";

import FileModel from "@src/models/file.model";

dotenv.config();
const DIR = path.join(__dirname, '../static/files');

export const uploadFile = async (file: Express.Multer.File, appName: string, width = 0, height = 0) => {
  const { originalname, size, buffer } = file;
  const fileName = Date.now() + path.extname(originalname);
  const filePath = path.join(DIR, fileName);
  await fs.writeFile(filePath, buffer);
  const result = await FileModel.create({
    url: `${process.env['APP_URL']}/files/${fileName}`,
    fileName,
    filePath,
    height: height,
    width: width,
    size,
    appName
  })
  return result;
}