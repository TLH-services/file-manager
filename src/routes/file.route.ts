import { Router } from "express";
import path from "path";
import * as fs from "fs/promises";
import sharp from "sharp";
import dotenv from "dotenv";
import upload from "@src/helpers/handleMulter";
import FileModel from "@src/models/file.model";

dotenv.config();

const router = Router();
const DIR = path.join(__dirname, '../static/files');

router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(500).send("File doesn't exists");
    const appName = req.headers['x-app-name'] as string;
    const { width, height } = req.body as { width: number, height: number };
    const { originalname, size, buffer, mimetype } = req.file;
    const fileName = Date.now() + path.extname(originalname);
    const filePath = path.join(DIR, fileName);
    if (mimetype === 'image/png') await sharp(buffer).png({ quality: 75 }).toFile(filePath);
    if (mimetype === 'image/jpeg') await sharp(buffer).jpeg({ quality: 75 }).toFile(filePath);
    else await fs.writeFile(filePath, buffer);
    const result = await FileModel.create({
      url: `${process.env['APP_URL']}/files/${fileName}`,
      fileName,
      filePath,
      height: height || 0,
      width: width || 0,
      size,
      appName
    })
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server errror');
  }
});

router.get('/api/files', async (req, res) => {
  try {
    const appName = req.headers['x-app-name'] as string;
    const { lastId = null, sort = 'new' } = req.query;
    const match = { appName };
    if (lastId) Object.assign(match, { lastId: sort === 'new' ? { $lt: lastId} : { $gt: lastId} });
    const result = await FileModel.find(match, { _id: 1, url: 1, fileName: 1, width: 1, height: 1, size: 1 }).sort({ createdAt: sort === 'new' ? -1 : 1 });
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server errror');
  }
});

router.delete('/api/file/:id', async (req, res) => {
  try {
    const appName = req.headers['x-app-name'] as string;
    const { id } = req.params;
    const file = await FileModel.findOne({ _id: id, appName});
    if (!file) return res.status(500).send('File not found');
    await fs.unlink(file.filePath);
    await file.deleteOne();
    return res.status(200).json({ oke: 1 });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server errror');
  }

});

export default router;

