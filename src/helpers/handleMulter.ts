import multer from 'multer';

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra mimetype
    const { allowMimes } = req.body as { allowMimes: string[] };
    if (allowMimes && !allowMimes.includes(file.mimetype)) {
      cb(null, false);
      return cb(new Error('File extension not allowed ' + allowMimes.join(', ')));
    }
    return cb(null, true);
  }
});
export default upload;