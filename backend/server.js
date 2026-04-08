const express = require("express");
const multer = require("multer");
const pdfExtract = require("pdf-extraction");
const cors = require("cors");

const app = express();
const upload = multer();

app.use(cors()); // FIXED

app.post("/extract", upload.single("file"), async (req, res) => {
  const data = await pdfExtract(req.file.buffer);

  res.json({ text: data.text });
});

app.listen(4001);
console.log("app running on 4001");
