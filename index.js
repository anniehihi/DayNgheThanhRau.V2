const express = require("express");
const app = express();
const ejs = require("ejs");
const mongoose = require("mongoose");

const Profile = require("./models/profileModel");

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
  console.log(req.body);
  Profile.create(req.body, (error, data) => {
    res.redirect("/");
  });
});
