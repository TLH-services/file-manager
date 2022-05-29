import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

import fileRouter from './routes/file.route';
import path from 'path';

dotenv.config();
const app = express();
const { PORT, MONGO_CONNECTSTRING, MONGO_USER, MONGO_PASSWORD, APP_LIST } = process.env;
const port = parseInt(PORT || '3001', 10);
const appList = APP_LIST?.split(", ") || [];
(async () => {
  await mongoose.connect(MONGO_CONNECTSTRING || '', {
    user: MONGO_USER,
    pass: MONGO_PASSWORD,
  });
  console.log(">> MONGODB connected");
})();

app.use(express.static(path.join(__dirname, 'static'), {
  maxAge: 8640000
}));
app.use(cors(function (req, callback) {
  var corsOptions;
  if (appList.indexOf(req.header('Origin') || '') !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}))
app.use(express.json());
app.use(fileRouter);
app.listen(port, () => {
  console.log(">> Server connected with port: " + port);
});
