import { Router } from "express";
import * as fs from "fs/promises";
import dotenv from "dotenv";
import upload from "@src/helpers/handleMulter";
import FileModel from "@src/models/file.model";
import { uploadFile } from "@src/helpers/uploadFile";

dotenv.config();

const router = Router();

router.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(500).send("File doesn't exists");
    const appName = req.headers['x-app-name'] as string;
    const { width, height } = req.body as { width: number, height: number };
    const result = await uploadFile(req.file, appName, width, height);
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server error');
  }
});

router.post('/api/uploads', upload.array('files'), async (req, res) => {
  try {
    if (!req.files) return res.status(500).send("Files doesn't exists");
    const appName = req.headers['x-app-name'] as string;
    const result = [];
    for (const file of (req.files as Express.Multer.File[])) {
      const ress = await uploadFile(file, appName);
      result.push(ress);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Server error');
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

