import { model, Schema } from "mongoose";
import type { IFile } from "src/types/file.type";

const FileSchema = new Schema<IFile>({
  url: { type: String, required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  size: { type: Number, required: true },
  appName: { type: String, required: true },
}, { timestamps: true });

const FileModel = model('files', FileSchema);
export default FileModel;