const fileUpload = require("express-fileupload");
const XLSX = require("xlsx");
const calculator = require("../xlsx_calculator");
const router = require("express").Router();
const checkAuth = require("../middleware/checkAuth");
const fs = require('fs');


router.post("/sheets", (req, res) => {
    const file = XLSX.read(req.files.file2.data, { type: "buffer" });
    return res.json(file.SheetNames);
  });
  
  router.post("/", (req, res) => {
    const folderName = './files/';

   
  if (!fs.existsSync(folderName)) {
    return "File is not found"
  }
  
  
    const getFile = XLSX.readFile('./files/file.xlsx',{ type: "buffer" })
    const file2 = XLSX.read(req.files.file2.data, { type: "buffer" });
    const results = calculator(
      getFile,
      file2,
      +req.body.file1SheetIndex,
      +req.body.file2SheetIndex
    );
    return res.json(results);
  });

  router.post("/upload", (req, res) => {
    

const folderName = './files/';

    try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  if(req.files)
    {
    const file = req.files.file;
    const filename = "file.xlsx";
    file.mv('./files/'+filename,(err)=>{
      if(err) 
      throw err;
      else
      res.send("file");
    }) 
   }
} catch (err) {
  console.error(err);
}

  });
  module.exports = router;