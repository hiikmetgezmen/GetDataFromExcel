const express = require("express");
const fileUpload = require("express-fileupload");
const XLSX = require("xlsx");
const calculator = require("./xlsx_calculator");
const auth = require("./router/auth.router.js");
const calculate = require("./router/router.router.js");
const cors = require("cors");

const app = express();
const port = 4000



app.set('view engine','ejs');
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use("/api",auth);
app.use("/calculate",calculate);
app.use(express.static("public"));


app.listen(port, () => {
  console.log(`Web sunucusu ${port} portunda başlatıldı.`);
});
