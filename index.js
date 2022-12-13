const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const XLXS = require("xlsx");

const Profile = require("./models/profileModel");

mongoose.set("strictQuery", false);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB =
  "mongodb+srv://elle:JrMSZ8Nqp4SjCUba@cluster0.ii1xjsi.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

app.listen(3000, () => {
  console.log("App listen on port 3000");
});

app.get("/", (request, response) => {
  response.render("index");
});

app.get("/zalo", (request, response) => {
  response.render("zalo");
});

app.get("/admin", (req, res) => {
  Profile.find({}, function (error, profiles) {
    res.render("admin/index", {
      profiles: profiles,
    });
  });
});

app.get("/detailCourse", (request, response) => {
  response.render("detailCourse");
});

app.post("/", (req, res) => {
  Profile.create(req.body, (error, data) => {
    res.redirect("/zalo");
  });
});

app.post("/exportdata", (req, res) => {
  const wb = XLXS.utils.book_new(); //new workbook
  Profile.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      let temp = JSON.stringify(data);
      temp = JSON.parse(temp);
      let ws = XLXS.utils.json_to_sheet(temp);
      var down = __dirname + "/public/exportdata.xlsx";
      XLXS.utils.book_append_sheet(wb, ws, "sheet1");
      XLXS.writeFile(wb, down);
      res.download(down);
    }
  });
});
